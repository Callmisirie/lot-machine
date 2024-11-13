"use server";

import userAuth from "@/actions/user";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function checkAuthStatus() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
 
	if (!user) return { success: false };

  await connectMongoDB();
	const existingUser = await User.findOne({email: user.email});

	// sign up
	if (!existingUser) {
    const res = await userAuth(user.given_name + " " + user.family_name, user.email);
    return res;
	}

	return { success: true };
}