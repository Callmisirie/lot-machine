import Flutterwave from "flutterwave-node-v3";
import { NextResponse } from "next/server";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

export const GET = async (request) => {
  const country = request.nextUrl.searchParams.get("country");
  try {
    const payload = {  
      "country": country 
    }
    const response = await flw.Bank.country(payload)
    return new NextResponse(JSON.stringify(response), {status: 200} )
  } catch (error) {
    console.log(error)
    return new NextResponse("error running get banks api." + error, {status: 500} )  
  }
}

