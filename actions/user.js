import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

const userAuth = async (name, email) => {
  "use server";

  try {
    await connectMongoDB();    
    const userExists = await User.findOne({email});

    if (!userExists) {
      await User.create({name, email});
      console.log("Successfully registered user");
      return { success: true };
    } else {
      console.log("User already exists");
      return { success: true }; 
    }   
  } catch (error) {
    console.log("Failed to authenticate user on mongoDB: ", error);
    return { success: false };
  }
};

export default userAuth;