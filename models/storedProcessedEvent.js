import mongoose, { models, Schema } from "mongoose";

const storedProcessedEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, 
      required: true,
      ref: "User", 
      unique: true,
    },
    storedProcessedEvents: [
      {
        flw_ref: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const StoredProcessedEvent = models.StoredProcessedEvent || mongoose.model("StoredProcessedEvent", storedProcessedEventSchema);
export default StoredProcessedEvent;
