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
    x: {
      type: Number,
      required: [true, "Please add x coordinate"],
    },
    y: {
      type: Number,
      required: [true, "Please add y coordinate"],
    },
  },
  { timestamps: true }
);

export default model("Shape", ShapeSchema);
