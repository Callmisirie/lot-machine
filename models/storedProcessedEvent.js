import mongoose, { models, Schema } from "mongoose";

const storedProcessedEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Corrected this line
      required: true,
      ref: "User", // Reference the User model for better querying
    },
    storedProcessedEvents: [
      {
        tx_ref: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const StoredProcessedEvent = models.StoredProcessedEvent || mongoose.model("StoredProcessedEvent", storedProcessedEventSchema);
export default StoredProcessedEvent;
