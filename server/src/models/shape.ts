import { Schema, model } from "mongoose";

const ShapeSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "Document",
    },
    shape: {
      type: String,
      required: [true, "Please add shape"],
    },
    width: {
      type: Number,
      required: [true, "Please add width"],
    },
    height: {
      type: Number,
      required: [true, "Please add height"],
    },
    top: {
      type: Number,
      required: [true, "Please add top"],
    },
    left: {
      type: Number,
      required: [true, "Please add left"],
    },
  },
  { timestamps: true }
);

export default model("Shape", ShapeSchema);
