import { Schema, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add title"],
      default: "Untitled Jam",
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add creator id"],
      ref: "User",
    },
    slides: {
      type: [
        {
          canvas: {
            type: Schema.Types.ObjectId,
            ref: "Canvas",
            required: true,
          },
          shapes: {
            type: [Schema.Types.ObjectId],
            ref: "Shape",
          },
          props: {
            type: {
              backgroundImage: {
                type: String,
                default: "default",
              },
            },
            default: {},
            _id: false,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

export default model("Document", DocumentSchema);
