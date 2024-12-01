import addSubscription from "@/actions/addSubscription";
import { inEarnings } from "@/actions/earnings";
import crypto from "crypto";
import { NextResponse } from "next/server";
import Flutterwave from "flutterwave-node-v3";
import storeProcessedEvent from "@/actions/StoreProcessedEvent";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

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

    console.log("Webhook payload received:", payload);

    const resendHooks = async () => {
      try {
        const resendPayload = { "id": payload?.id }; // Use a different variable name
        const response = await flw.Transaction.resend_hooks(resendPayload);
        console.log("Resend hooks response:", response);
      } catch (error) {
        console.error("Error resending hooks:", error);
      }
    };
    
    const verify = async () => {
      try {
        const verifyPayload = {"id": payload?.id}
        const response = await flw.Transaction.verify(verifyPayload)
        return response
      } catch (error) {
        console.log(error)
      }
    }
    const existingEvent = await verify();

    if (payload?.status === "successful") {
      const storedProcessedEvent = await storeProcessedEvent(payload);

      if (storedProcessedEvent.success) {
        if (storedProcessedEvent.stored) {
          console.log("Duplicate found");
        } else {
          if (payload["event.type"] === "BANK_TRANSFER_TRANSACTION" || "CARD_TRANSACTION") {
            await addSubscription(payload);
            await inEarnings(payload);
          } else if (payload["event.type"] === "TRANSFER_TRANSACTION") {
            // await outEarnings(payload);
          } 
        }
          
          // await resendHooks();
      }
    } else {
      // if (existingEvent?.data.status === payload.status) {
      //   console.log("Duplicate found");
      // }  
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




