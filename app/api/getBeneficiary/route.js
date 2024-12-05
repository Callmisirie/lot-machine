import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  try {
    // Parse the query parameters
    const beneficiaryId = request.nextUrl.searchParams.get("beneficiaryId");
    console.log(beneficiaryId);
    
    // Example fetch action (modify payload if necessary)
    const response = await flw.Beneficiary.fetch({ id: beneficiaryId }); // Replace with dynamic ID
    console.log("Fetched beneficiary: ", response);
    return new NextResponse(JSON.stringify({success: response.status === "success" ? true : false, beneficiary: response.data}), {status: 200} )
    
  } catch (error) {
    console.error("Error in fetching beneficiary API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
