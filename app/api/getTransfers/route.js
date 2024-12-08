import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Fetch all transfers (Flutterwave doesn't filter by email)
    const response = await flw.Transfer.fetch();

    if (response.status !== "success") {
      throw new Error(response.message || "Failed to fetch transfers");
    }

    // Filter transfers by email if data includes an email field
    const filteredTransfers = response.data.filter(
      (transfer) => {
        return transfer?.meta?.email === email 
      } // Replace with actual email key in response
    );
 
    return new NextResponse(
      JSON.stringify({ success: true, transfers: filteredTransfers }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
};
