"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import addInstrument from "./addInstrument";
import createPartial from "./createPartial";
import { nanoid } from 'nanoid';
import crypto from "crypto";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const userAuth = async (referralId) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const email = user.email;
  const name = user.given_name + " " + user.family_name;
  const secretKey = process.env.SECRET_KEY;
  const secretHash = crypto.createHash("sha256").update(secretKey).digest("hex");
  const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
  const uniqueUsername = (email) => {
    const [localPart] = email.split("@");
    const randomNumber = generateRandomNumber();
    const username = localPart + randomNumber;
    return username;
  };

  if (referralId !== "isLoading") {
    console.log({user});
    
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
  
        const users = await User.find();
        const admin = () => {
          if (users.length === 0) {
            return true;
          } else if (users.length > 0) {
            return false;
          }
        }
        
        const details = () => {
          if (admin()) {
            return {
              name, email, 
              plan: "Master", username, 
              referrerId: uniqueId, 
              adminKey: secretHash
            };
          } else {
            if (referralId !== "none" && referralExists) {
              return {
                name, email, 
                plan, username, 
                referrerId: uniqueId, 
                referralId
              };
            } else if (referralId === "none" || !referralExists) {
              return {
                name, email, 
                plan, username, 
                referrerId: uniqueId }
              ;
            }
          }
        }
  
        const data = await User.create(details());
        const adminKey = data.adminKey
        await addInstrument(email, instrument, nickname);
        await createPartial(email, instrument, lotSize, finalTP, partialTPs);
  
        console.log("Successfully registered user");
        return { success: true, adminKey };
      } else {
        console.log("User already exists");
        return { success: true, adminKey: userExists?.adminKey }; 
      }   
    } catch (error) {
      console.log("Failed to authenticate user on mongoDB: ", error);
      return { success: false };
    }
  } else {
    return {success: false, isLoading: true};
  } 
};

export default userAuth;