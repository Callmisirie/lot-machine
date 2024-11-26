import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    return new NextResponse(JSON.stringify(user), {status: 200} )
  } catch (error) {
    return new NextResponse("error running user api." + error, {status: 500} )  
  }
}