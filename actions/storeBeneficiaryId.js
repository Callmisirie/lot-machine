"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";

const storeBeneficiaryId = async (email, beneficiaryId) => {  
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });

    if (user) {
      let userBeneficiary = await Beneficiary.findOne({ userId: user._id });

      if (!userBeneficiary) {
        userBeneficiary = await Beneficiary.create({
          userId: user._id,
          beneficiaryId 
        });
        console.log("BeneficiaryId stored successfully");
        return { success: true, message: "BeneficiaryId stored successfully" };
      } else {
        console.log("BeneficiaryId already exists for this user");
        return { success: false, message: "BeneficiaryId already exists for this user" };
      }
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error storing beneficiaryId: ", error);
    return { success: false, message: "Error storing beneficiaryId"};
  }
};

export default storeBeneficiaryId;