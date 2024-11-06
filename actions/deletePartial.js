"use server"

import { connectMongoDB } from '@/lib/mongodb';
import Partial from '@/models/partial';
import User from '@/models/user';

const deletePartial = async (email, partialId) => {
  await connectMongoDB();
  
  // Find the user
  const user = await User.findOne({ email });
  
  // Find the user's partials and remove the specific partial by its ID
  if (user) {
    const updatedPartials = await Partial.findOneAndUpdate(
      { userId: user._id },
      { $pull: { partials: { _id: partialId } } }, // Use $pull with the _id to remove the specific item
      { new: true } // This option returns the updated document
    );
    
    return { success: true, message: "Partial deleted successfully" };
  } else {
    console.log("User not found");
    return { success: false, message: "User not found" };
  }
}

export default deletePartial;
