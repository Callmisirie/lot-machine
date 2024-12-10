import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";
import Earning from "@/models/earning";
import { v4 as uuidv4 } from 'uuid';
import { outEarnings } from "@/actions/earnings";
import storeProcessedEvent from "@/actions/StoreProcessedEvent";
import BulkWithdrawal from "@/models/bulkWithdrawal";

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
      response = {success: "failed", message:"User does not exist" }
      return new NextResponse(JSON.stringify({success: false, message:"User does not exist"}), { status: 200 });
    }
    if (!userBeneficiary) {
      console.log("User beneficiary does not exist");
      response = {success: "failed", message:"User does not exist" }
      return new NextResponse(JSON.stringify({success: false, message:"User does not exist"}), { status: 200 });
    }
    if (!userEarning) {
      console.log("User earnings does not exist");
      response = {success: "failed", message:"User earnings does not exist" }
      return new NextResponse(JSON.stringify({success: false, message:"User earnings does not exist"}), { status: 200 });
    }
    if (beneficiaryId !== userBeneficiary?.beneficiaryId){
      console.log("Beneficiary id doesn't match");
      response = {success: "failed", message:"Beneficiary id doesn't match" }
      return new NextResponse(JSON.stringify({success: false, message:"Beneficiary id doesn't match"}), { status: 200 });
    }
    if (!userEarning?.balance){
      console.log("Your balance is empty");
      response = {statusuccess: "failed", message:"Your balance is empty" }
      return new NextResponse(JSON.stringify({success: false, message:"Your balance is empty"}), { status: 200 });
    }
    if (currentMonthOutEarnings) {
      console.log("One withdrawal per month");
      response = {success: "failed", message:"One withdrawal per month" }
      return new NextResponse(JSON.stringify({success: false, message:"One withdrawal per month"}), { status: 200 });
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
    // const data = {customer: {email}, flwRef: uniqueId};

    const flwRef = "dfs23fhr7ntg0293148_PMCKDU_1";
    const data = {customer: {email}, flwRef};
    const payload = {
      account_bank,
      account_number,
      amount: userEarning.balance,
      currency,
      reference: flwRef, 
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
      const bulkWithdrawal = await BulkWithdrawal.findOne();
      
      if(!bulkWithdrawal) {
        await BulkWithdrawal.create({
          bulkWithdrawals: [{
            account_bank, account_number,
            amount: userEarning.balance, 
            currency, reference: flwRef,
            debit_currency: "NGN", email
          }]
        })
      } else {
        bulkWithdrawal.bulkWithdrawals.push({
          account_bank, account_number,
          amount: userEarning.balance, 
          currency, reference: flwRef,
          debit_currency: "NGN", email
        })
      }

      bulkWithdrawal.save();
      // const data = {amount: userEarning.balance, reference: uniqueId}
      const data = {amount: userEarning.balance, reference: flwRef}
      await outEarnings(email, data);
    }
      
    console.log("Your withdrawal request has be made");
    return NextResponse.json({success: true, message: "Your withdrawal request has be made"}, { status: 200 });
  } catch (error) {
    console.error("Error in withdrawal request:", error);
    return new NextResponse({success: true, message: "Your withdrawal request failed"}, { status: 500 });
  }
};
