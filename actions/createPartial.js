"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Partial from "@/models/partial";
import Instrument from "@/models/instrument";

const createPartial = async (email, instrument, lotSize, finalTP, partialTPs) => {
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });

    if (user) {
      let userPartials = await Partial.findOne({ userId: user._id });
      let userInstruments = await Instrument.findOne({ userId: user._id });

      // Find the appropriate nickname for the instrument
      const instrumentData = userInstruments.instruments.find(
        (inst) => inst.instrument === instrument
      );
      const nickname = instrumentData ? instrumentData.nickname : null;

      console.log({nickname});
      

      if (!userPartials) {
        // Create a new partial list for the user
        userPartials = await Partial.create({
          userId: user._id,
          partials: [{ instrument, nickname, lotSize, finalTP, partialTPs }]
        });
        console.log("Partial list created: ", userPartials);
      } else {
        // Add the new instrument to the existing list
        userPartials.partials.push({ instrument, nickname, lotSize, finalTP, partialTPs });
        await userPartials.save(); // Save changes to the database
        console.log("Partial added to existing list");
      }

      return { success: true, message: "Partial added successfully" };
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error adding partial: ", error);
    return { success: false, message: "Error adding partial" };
  }
};

export default createPartial;
