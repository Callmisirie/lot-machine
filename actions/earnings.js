"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Earning from "@/models/earning";
import Flutterwave from "flutterwave-node-v3";
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
  try {
    await connectMongoDB();

    const user = await User.findOne({ email: response.customer.email });
    const adminUser = await User.findOne({plan: "Master", adminKey: secretHash});
    const referrerId = user?.referralId;
    const referrer = await User.findOne({referrerId});
    let referrerEarnings = await Earning.findOne({ userId: referrer._id });

    
    if (!adminUser) {
      console.log("Admin user does not exist");
      return { success: false, message: "Admin user does not exist" };
    }
    
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

    if (referrer && referrer.plan === "Pro" && referrer.userId !== adminUser.userId) {
      if (!referralCount.success) {
        console.log("Couldn't get total active referral list");
        return {success: false, message: "Couldn't get total active referral list"}
      }
  
      await processInEarnings(
        response, referrer, 
        referrerEarnings, splitShare(referralPercentage), 
        user
      );
      const res = await processInEarnings(
        response, adminUser, 
        adminUserEarnings, splitShare(adminPercentage), 
        user
      );
      return res;
    } else {
      const res = await processInEarnings(
        response, adminUser, 
        adminUserEarnings, splitShare(adminPercentage), 
        user
      );
      return res;
    } 
  } catch (error) {
    console.log("Error updating in earnings: ", error);
    return { success: false, message: "Error updating in earnings" };
  }
};

export const outEarnings = async (email, response) => {
  try {
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }

    let earnings = await Earning.findOne({ userId: user._id });

    const currentYear = new Date().getFullYear(); // Get current year
    const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)
    
    if (earnings) {
      earnings.balance = earnings.balance - response.amount;
      earnings.out.push({
        year: currentYear,
        month: currentMonth,
        amount: response.amount,
        flw_ref: response.reference,
        status: "NEW"
      });
      await earnings.save();
      console.log("Out earnings updated successfully");
      return { success: true, message: "Out earnings updated successfully"};
    } else {
      console.log("User earnings does not exist");
      return { success: false, message: "User earnings does not exist" };
    }
  } catch (error) {
    console.log("Error updating out earnings: ", error);
    return { success: false, message: "Error updating out earnings" };
  }
};

