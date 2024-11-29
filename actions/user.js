import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import addInstrument from "./addInstrument";
import createPartial from "./createPartial";
import { nanoid } from 'nanoid';

const userAuth = async (name, email, referralId) => {
  "use server";

  const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
  
  const uniqueUsername = (email) => {
    const [localPart] = email.split("@");
    const randomNumber = generateRandomNumber();
    const username = localPart + randomNumber;
    return username;
  };

  try {
    await connectMongoDB();    
    const userExists = await User.findOne({email});

    if (!userExists) {
      const plan = "Free"
      const instrument = "XAUUSD";
      const nickname = "Alchemy";
      const lotSize = 0.92;
      const finalTP = 8;
      const partialTPs = [2, 4.8, 6.3];
      const uniqueId = nanoid();
      const username = uniqueUsername(email);
      const referralExists = await User.findOne({referrerId: referralId});

      if (referralId !== "none" && referralExists) {
        await User.create({name, email, plan, username, referrerId: uniqueId, referralId});
      } 

      if (referralId === "none" || !referralExists) {
        await User.create({name, email, plan, username, referrerId: uniqueId });
      }

      await addInstrument(email, instrument, nickname);
      await createPartial(email, instrument, lotSize, finalTP, partialTPs);

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