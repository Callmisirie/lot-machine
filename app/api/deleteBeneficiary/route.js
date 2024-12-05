import storeBeneficiaryId from "@/actions/storeBeneficiaryId";
import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";
import axios from "axios";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export const GET = async (request) => {
  await connectMongoDB();
  // Parse the query parameters
  const beneficiaryDetails = JSON.parse(request.nextUrl.searchParams.get("beneficiaryDetails"));
  const { email, beneficiaryId } = beneficiaryDetails;
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User does not exist");
    return; 
  }

  const userBeneficiary = await Beneficiary.findOne({ userId: user._id });
  if (userBeneficiary) {
    await Beneficiary.deleteOne({ userId: user._id });
  }

  try {
    // Use Axios to make a manual DELETE request
    const response = await axios.delete(
      `https://api.flutterwave.com/v3/beneficiaries/${beneficiaryId}`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    console.log("Deleted beneficiary: ", response.data);
    return NextResponse.json({ success: response.data.status === "success" ? true : false, data: response.data }, { status: 200 });
  } catch (error) {
    console.error("Error deleting beneficiary:", error.response?.data || error.message);
    return new NextResponse(
      JSON.stringify({ success: false, error: error.response?.data || error.message }),
      { status: 500 }
    );
  }
};
