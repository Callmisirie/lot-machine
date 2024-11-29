import addSubscription from "@/actions/addSubscription";
import { inEarnings } from "@/actions/earnings";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const secretKey = process.env.SECRET_KEY;
  const secretHash = crypto.createHash("sha256").update(secretKey).digest("hex");

  try {
    // Retrieve the 'verif-hash' from headers
    const signature = req.headers.get("verif-hash");

    // Parse the payload (req.body is a ReadableStream)
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    // Verify the webhook signature
    if (signature !== secretHash) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // Log the components
    console.log(payload);

    if (payload?.status === "successful") {
      await addSubscription(payload);
      await inEarnings(payload);
    }

    // Respond with success
    return new NextResponse("Webhook received successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse(
      `Error processing webhook: ${error.message}`,
      { status: 500 }
    );
  }
};
