import { Schema, model } from "mongoose";

const ShapeSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Please add type"],
    },
    props: {
      type: {
        width: {
          type: Number,
          required: [true, "Please add width"],
        },
        height: {
          type: Number,
          required: [true, "Please add height"],
        },
        translateX: {
          type: Number,
          required: [true, "Please add translateX"],
        },
        translateY: {
          type: Number,
          required: [true, "Please add translateY"],
        },
        rotate: {
          type: Number,
          required: [true, "Please add rotate"],
        },
        text: {
          type: String,
          default: "",
        },
        color: {
          type: String,
          default: "#3C4043",
        },
        borderColor: {
          type: String,
          default: "#262626",
        },
        backgroundColor: {
          type: String,
          default: "#fff",
        },
      },
      required: [true, "Please add props"],
      _id: false,
    },
  },
  { timestamps: true }
);

export default model("Shape", ShapeSchema);
