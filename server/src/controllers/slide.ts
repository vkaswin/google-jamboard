import mongoose from "mongoose";
import Canvas from "../models/canvas";
import Document from "../models/document";
import Shape from "../models/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { position },
    body,
  } = req;

  let isEmptyBody = Object.keys(body).length === 0;
  let canvasId: string = "";

  if (isEmptyBody) {
    let canvas = await Canvas.create({
      image: Buffer.from(new ArrayBuffer(0)),
    });
    canvasId = canvas._id.toString();
  }

  await Document.updateOne(
    { _id: documentId },
    {
      $push: {
        slides: {
          $each: [isEmptyBody ? { canvas: canvasId, shapes: [] } : body],
          $position: position,
        },
      },
    }
  );

  let document = await Document.findById(documentId)
    .populate("slides.canvas")
    .populate("slides.shapes");

  if (!document)
    throw new CustomError({ message: "Document not found", status: 400 });

  res.status(200).send({
    data: document.toObject(),
    message: "Slide has been created successfully",
  });
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

  await Shape.deleteMany({ _id: { $in: slide.shapes } });

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

export const updateSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId },
    body,
  } = req;

  let document = await Document.findById(documentId, { "slides._id": slideId });

  if (!document)
    throw new CustomError({ message: "Slide not found", status: 400 });

  await Document.findOneAndUpdate(
    { _id: documentId, "slides._id": slideId },
    { "slides.$.props": body }
  );

  res.status(200).send({ message: "Slide has been updated successfully" });
});
