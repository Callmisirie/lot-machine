import mongoose, { models, Schema } from "mongoose";

const customTemplateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: "User",
    unique: true,
  },
    customValue: {
      type: Number,
      required: true,
    },
  }
);

const CustomTemplate = models.CustomTemplate || mongoose.model("CustomTemplate", customTemplateSchema);
export default CustomTemplate;