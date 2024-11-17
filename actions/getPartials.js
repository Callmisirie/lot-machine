"use server"

import { connectMongoDB } from '@/lib/mongodb';
import Partial from '@/models/partial';
import User from '@/models/user';

const getPartials = async (email) => {
  await connectMongoDB();
  const user = await User.findOne({ email })
  const userPartials = await Partial.findOne({ userId: user._id });
  const partials = userPartials?.partials;
  console.log(partials);
  return partials;
}

export default getPartials;