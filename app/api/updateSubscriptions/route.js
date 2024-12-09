import { connectMongoDB } from "@/lib/mongodb";
import Subscription from "@/models/subscription";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    await connectMongoDB();

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // Two days before now

    // Find all users whose latest subscription has expired more than 2 days ago
    const expiredSubscriptions = await Subscription.aggregate([
      {
        $addFields: {
          latestEndDate: {
            $arrayElemAt: ["$subscriptions.endDate", -1], // Get the last subscription's endDate
          },
        },
      },
      {
        $match: {
          latestEndDate: { $lt: twoDaysAgo }, // Match subscriptions expired more than 2 days ago
        },
      },
    ]);

    // Extract user IDs from expired subscriptions
    const expiredUserIds = expiredSubscriptions.map((sub) => sub.userId);

    // Update users to "free" plan
    const result = await User.updateMany(
      { _id: { $in: expiredUserIds }, plan: "pro" },
      { $set: { plan: "free" } }
    );

    return new NextResponse(
      `Updated ${result.nModified || 0} users to free plan.`,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      "Error running update subscriptions API: " + error.message,
      { status: 500 }
    );
  }
};
