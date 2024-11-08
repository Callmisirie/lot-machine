"use server"

import { connectMongoDB } from '@/lib/mongodb';
import CustomTemplate from '@/models/customTemplate';
import User from '@/models/user';

const deleteCustomTemplate = async (email, customTemplateId) => {
  await connectMongoDB();
  
  // Find the user
  const user = await User.findOne({ email });
  
  if (user) {
    await CustomTemplate.findOneAndDelete({_id: customTemplateId})
    return { success: true, message: "Custom template deleted successfully" };
  } else {
    console.log("User not found");
    return { success: false, message: "User not found" };
  }
}

export default deleteCustomTemplate;
