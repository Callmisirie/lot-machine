"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import StoredProcessedEvent from "@/models/storedProcessedEvent";

const storeProcessedEvent = async (response) => {
  console.log(response);
  
  try {    
    await connectMongoDB();
    const user = await User.findOne({ email: response.customer.email });

    if (user) {
      let userStoredProcessedEvents = await StoredProcessedEvent.findOne({ userId: user._id });

      if (!userStoredProcessedEvents) {
        // Create a new stored processed event list for the user
        userStoredProcessedEvents = await StoredProcessedEvent.create({
          userId: user._id,
          storedProcessedEvents: [{ tx_ref: response.txRef }]
        });
        console.log("Stored processed event to db");
        return { success: true, stored: false, message: "Stored processed event to db" };
      } else {
        const storedProcessedEventExists = userStoredProcessedEvents.storedProcessedEvents.find((processedEvent) => processedEvent.tx_ref === response.txRef);
        
        if (storedProcessedEventExists) {
          console.log("Processed event already stored to db");
          return { success: true, stored: true, message: "Event already stored" };
        } else {
          // Add the new stored processed event to the existing list
          userStoredProcessedEvents.storedProcessedEvents.push({ tx_ref: response.txRef});
          await userStoredProcessedEvents.save(); // Save changes to the database
          console.log("Stored processed event to db");
          return { success: true, stored: false, message: "Stored processed event to db" };
        }
      }
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error storing processed event: ", error);
    return { success: false, message: "Error storing processed event"};
  }
};

export default storeProcessedEvent;
