import { Schema, model } from "mongoose";

const ShapeSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add documentId"],
      index: true,
      ref: "Document",
    },
    type: {
      type: String,
      required: [true, "Please add type"],
    },
    props: {
      type: {
        width: Number,
        height: Number,
        translateX: Number,
        translateY: Number,
        rotate: Number,
      },
      required: [true, "Please add props"],
    },
  },
  { timestamps: true }
);

export default model("Shape", ShapeSchema);
