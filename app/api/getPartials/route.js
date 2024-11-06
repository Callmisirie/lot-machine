import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Partial from '@/models/partial';

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userPartials = await Partial.findOne({ userId: user._id });
    const partials = userPartials?.partials;
    return new NextResponse(JSON.stringify(partials), {status: 200} )
  } catch (error) {
    return new NextResponse("error running partials api." + error, {status: 500} )  
  }
}