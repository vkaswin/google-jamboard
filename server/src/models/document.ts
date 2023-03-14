import { Schema, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add title"],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Document", DocumentSchema);
