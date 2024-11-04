"use server"

import { connectMongoDB } from '@/lib/mongodb';
import Instrument from '@/models/instrument';
import User from '@/models/user';

const getInstruments = async ({email}) => {
  await connectMongoDB();
  const user = await User.findOne({ email })
  const userInstruments = await Instrument.findOne({ userId: user._id });
  const instruments = userInstruments?.instruments;
  console.log(instruments);
  return {instruments};
}

export default getInstruments;