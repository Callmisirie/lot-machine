"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Beneficiary from "@/models/beneficiary";

const storeBeneficiary = async (email, data) => { 
  const {
    id: beneficiaryId, account_number: accountNumber, 
    bank_code: bankCode, bank_name: bankName, currency
  } = data;
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });

    if (user) {
      let userBeneficiary = await Beneficiary.findOne({ userId: user._id });

      if (!userBeneficiary) {
        userBeneficiary = await Beneficiary.create({
          userId: user._id, beneficiaryId,
          accountNumber, bankCode,
          bankName, currency
        });
        console.log("Beneficiary stored successfully");
        return { success: true, message: "Beneficiary stored successfully" };
      } else {
        console.log("Beneficiary already exists for this user");
        return { success: false, message: "Beneficiary already exists for this user" };
      }
    } else {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }
  } catch (error) {
    console.log("Error storing beneficiary: ", error);
    return { success: false, message: "Error storing beneficiary"};
  }
};

export default storeBeneficiary;