"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Subscription from "@/models/subscription";
import Flutterwave from "flutterwave-node-v3";

const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

const verify = async (transaction_id) => {
  try {
    const payload = {"id": transaction_id}
    const response = await flw.Transaction.verify(payload)
    return response
  } catch (error) {
    console.log(error)
  }
}

const addSubscription = async (response) => {
  try {
    const res = await verify(response.id);    
    const {data: {payment_type, meta: {duration}}} = res;
    
    const planDetails = () => {
      let endDate = new Date(); // Current date
      if (duration === "Month") {
        endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
        return { plan: "Pro", period: "Month", endDate };
      }
      if (duration === "Year") {
        endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
        return { plan: "Pro", period: "Year", endDate };
      }
      throw new Error("Invalid subscription duration"); // Catch unsupported durations
    };
    
    await connectMongoDB();
    const user = await User.findOne({ email: response.customer.email });

    if (user) {
      let userSubscriptions = await Subscription.findOne({ userId: user._id });
      const {plan, period, endDate} = planDetails();

      if (!userSubscriptions) {
        // Create a new subscription list for the user
        userSubscriptions = await Subscription.create({
          userId: user._id,
          paymentPlanId: response.paymentPlan,
          subscriptions: [{ plan, period, flw_ref: response.flwRef, payment_type, endDate}]
        });
        console.log("Subscription list created");
      } else {
        // Add the new subscription to the existing list
        userSubscriptions.paymentPlanId = response.paymentPlan;
        userSubscriptions.subscriptions.push({ plan, period, flw_ref: response.flwRef, payment_type, endDate});
        await userSubscriptions.save(); // Save changes to the database
        console.log("Subscription added to existing list");
      }

      return { success: true, message: "Subscription added successfully" };
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error adding subscription: ", error);
    return { success: false, message: "Error adding subscription"};
  }
};

export default addSubscription;
