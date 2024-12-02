"use server"

import addSubscription from "./addSubscription";
import { inEarnings } from "./earnings";

const processSuccessfulWebhook = async (storedProcessedEvent, payload) => {
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
  }
}

export default processSuccessfulWebhook