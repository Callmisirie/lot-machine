import crypto from "crypto";
import { NextResponse } from "next/server";
import Flutterwave from "flutterwave-node-v3";
import storeProcessedEvent from "@/actions/StoreProcessedEvent";
import Pusher from 'pusher';
import addSubscription from "@/actions/addSubscription";
import { inEarnings } from "@/actions/earnings";

const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.TEST_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_SECRET_KEY = process.env.TEST_FLUTTERWAVE_SECRET_KEY;

const flw = new Flutterwave(TEST_FLUTTERWAVE_PUBLIC_KEY, TEST_FLUTTERWAVE_SECRET_KEY);

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID, 
  key: process.env.PUSHER_KEY, 
  secret: process.env.PUSHER_SECRET, 
  cluster: "mt1",
  useTLS: true,
});

const verify = async (id) => {
  try {
    const verifyPayload = {id}
    const response = await flw.Transaction.verify(verifyPayload);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const resendHooks = async (id) => {
  try {
    const resendPayload = { id }; // Use a different variable name
    const response = await flw.Transaction.resend_hooks(resendPayload);
    console.log("Resend hooks response:", response);
  } catch (error) {
    console.error("Error resending hooks:", error);
  }
};

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

    if (payload?.status === "successful") {
      const storedProcessedEvent = await storeProcessedEvent(payload);
      if (storedProcessedEvent?.success && storedProcessedEvent?.stored) {
        console.log("Duplicate found");
      } else {
        if (payload["event.type"] === "BANK_TRANSFER_TRANSACTION" || "CARD_TRANSACTION") {
          await addSubscription(payload);
          await inEarnings(payload);
        }
      }
    
      // Pass payload to the frontend via Pusher
      pusher.trigger('my-channel', 'my-event', {
        message: 'Webhook processed successfully',
        data: payload,  // Send the payload to the frontend
      });
    } else if (payload?.transfer?.status === "SUCCESSFUL") {
      if (payload["event.type"] === "Transfer") {
        console.log("Transfer webhook was logged");
      } 
    } else {
      console.log("Webhook status is not successful.");
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
