import mongoose, { models, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    }, 
    paymentPlanId: {
      type: Number
    },
    subscriptions: [
      {
        plan: {
          type: String,
        },
        period: {
          type: String,
        },
        flw_ref: {
          type: String,
        },
        payment_type: {
          type: String,
        },
        startDate: {
          type: Date,
          default: Date.now, // Automatically sets the current date
        },
        endDate: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const Subscription = models.Subscription || mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
