import { Schema, model } from "mongoose";

const ShapeSchema = new Schema(
  {
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
        text: String,
        backgroundColor: String,
      },
      required: [true, "Please add props"],
      _id: false,
    },
  },
  { timestamps: true }
);

export default model("Shape", ShapeSchema);
