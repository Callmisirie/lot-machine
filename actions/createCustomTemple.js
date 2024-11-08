"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import CustomTemplate from "@/models/customTemplate";

const createCustomTemplate = async (email, customValue) => {
  try {
    await connectMongoDB();    
    const user = await User.findOne({email});

    if (user) {
      const userCustomTemplete = await CustomTemplate.findOne({userId: user._id});

      if (!userCustomTemplete) {
        await CustomTemplate.create({userId: user._id, customValue});
        console.log("Successfully created custom template");
        return true;
      }

    } else {
      console.log("User does not exists");
      return false; 
    }   
  } catch (error) {
    console.log("Failed to create custom template: ", error);
    return false;
  }
};

export default createCustomTemplate;