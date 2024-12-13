"use server"

import { connectMongoDB } from "@/lib/mongodb";
import Earning from "@/models/earning";

const processInEarnings = async (response, earner, earnings, splitShare, user) => {
 try {
   await connectMongoDB();
   const currentYear = new Date().getFullYear();
   const currentMonth = new Date().getMonth() + 1; 

   console.log({response, earner, earnings, splitShare, user});
   
   if (!earnings) {
     // Create a new Earning document if it doesn't exist
     earnings = await Earning.create({
       userId: earner._id,
       balance: splitShare,
       in: [{
         year: currentYear,
         month: currentMonth,
         amount: splitShare,
         flw_ref: response.flwRef
       }]
     });
   } else {
     // Update existing Earning document
     earnings.balance = earnings.balance + splitShare;
     earnings.in.push({
       year: currentYear,
       month: currentMonth,
       amount: splitShare,
       flw_ref: response.flwRef
     });
   }
   
   user.plan = "Pro";
   await user.save();
   await earnings.save();
   console.log("In earnings updated successfully"); 
   return { success: true, message: "In earnings updated successfully" }
 } catch (error) {
  console.error("Error updating in earings: ", error);
  
  return { success: false, message: "Error updating in earning " }
 }
}

export default processInEarnings