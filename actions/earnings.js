"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Earning from "@/models/earning";
import Flutterwave from "flutterwave-node-v3";
import { v4 as uuidv4 } from 'uuid';

const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const inEarnings = async (response) => {
  const uniqueId = uuidv4();
  try {
    await connectMongoDB();

    const user = await User.findOne({ email: response.customer.email });
    if (!user) {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
    
    const referrerId = user?.referralId;
    const referrer = await User.findOne({referrerId});

    if (referrer) {
      const amount = response.amount;
      
      const splitShare = () => {
        const split = (amount * 20) / 100;
        return split
      }
      const currentYear = new Date().getFullYear(); // Get current year
      const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)
  
      let userEarnings = await Earning.findOne({ userId: referrer._id });
  
      if (!userEarnings) {
        // Create a new Earning document if it doesn't exist
        userEarnings = await Earning.create({
          userId: referrer._id,
          balance: splitShare(),
          tx_refs: [
            {
              tx_ref: response.txRef
            }
          ],
          earnings: [
            {
              year: currentYear,
              months: [
                {
                  month: currentMonth,
                  in: splitShare(),
                  out: 0,
                  withdrawalId: uniqueId
                },
              ],
            },
          ],
        });
      } else {
        // Update existing Earning document
        userEarnings.balance = userEarnings.balance + splitShare();
  
        const yearEntry = userEarnings.earnings.find((entry) => entry.year === currentYear);
        if (!yearEntry) {
          // Add a new year if it doesn't exist
          userEarnings.earnings.push({
            year: currentYear,
            tx_refs: [
              {
                tx_ref: response.txRef
              }
            ],
            months: [
              {
                month: currentMonth,
                in: splitShare(),
                out: 0,
                withdrawalId: uniqueId
              },
            ],
          });
        } else {
          // Update the existing year
          const monthEntry = yearEntry.months.find((entry) => entry.month === currentMonth);
          if (!monthEntry) {
            // Add a new month if it doesn't exist
            userEarnings.tx_refs.push({
              tx_ref: response.txRef
            });

            yearEntry.months.push({
              month: currentMonth,
              in: splitShare(),
              out: 0,
              withdrawalId: uniqueId
            });
          } else {
            // Update the existing month
            userEarnings.tx_refs.push({
              tx_ref: response.txRef
            });

            monthEntry.in = monthEntry.in + splitShare();
          }
        }
      }
      await userEarnings.save();
      console.log("Earnings updated successfully"); 
    } else {
      console.log("User does not have a referrer exist");
      return { success: false, message: "User does not have a referrer exist" };
    }
    return { success: true, message: "Earnings updated successfully" };
  } catch (error) {
    console.log("Error updating earnings: ", error);
    return { success: false, message: "Error updating earnings" };
  }
};
