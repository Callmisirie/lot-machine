"use server"

import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';

const getReferrals = async (email) => {
  await connectMongoDB();
  const user = await User.findOne({ email });
  const referrerId = user.referrerId;

  const referredUsers = await User.find({referralId: referrerId});
  const activeReferredUsers = referredUsers?.filter((user)  => user?.plan === "Pro");
  const totalReferrals = referredUsers?.length;
  const totalActiveReferrals = activeReferredUsers?.length;

  return {success: true, userPlan: user.plan, referredUsers, totalReferrals, totalActiveReferrals};
}

export default getReferrals;