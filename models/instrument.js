import mongoose, { models, Schema } from "mongoose";

const instrumentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Corrected this line
    required: true,
    ref: "User", // Reference the User model for better querying
    unique: true,
  },
  instruments: [
    {
      instrument: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
      },
    }
  ]
}, { timestamps: true });

const Instrument = models.Instrument || mongoose.model("Instrument", instrumentSchema);
export default Instrument;
