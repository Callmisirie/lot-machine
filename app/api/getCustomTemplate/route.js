import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import CustomTemplate from "@/models/customTemplate";

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userCustomTemplete = await CustomTemplate.findOne({ userId: user._id });
    return new NextResponse(JSON.stringify(userCustomTemplete), {status: 200} )
  } catch (error) {
    return new NextResponse("error api running." + error, {status: 500} )  
  }
}