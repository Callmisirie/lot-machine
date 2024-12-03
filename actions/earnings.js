"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Earning from "@/models/earning";
import Flutterwave from "flutterwave-node-v3";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import processInEarnings from "./processInEarnings";
import getReferrals from "@/common/getReferrals";

const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const secretKey = process.env.SECRET_KEY;
const secretHash = crypto.createHash("sha256").update(secretKey).digest("hex");
const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

const referralSplitPercentage = (referrer, totalActiveReferrals) => {
  if (referrer) {
    if (!totalActiveReferrals || totalActiveReferrals >= 0 && totalActiveReferrals < 100) {
      return {referralPercentage: 20, adminPercentage: 70};
    } else if (totalActiveReferrals >= 100 && totalActiveReferrals < 1000) {
      return {referralPercentage: 30, adminPercentage: 60};
    } else if (totalActiveReferrals >= 1000) {
      return {referralPercentage: 40, adminPercentage: 50};
    }
  } else {
    return {referralPercentage: 0, adminPercentage: 90};
  }
}

export const inEarnings = async (response) => {
  const uniqueId = uuidv4();
  try {
    await connectMongoDB();

    const user = await User.findOne({ email: response.customer.email });
    const adminUser = await User.findOne({plan: "Master", adminKey: secretHash});
    const referrerId = user?.referralId;
    const referrer = await User.findOne({referrerId});
    let referrerEarnings = await Earning.findOne({ userId: referrer._id });
    let adminUserEarnings = await Earning.findOne({ userId: adminUser._id });
    
    const referralCount = await getReferrals(response.customer.email);
    const {referralPercentage, adminPercentage} = referralSplitPercentage(referrer.userId !== adminUser.userId ? referrer : null, referralCount.totalActiveReferrals)
    const amount = response.amount;
    const splitShare = (splitType) => {
      const split = (amount * splitType) / 100;
      return split;
    }
    
    if (!user) {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }

    if (!adminUser) {
      console.log("Admin user does not exist");
      return { success: false, message: "Admin user does not exist" };
    }

    if (referrer && referrer.plan === "Pro" && referrer.userId !== adminUser.userId) {
      if (!referralCount.success) {
        console.log("Couldn't get total active referral list");
        return {success: false, message: "Couldn't get total active referral list"}
      }
  
      await processInEarnings(
        response, referrer, 
        referrerEarnings, splitShare(referralPercentage), 
        uniqueId, user
      );
      const res = await processInEarnings(
        response, adminUser, 
        adminUserEarnings, splitShare(adminPercentage), 
        uniqueId, user
      );
      return res;
    } else {
      const res = await processInEarnings(
        response, adminUser, 
        adminUserEarnings, splitShare(adminPercentage), 
        uniqueId, user
      );
      return res;
    } 
  } catch (error) {
    console.log("Error updating in earnings: ", error);
    return { success: false, message: "Error updating in earnings" };
  }
};

export const outEarnings = async (response) => {
  try {
    await connectMongoDB();

    const user = await User.findOne({ email: response.customer.email });
    if (!user) {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }

    let userEarnings = await Earning.findOne({ userId: user._id });

    const currentYear = new Date().getFullYear(); // Get current year
    const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)
    
    if (userEarnings) {
      if (userEarnings.balance === response.balance) {
        userEarnings.balance = 0;
        userEarnings.tx_refs.push({
          tx_ref: response.txRef
        });
        const yearEntry = userEarnings.earnings.find((entry) => entry.year === currentYear);
        if (!yearEntry) {
          userEarnings.earnings.push({
            year: currentYear,
            months: [{
              month: currentMonth,
              in: 0,
              out: response.amount,
              withdrawalId: response.txRef
            }],
          }); 
        } else {
          const monthEntry = yearEntry.months.find((entry) => entry.month === currentMonth);
          if (!monthEntry) {
            yearEntry.months.push({
              month: currentMonth,
              in: 0,
              out: response.amount,
              withdrawalId: response.txRef
            });
          } else {
            monthEntry.out = response.amount;       
          }
        }
        await userEarnings.save();
        console.log("Out earnings updated successfully");
        return { success: true, message: "Out earnings updated successfully"};
      } else {
        console.log("User earnings balance and withdrawal amount does not match"); 
        return { success: false, message: "User earnings balance and withdrawal amount does not match" };
      }
    } else {
      console.log("Withdrawal feature available after first payment");
      return { success: false, message: "Feature not availabe until first payment" };
    }
  } catch (error) {
    console.log("Error updating out earnings: ", error);
    return { success: false, message: "Error updating out earnings" };
  }
};

