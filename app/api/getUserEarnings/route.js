import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Earning from '@/models/earning';

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userEarnings = await Earning.findOne({ userId: user._id });
    return new NextResponse(JSON.stringify({success: true, userEarnings}), {status: 200} )
  } catch (error) {
    return new NextResponse("error running earnings api." + error, {status: 500} )  
  }
}