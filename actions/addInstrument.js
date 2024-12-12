"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Instrument from "@/models/instrument";

const addInstrument = async (email, instrument, nickname) => {
  console.log(email, instrument, nickname);
  
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });

    if (user) {
      let userInstruments = await Instrument.findOne({ userId: user._id });

      if (!userInstruments) {
        // Create a new instrument list for the user
        userInstruments = await Instrument.create({
          userId: user._id,
          instruments: [{ instrument, nickname }]
        });
        console.log("Instrument list created");
      } else {
        if (user.plan === "Free" && userInstruments.instruments?.length >= 3) {
          return { success: false, message: "Instrument slots are filled up" };
        } 
        if (user.plan !== "Free" && userInstruments.instruments?.length >= 6) {
          return { success: false, message: "Instrument slots are filled up" };
        }   
        // Add the new instrument to the existing list
        userInstruments.instruments.push({ instrument, nickname });
        await userInstruments.save(); // Save changes to the database
        console.log("Instrument added to existing list");
      }

      return { success: true, message: "Instrument added successfully" };
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error adding instrument: ", error);
    return { success: false, message: "Error adding instrument"};
  }
};

export default addInstrument;
