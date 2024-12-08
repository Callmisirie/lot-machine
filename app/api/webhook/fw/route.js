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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


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

const verifyTransfer = async (id) => {
  try {
    const response = await flw.Transfer.fetch({ id: String(id) }); // Ensure id is a string
    return response;
  } catch (error) {
    console.error("Error verifying transfer:", error);
    return null; // Return null if the verification fails
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
    
    if (payload?.status === "successful" || payload?.transfer?.status === "SUCCESSFUL") {
      const data = () => {
        if (payload?.status === "successful") {
          return payload
        } else if (payload?.transfer?.status === "SUCCESSFUL") {
          const {transfer : {reference, meta: {email}}} = payload;
          return {customer: {email}, txRef: reference};
        }
      }

      const storedProcessedEvent = await storeProcessedEvent(data());
      if (storedProcessedEvent?.success && storedProcessedEvent?.stored) {
        console.log("Duplicate found");
      } else {
        if (payload["event.type"] === "BANK_TRANSFER_TRANSACTION" || "CARD_TRANSACTION") {
          await delay(5000);
          const existingEvent = await verify(payload.id);
          
          if (existingEvent.data.id === payload.id) {
            await addSubscription(payload);
            await inEarnings(payload);
  
            // Trigger Pusher for Bank/Card Transactions
            pusher.trigger('card-bank-channel', 'transaction-event', {
              message: 'Bank or Card transaction processed successfully',
              data: payload, // Send the payload to the frontend
            });

          } else {
            console.log("This webhook does not valid");
            return new NextResponse("This webhook does not valid", { status: 401 });
          }
        } else if (payload["event.type"] === "Transfer") {
          const existingEvent = await verifyTransfer(payload.transfer.id);
          if (existingEvent.data[0].id === payload.transfer.id) {
  
            // Trigger Pusher for Transfers
            pusher.trigger('transfer-channel', 'transfer-event', {
              message: 'Transfer processed successfully',
              data: payload, // Send the payload to the frontend
            });
          } else {
            console.log("This webhook does not valid");
            return new NextResponse("This webhook does not valid", { status: 401 });
          }
        } 
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
