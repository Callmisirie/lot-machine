import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Beneficiary from "@/models/beneficiary";
import Earning from "@/models/earning";

const currentYear = new Date().getFullYear(); // Get current year
const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)

export const GET = async () => {
  try {
    await connectMongoDB();

    // Get all beneficiaries
    const beneficiaries = await Beneficiary.find();

    // Get eligible earnings
    const eligiblePayoutUsers = await Earning.find()
      .populate("userId") // Ensure userId relationship is fully populated
      .then((earnings) =>
        earnings.filter((earning) => {
          // Check for non-empty balance
          const hasBalance = earning.balance > 0;

          // Check if no `out` entry exists for the current year and month
          const noPayoutThisMonth = !earning.out.some(
            (out) => out.year === currentYear && out.month === currentMonth
          );

          // Ensure there's a matching beneficiary
          const hasBeneficiary = beneficiaries.some(
            (ben) => ben.userId.toString() === earning.userId._id.toString()
          );

          // Exclude users with "Master" plan
          const user = earning.userId; // Populated user document
          const isNotMasterPlan = user && user.plan !== "Master";

          return hasBalance && noPayoutThisMonth && hasBeneficiary && isNotMasterPlan;
        })
      );

    // Map eligible payout users to enrich beneficiaries with email and balance
    const enrichedBeneficiaries = beneficiaries.map((beneficiary) => {
      const matchingEarning = eligiblePayoutUsers.find(
        (earning) => earning.userId._id.toString() === beneficiary.userId.toString()
      );
    
      if (matchingEarning) {
        return {
          ...beneficiary.toObject(),
          email: matchingEarning.userId.email,
          balance: matchingEarning.balance,
        };
      }
    
      return beneficiary;
    });    

    return NextResponse.json(
      {
        success: true,
        message: "Successfully retrieved enriched beneficiaries",
        enrichedBeneficiaries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while getting enriched beneficiaries", error);
    return NextResponse.json(
      { success: false, message: "Error while getting enriched beneficiaries" },
      { status: 500 }
    );
  }
};
