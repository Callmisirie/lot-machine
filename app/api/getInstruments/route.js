import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Instrument from "@/models/instrument";

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userInstruments = await Instrument.findOne({ userId: user._id });
    const instruments = userInstruments?.instruments;
    return new NextResponse(JSON.stringify(instruments), {status: 200} )
  } catch (error) {
    return new NextResponse("error api running." + error, {status: 500} )  
  }
}