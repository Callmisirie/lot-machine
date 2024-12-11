import { connectMongoDB } from "@/lib/mongodb";
import Subscription from "@/models/subscription";
import User from "@/models/user";
import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async () => {
  try {
    await connectMongoDB();

    const now = new Date();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // Four days before now

    // Find all users whose latest subscription has expired more than 4 days ago
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
          latestEndDate: { $lt: fourDaysAgo }, // Match subscriptions expired more than 4 days ago
        },
      },
    ]);

    // Extract user IDs from expired subscriptions
    const expiredUserIds = expiredSubscriptions.map((sub) => sub.userId);

    if (!expiredUserIds?.length) {
      console.log("No expired users to process.");
      return NextResponse.json({ message: "No expired users to process." }, { status: 200 });
    }

    // Update users to "free" plan
    const result = await User.updateMany(
      { _id: { $in: expiredUserIds }, plan: "pro" },
      { $set: { plan: "free" } }
    );

    // Fetch updated user details
    const expiredUsers = await User.find({ _id: { $in: expiredUserIds } });

    if (expiredUsers?.length > 0) {
      await Promise.all(
        expiredUsers.map((expiredUser) =>
          axios.get(`/api/cancelSubscription?email=${encodeURIComponent(expiredUser.email)}`)
        )
      );
    }

    return NextResponse.json(
      { message: `Updated ${result.nModified || 0} users to free plan.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error running update subscriptions API:", error);
    return NextResponse.json(
      { message: `Error running update subscriptions API: ${error.message}` },
      { status: 500 }
    );
  }
};
