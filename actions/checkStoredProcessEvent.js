"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import StoredProcessedEvent from "@/models/storedProcessedEvent";

const checkStoredProcessedEvent = async (response) => {
  try {    
    await connectMongoDB();
    const user = await User.findOne({ email: response.customer.email });

    if (user) {
      let userStoredProcessedEvents = await StoredProcessedEvent.findOne({ userId: user._id });

      if (userStoredProcessedEvents) {
        const storedProcessedEventExists = userStoredProcessedEvents.storedProcessedEvents.find((processedEvent) => processedEvent.tx_ref === response.txRef);

        if (storedProcessedEventExists) {
          console.log("Event already stored");
          return { success: true, stored: true, message: "Event already stored" };
        } else {
          console.log("Event is not stored");
          return { success: true, stored: false, message: "Event not stored" };
        }
      } else {
        console.log("Stored processed event list not found ");
        return { success: true, message: "Processed event list not found" };
      }
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error checking stored processed event: ", error);
    return { success: false, message: "Error checking stored processed event"};
  }
};

export default checkStoredProcessedEvent;
