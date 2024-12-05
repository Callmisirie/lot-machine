import storeBeneficiaryId from "@/actions/storeBeneficiaryId";
import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";
import Earning from "@/models/earning";
import { v4 as uuidv4 } from 'uuid';
import { outEarnings } from "@/actions/earnings";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  const uniqueId = uuidv4();
  try {
    await connectMongoDB();
    // Parse the query parameters
    const beneficiaryDetails = JSON.parse(request.nextUrl.searchParams.get("beneficiaryDetails"));
    const { email, beneficiaryId, account_number, account_bank } = beneficiaryDetails;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exist");
      return; 
    }

    const userBeneficiary = await Beneficiary.findOne({ userId: user._id });
    if (!userBeneficiary) {
      console.log("User beneficiary does not exist");
      return;
    }

    const userEarning = await Earning.findOne({ userId: user._id });
    if (!userBeneficiary) {
      console.log("User earnings does not exist");
      return;
    }

    if (beneficiaryId !== userBeneficiary.beneficiaryId){
      console.log("Beneficiary id doesn't match");
      return;
    }
    
    // Create beneficiary action
    const payload = {
      account_bank,
      account_number,
      amount: userEarning.balance,
      currency: "NGN",
      reference: uniqueId, 
      debit_currency: "NGN"
    };
    const response = await flw.Transfer.initiate(payload);

    if (response.status === "success") {
      outEarnings(email, response.data);
    }

    console.log("Withdrawal: ", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in withdrawal API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
