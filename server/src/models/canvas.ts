import mongoose, { Schema } from "mongoose";

const CanvasSchema = new Schema(
  {
    image: {
      type: Buffer,
      required: [true, "Please add image"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Canvas", CanvasSchema);
