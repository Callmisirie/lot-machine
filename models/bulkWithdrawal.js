import mongoose, { models, Schema } from "mongoose";

const bulkWithdrawalSchema = new Schema(
  {
    bulkWithdrawals: [
      {
        account_bank: {
          type: String,
        },
        account_number: {
          type: String,
        },
        amount: {
          type: Number,
        },
        currency: {
          type: String,
        },
        reference: {
          type: String,
        },
        debit_currency: {
          type: String,
        },
        email: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now, // Automatically sets the current date
        },
      },
    ],
  },
  { timestamps: true }
);

const BulkWithdrawal = models.BulkWithdrawal || mongoose.model("BulkWithdrawal", bulkWithdrawalSchema);
export default BulkWithdrawal;
