import mongoose, { Schema } from "mongoose";

const CanvasSchema = new Schema(
  {
    image: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Canvas", CanvasSchema);
