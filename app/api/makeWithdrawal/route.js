import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";
import Earning from "@/models/earning";
import { v4 as uuidv4 } from 'uuid';
import { outEarnings } from "@/actions/earnings";
import storeProcessedEvent from "@/actions/StoreProcessedEvent";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  const uniqueId = uuidv4();
  try {
    await connectMongoDB();
    // Parse the query parameters
    const beneficiaryDetails = JSON.parse(request.nextUrl.searchParams.get("beneficiaryDetails"));
    const { email, currency, beneficiaryId, account_number, account_bank } = beneficiaryDetails;
    
    const user = await User.findOne({ email });
    const userBeneficiary = await Beneficiary.findOne({ userId: user._id });
    const userEarning = await Earning.findOne({ userId: user._id });
    const currentYear = new Date().getFullYear(); // Get current year
    const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)
    const currentMonthOutEarnings = userEarning?.out?.find(
      (entry) => entry.year === currentYear && entry.month === currentMonth
    );

    let response;

    if (!user) {
      console.log("User does not exist");
      response = {status: "failed", message:"User does not exist" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }
    if (!userBeneficiary) {
      console.log("User beneficiary does not exist");
      response = {status: "failed", message:"User does not exist" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }
    if (!userEarning) {
      console.log("User earnings does not exist");
      response = {status: "failed", message:"User earnings does not exist" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }
    if (beneficiaryId !== userBeneficiary?.beneficiaryId){
      console.log("Beneficiary id doesn't match");
      response = {status: "failed", message:"Beneficiary id doesn't match" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }
    if (!userEarning?.balance){
      console.log("Your balance is empty");
      response = {status: "failed", message:"Your balance is empty" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }
    if (currentMonthOutEarnings) {
      console.log("Only one withdraw can be made a month");
      response = {status: "failed", message:"Only one withdraw can be made a month" }
      return new NextResponse(JSON.stringify(response), { status: 200 });
    }

    // const payload = {
    //   account_bank,
    //   account_number,
    //   amount: userEarning.balance,
    //   currency,
    //   reference: uniqueId, 
    //   debit_currency: "NGN",
      // meta: {
      //   email: user.email,
      // },
    // };
    // const data = {customer: {email}, txRef: uniqueId};

    const txRef = "dfs23fhr7ntg0293117_PMCKDU_1"
    const data = {customer: {email}, txRef};
    const payload = {
      account_bank,
      account_number,
      amount: userEarning.balance,
      currency,
      reference: txRef, 
      debit_currency: "NGN",
      meta: {
        email: user.email,
      },
    };
    
    const storedProcessedEvent = await storeProcessedEvent(data);
    if (storedProcessedEvent?.success && storedProcessedEvent?.stored) {
      console.log("Duplicate found");
      return new NextResponse("Duplicate found", { status: 401 });
    } else {
      response = await flw.Transfer.initiate(payload);
      if (response?.status === "success") {
        outEarnings(email, response?.data);
      }
    }
      
    console.log("Withdrawal: ", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in withdrawal API:", error);
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
};
