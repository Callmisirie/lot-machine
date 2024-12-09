import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const referrerId = user.referrerId;

    let users = await User.find()
    users = users?.filter((user)  => user?.plan === "Pro" || user?.plan === "Free");
    const activeUsers = users?.filter((user)  => user?.plan === "Pro");
    const totalUsers = users?.length;
    const totalActiveUsers = activeUsers?.length;

    const referredUsers = users?.filter((user)  => user?.referralId === referrerId);
    const activeReferredUsers = referredUsers?.filter((user)  => user?.plan === "Pro");
    const totalReferrals = referredUsers?.length;
    const totalActiveReferrals = activeReferredUsers?.length;
    return new NextResponse(JSON.stringify({
      success: true, 
      userPlan: user.plan, 
      referredUsers, 
      totalReferrals, 
      totalActiveReferrals,
      users, 
      totalUsers, 
      totalActiveUsers
    }), {status: 200} )
  } catch (error) {
    return new NextResponse("error running referrals count api." + error, {status: 500} )  
  }
}