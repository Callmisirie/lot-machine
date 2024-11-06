import mongoose, { models, Schema } from "mongoose";

const partialSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User" // Reference the User model for better querying
  },
  partials: [
    {
      instrument: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
      },
      lotSize: {
        type: Number,
        required: true,
      },
      finalTP: {
        type: Number,
        required: true,
      },
      partialTPs: {
        type: [Number],
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Partial = models.Partial || mongoose.model("Partial", partialSchema);
export default Partial;
