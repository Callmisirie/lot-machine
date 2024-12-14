import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Beneficiary from "@/models/beneficiary";
import Earning from "@/models/earning";
import { v4 as uuidv4 } from 'uuid';

const currentYear = new Date().getFullYear(); // Get current year
const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)

export const GET = async () => {
  try {
    await connectMongoDB();

    // Get all beneficiaries and earnings
    const beneficiaries = await Beneficiary.find();
    const earnings = await Earning.find().populate("userId"); // Ensure userId is populated

    // Filter eligible earnings
    const eligiblePayoutUsers = earnings.filter((earning) => {
      const hasBalance = earning.balance > 0;
      const noPayoutThisMonth = !earning.out.some(
        (out) => out.year === currentYear && out.month === currentMonth
      );
      const hasBeneficiary = beneficiaries.some(
        (ben) => ben.userId.toString() === earning.userId._id.toString()
      );
      const isNotMasterPlan = earning.userId?.plan !== "Master";

      return hasBalance && noPayoutThisMonth && hasBeneficiary && isNotMasterPlan;
    });

    // Map beneficiaries to enriched data
    const eligiblePayoutBeneficiaries = beneficiaries
      .map((beneficiary) => {
        const matchingEarning = eligiblePayoutUsers.find(
          (earning) => earning.userId._id.toString() === beneficiary.userId.toString()
        );

        if (!matchingEarning) return null;

        // Destructure beneficiary fields for enrichment
        const { accountNumber: account_number, bankCode: account_bank, currency } = beneficiary;

        return {
          account_bank,
          account_number,
          amount: matchingEarning.balance,
          currency,
          reference: uuidv4(), // Generate a unique reference ID
          debit_currency: "NGN",
          meta: {
            email: matchingEarning.userId.email, // Enrich with user email
          },
        };
      })
      .filter((entry) => entry !== null); // Exclude null entries where no match is found
      
      console.log({
        success: true,
        message: "Successfully retrieved eligible payout beneficiaries",
        eligiblePayoutBeneficiaries,
      },);
      

    // Response with eligible payout beneficiaries
    return NextResponse.json(
      {
        success: true,
        message: "Successfully retrieved eligible payout beneficiaries",
        eligiblePayoutBeneficiaries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while getting eligible payout beneficiaries", error);
    return NextResponse.json(
      { success: false, message: "Error while getting eligible payout beneficiaries" },
      { status: 500 }
    );
  }
};
