import mongoose, { models, Schema } from "mongoose";

const beneficiarySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Corrected this line
    required: true,
    ref: "User", // Reference the User model for better querying
    unique: true
  },
  beneficiaryId: {
    type: String,
    required: true,
    unique: true
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  }, 
  currency: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Beneficiary = models.Beneficiary || mongoose.model("Beneficiary", beneficiarySchema);
export default Beneficiary;
