import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const referrerId = user.referrerId;

    const referredUsers = await User.find({referralId: referrerId});
    const activeReferredUsers = referredUsers?.filter((user)  => user?.plan === "Pro");
    const totalReferrals = referredUsers?.length;
    const totalActiveReferrals = activeReferredUsers?.length;
    return new NextResponse(JSON.stringify({
      success: true, 
      userPlan: user.plan, 
      referredUsers, 
      totalReferrals, 
      totalActiveReferrals
    }), {status: 200} )
  } catch (error) {
    return new NextResponse("error running referrals count api." + error, {status: 500} )  
  }
}