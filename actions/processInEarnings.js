"use server"

import { connectMongoDB } from "@/lib/mongodb";
import Earning from "@/models/earning";

const processInEarnings = async (response, earner, earnings, splitShare, uniqueId, user) => {
 
    await connectMongoDB();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 

    if (!earnings) {
      // Create a new Earning document if it doesn't exist
      earnings = await Earning.create({
        userId: earner._id,
        balance: splitShare,
        tx_refs: [{
          tx_ref: response.txRef
        }],
        earnings: [{
          year: currentYear,
          months: [{
            month: currentMonth,
            in: splitShare,
            out: 0,
            withdrawalId: uniqueId
          }]
        }],
      });
    } else {
      // Update existing Earning document
      earnings.balance = earnings.balance + splitShare;
      earnings.tx_refs.push({
        tx_ref: response.txRef
      });
      const yearEntry = earnings.earnings.find((entry) => entry.year === currentYear);
      if (!yearEntry) {
        // Add a new year if it doesn't exist
        earnings.earnings.push({
          year: currentYear,
          months: [{
            month: currentMonth,
            in: splitShare,
            out: 0,
            withdrawalId: uniqueId
          }],
        });
      } else {
        // Update the existing year
        const monthEntry = yearEntry.months.find((entry) => entry.month === currentMonth);
        if (!monthEntry) {
          // Add a new month if it doesn't exist
          yearEntry.months.push({
            month: currentMonth,
            in: splitShare,
            out: 0,
            withdrawalId: uniqueId
          });
        } else {
          // Update the existing month
          monthEntry.in = monthEntry.in + splitShare;
        }
      }
    }
    
    user.plan = "Pro";
    await user.save()
    await earnings.save();
    console.log("In earnings updated successfully"); 
    return { success: true, message: "In earnings updated successfully to admin" }
}

export default processInEarnings