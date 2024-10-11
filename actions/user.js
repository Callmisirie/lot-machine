import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

const userAuth = async (name, email) => {
  "use server";

  try {
    const userExists = await User.findOne({email});

    if (!userExists) {
      await connectMongoDB();
      await User.create({name, email});
      console.log("Successfully registered user");
    } else {
      console.log("User already exists"); 
    }   
  } catch (error) {
    console.log("Failed to authenticate user: ", error);
  }
};

export default userAuth;