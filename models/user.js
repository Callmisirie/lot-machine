import mongoose, { models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, 
    },
    referrerToken: {
      type: String,
      required: true,
      unique: true,
    },
    referralToken: {
      type: String,
    },
    plan: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
