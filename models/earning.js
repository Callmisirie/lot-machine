import mongoose, { models, Schema } from "mongoose";

const earningSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Corrected this line
      required: true,
      ref: "User", // Reference the User model for better querying
    },
    balance: {
      type: String,
      required: true
    },
     earnings: [
      {
        year: {
          type: Number
        },
        months: [
          { 
            month: {
              type: Number
            },
            in: {
              type: Number
            },
            out: {
              type: Number
            },
            withdrawalId: {
              type: String
            }
          }
        ]
      },
    ],
  },
  { timestamps: true }
);

const Earning = models.Earning || mongoose.model("Earning", earningSchema);
export default Earning;
