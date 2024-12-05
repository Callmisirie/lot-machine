import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from '@/models/beneficiary';

export const GET = async (request) => {
  const email = request.nextUrl.searchParams.get("email");
  
  try {
    await connectMongoDB();

    const user = await User.findOne({ email })
    const userBeneficiary = await Beneficiary.findOne({ userId: user._id });
    const beneficiaryId = userBeneficiary?.beneficiaryId;

    return new NextResponse(JSON.stringify({
      success: userBeneficiary ? true : false, 
      beneficiaryId
    }), {status: 200} )
  } catch (error) {
    return new NextResponse("error running beneficiaryId api." + error, {status: 500} )  
  }
}