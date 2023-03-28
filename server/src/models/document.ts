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
        },
      ],
    },
  },
  { timestamps: true }
);

export default model("Document", DocumentSchema);
