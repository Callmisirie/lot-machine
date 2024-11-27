"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Subscription from "@/models/subscription";

const addSubscription = async (response) => {
  console.log(response);
  
  const planDetails = () => {
    let endDate = new Date(); // Current date
    if (response?.amount === 100) {
      endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
      return { plan: "Pro", period: "Month", endDate };
    }
    if (response?.amount === 1000) {
      endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
      return { plan: "Pro", period: "Year", endDate };
    }
    throw new Error("Invalid subscription amount"); // Catch unsupported amounts
  };
  
  try {
    await connectMongoDB();
    const user = await User.findOne({ email: response.customer.email });

    if (user) {
      let userSubscriptions = await Subscription.findOne({ userId: user._id });
      const {plan, period, endDate} = planDetails();

      if (!userSubscriptions) {
        // Create a new subscription list for the user
        userSubscriptions = await Subscription.create({
          userId: user._id,
          subscriptions: [{ plan, period, endDate}]
        });
        console.log("Subscription list created: ", userSubscriptions);
      } else {
        // Add the new subscription to the existing list
        userSubscriptions.subscriptions.push({ plan, period, endDate});
        await userSubscriptions.save(); // Save changes to the database
        console.log("Subscription added to existing list");
      }

      return { success: true, message: "Subscription added successfully" };
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error adding subsription: ", error);
    return { success: false, message: "Error adding subsription"};
  }
};

export default addSubscription;
