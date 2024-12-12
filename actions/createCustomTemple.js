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

      if (!userCustomTemplete && user.plan !== "Free") {
        await CustomTemplate.create({userId: user._id, customValue});
        console.log("Created Successfully");
        return { success: true, message: "Created Successfully"};;
      } else {
        return { success: false, message: "Free plan, can't create" };
      }

    } else {
      console.log("User does not exists");
      return { success: false, message: "User does not exists" };
    }   
  } catch (error) {
    console.log("Failed to create custom template: ", error);
    return { success: false, message: "Error, failed to create" };
  }
};

export default createCustomTemplate;