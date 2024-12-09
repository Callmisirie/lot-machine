import storeBeneficiary from "@/actions/storeBeneficiary";
import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  try {
    await connectMongoDB();
    // Parse the query parameters
    const beneficiaryDetails = JSON.parse(request.nextUrl.searchParams.get("beneficiaryDetails"));
    const { email, accountNumber, accountBank, beneficiaryName, currency } = beneficiaryDetails;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exist");
      return; 
    }

    const userBeneficiary = await Beneficiary.findOne({ userId: user._id });
    if (userBeneficiary) {
      await Beneficiary.deleteOne({ userId: user._id });
    }
    
    // Create beneficiary action
    const payload = {
      account_number: accountNumber,
      account_bank: accountBank,
      beneficiary_name: beneficiaryName,
    };
    const response = await flw.Beneficiary.create(payload);
    if (response.status === "success") {
      const {data: {id, account_number, bank_code, bank_name}} = response;
      const data = {id, account_number, bank_code, bank_name, currency};

      await storeBeneficiary(email, data);
    }

    console.log(response);
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in add beneficiary API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
