import mongoose from "mongoose";
import Canvas from "../models/canvas";
import Document from "../models/document";
import Shape from "../models/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { position },
  } = req;

  let canvas = await Canvas.create({
    image: Buffer.from(new ArrayBuffer(0)),
  });

  await Document.updateOne(
    { _id: documentId },
    {
      $push: {
        slides: {
          $each: [{ canvas: canvas._id, shapes: [] }],
          $position: position,
        },
      },
    }
  );

  let [slide] = await Document.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(documentId) } },
    {
      $project: {
        slide: { $last: "$slides" },
      },
    },
    {
      $lookup: {
        from: "canvas",
        localField: "slide.canvas",
        foreignField: "_id",
        as: "canvas",
      },
    },
    {
      $project: {
        _id: "$slide._id",
        shapes: "$slide.shapes",
        canvas: { $first: "$canvas" },
      },
    },
  ]);

  res
    .status(200)
    .send({ data: slide, message: "Slide has been created successfully" });
});

const getSlideById = async (documentId: string, slideId: string) => {
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

  return slide;
};

export const deleteSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId },
  } = req;

  if (!slideId)
    throw new CustomError({ message: "Slide id is required", status: 400 });

  let slide = await getSlideById(documentId, slideId as string);

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

  if (!slideId)
    throw new CustomError({ message: "Slide id is required", status: 400 });

  let slide = await getSlideById(documentId, slideId as string);

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
