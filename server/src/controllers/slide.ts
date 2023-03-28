import mongoose from "mongoose";
import Canvas from "../models/canvas";
import Document from "../models/document";
import Shape from "../models/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  let canvas = await Canvas.create({
    buffer: Buffer.from(new ArrayBuffer(0)),
  });

  let document = await Document.updateOne(
    { _id: documentId },
    {
      $push: {
        slides: { canvas: canvas._id, shapes: [] },
      },
    }
  );

  res
    .status(200)
    .send({ message: "Slide has been created successfully", document });
});

export const deleteSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId },
  } = req;

  let [{ slide = null } = {}] = await Document.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(documentId),
      },
    },
    {
      $project: {
        slide: {
          $first: {
            $filter: {
              input: "$slides",
              cond: {
                $eq: [
                  "$$slide._id",
                  new mongoose.Types.ObjectId(slideId as string),
                ],
              },
              as: "slide",
            },
          },
        },
      },
    },
  ]);

  if (!slide)
    throw new CustomError({ message: "Slide not found", status: 400 });

  await Canvas.findByIdAndDelete(slide.canvas._id);

  await Shape.deleteMany({ _id: { $in: slide.shapes } });

  await Document.findByIdAndUpdate(documentId, {
    $pull: { slides: { _id: slideId } },
  });

  res.status(200).send({ message: "Slide has been deleted successfully" });
});

export const clearSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId },
  } = req;

  let [{ slide = null } = {}] = await Document.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(documentId),
      },
    },
    {
      $project: {
        slide: {
          $first: {
            $filter: {
              input: "$slides",
              cond: {
                $eq: [
                  "$$slide._id",
                  new mongoose.Types.ObjectId(slideId as string),
                ],
              },
              as: "slide",
            },
          },
        },
      },
    },
  ]);

  if (!slide)
    throw new CustomError({ message: "Slide not found", status: 400 });

  await Canvas.findByIdAndUpdate(slide.canvas._id, {
    image: Buffer.from(new ArrayBuffer(0)),
  });

  await Shape.deleteMany({ $in: slide.shapes });

  await Document.updateOne(
    { _id: documentId, "slides._id": slideId },
    {
      $set: {
        "slides.$.shapes": [],
      },
    }
  );

  res.status(200).send({ message: "Slide has been cleared successfully" });
});
