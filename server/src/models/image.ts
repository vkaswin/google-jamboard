import mongoose, { Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add document id"],
      ref: "Document",
    },
    buffer: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Image", ImageSchema);
