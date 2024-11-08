import mongoose, { models, Schema } from "mongoose";

const customTemplateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Corrected this line
    required: true,
    ref: "User" // Reference the User model for better querying
  },
    customValue: {
      type: Number,
      required: true,
    },
  }
);

const CustomTemplate = models.CustomTemplate || mongoose.model("CustomTemplate", customTemplateSchema);
export default CustomTemplate;