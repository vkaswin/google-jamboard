import Document from "../models/document";
import Shape from "../models/shape";
import { ShapeSchema } from "../schema/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createShape = asyncHandler(async (req, res) => {
  let {
    body,
    params: { documentId },
    query: { slideId },
  } = req;

  if (!slideId)
    throw new CustomError({ message: "Slide id is required", status: 400 });

  ShapeSchema.parse(body);

  let shape = await Shape.create(body);

  await Document.updateOne(
    {
      _id: documentId,
      "slides._id": { $eq: slideId },
    },
    { $push: { "slides.$.shapes": shape._id } }
  );

  res.status(200).send({ data: shape, message: "Success" });
});

export const updateShape = asyncHandler(async (req, res) => {
  let {
    params: { shapeId },
    body,
  } = req;

  ShapeSchema.partial().parse(body);

  await Shape.findByIdAndUpdate(shapeId, body);

  res.status(200).send({ message: "Shape has been updated successfully" });
});

export const deleteShape = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId, shapeId },
  } = req;

  let isExist = await Shape.findById(shapeId);

  if (!isExist)
    throw new CustomError({ message: "Shape not found", status: 400 });

  await Shape.findByIdAndDelete(shapeId);

  await Document.updateOne(
    { _id: documentId, "slides._id": slideId },
    { $pull: { "slides.$.shapes": shapeId } }
  );

  res.status(200).send({ message: "Shape has been deleted successfully" });
});
