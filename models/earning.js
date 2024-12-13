import mongoose, { models, Schema } from "mongoose";

const earningSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Corrected this line
      required: true,
      ref: "User", // Reference the User model for better querying
      unique: true,
    },
    balance: {
      type: Number,
      required: true
    },
    in: [{
      year: {
        type: Number
      },
      month: {
        type: Number
      },
      amount: {
        type: Number
      },
      flw_ref: {
        type: String
      },
    }],
    out: [{
      year: {
        type: Number
      },
      month: {
        type: Number
      },
      amount: {
        type: Number
      },
      flw_ref: {
        type: String
      },
      status: {
        type: String
      }
    }]
  },
  { timestamps: true }
);

const Earning = models.Earning || mongoose.model("Earning", earningSchema);
export default Earning;
