"use server"

import { connectMongoDB } from '@/lib/mongodb';
import Instrument from '@/models/instrument';
import User from '@/models/user';

const deleteInstrument = async (email, instrumentId) => {
  await connectMongoDB();
  
  // Find the user
  const user = await User.findOne({ email });
  
  // Find the user's instruments and remove the specific instrument by its ID
  if (user) {
    const updatedInstruments = await Instrument.findOneAndUpdate(
      { userId: user._id },
      { $pull: { instruments: { _id: instrumentId } } }, // Use $pull with the _id to remove the specific item
      { new: true } // This option returns the updated document
    );
    
    return { success: true, message: "Instrument deleted successfully" };
  } else {
    console.log("User not found");
    return { success: false, message: "User not found" };
  }
}

export default deleteInstrument;
