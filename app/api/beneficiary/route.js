import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  try {
    // Parse the query parameters
    const beneficiaryDetails = JSON.parse(request.nextUrl.searchParams.get("beneficiaryDetails"));
    const { accountNumber, isFetchAction, accountBank, beneficiaryName } = beneficiaryDetails;
    
    if (isFetchAction) {
      // Example fetch action (modify payload if necessary)
      const response = await flw.Beneficiary.fetch({ "id": "2923" }); // Replace with dynamic ID
      return NextResponse.json(response, { status: 200 });
    } else {
      console.log({ accountNumber, isFetchAction, accountBank, beneficiaryName });
      // Create beneficiary action
      const payload = {
        account_number: accountNumber,
        account_bank: accountBank,
        beneficiary_name: beneficiaryName,
      };

      const response = await flw.Beneficiary.create(payload);
      console.log("Flutterwave Response:", response);
      
      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    console.error("Error in beneficiary API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
