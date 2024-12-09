import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Subscription from '@/models/subscription';

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userSubscriptions = await Subscription.findOne({ userId: user._id });
    const {subscriptions, paymentPlanId} = userSubscriptions;
    return new NextResponse(JSON.stringify({
      success: true, 
      paymentPlanId, 
      subscriptions
    }), {status: 200} )
  } catch (error) {
    return new NextResponse("error running subscriptions api." + error, {status: 500} )  
  }
}