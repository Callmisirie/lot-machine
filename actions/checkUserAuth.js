"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

const checkUserAuth = async (email) => {
  try {
    await connectMongoDB(); 
    const userExists = await User.findOne({email});

    if (!userExists) {
      console.log("User not found in DB");
      return false
    } else {
      console.log("User authenticated in DB");
      return true 
    }   
  } catch (error) {
    console.log("Failed to authenticate user in DB: ", error);
    return false
  }
};

export default checkUserAuth;