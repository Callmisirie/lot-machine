import { connectMongoDB } from "@/lib/mongodb";
import Subscription from "@/models/subscription";
import User from "@/models/user";
import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  let response;
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse("User is required", { status: 400 });
    }

    let userSubscriptions = await Subscription.findOne({ userId: user._id });
    if (!userSubscriptions) {
      return new NextResponse("User subscription is required", { status: 400 });
    }
    
    let getSubsciptionResponse = await flw.Subscription.get({email})
    if (getSubsciptionResponse.status !== "success") {
      throw new Error(getSubsciptionResponse.message || "Failed to fetch subscription");
    }
    
    if (getSubsciptionResponse.status === "success") {
      getSubsciptionResponse = getSubsciptionResponse.data.filter((subscription) => {
        return subscription.status === "active"
      });

      getSubsciptionResponse.map(async(subscription) => {
        const payload={
          id: subscription.id
        }
        const cancelSubscriptionResponse = await flw.Subscription.cancel(payload);
        
        console.log(cancelSubscriptionResponse);
        return response = cancelSubscriptionResponse;
      })
    }

    userSubscriptions.paymentPlanId = 0;
    userSubscriptions.save();
    
    return NextResponse.json("Subscription cancelled successfully", { status: 200 });

  } catch (error) {
    console.error("Error in cancel subscription API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
