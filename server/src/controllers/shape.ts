import Shape from "../models/shape";
import { ShapeSchema } from "../schema/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const updateShapeById = asyncHandler(async (req, res) => {
  let {
    params: { id },
    body,
  } = req;

  ShapeSchema.partial().parse(body);

  await Shape.findByIdAndUpdate(id, body);

  res.status(200).send({ message: "Shape has been updated successfully" });
});

export const deleteShapeById = asyncHandler(async (req, res) => {
  let {
    params: { id },
  } = req;

  let isExist = await Shape.findById(id);

  if (!isExist)
    throw new CustomError({ message: "Shape not found", status: 400 });

  await Shape.findByIdAndDelete(id);

  res.status(200).send({ message: "Shape has been deleted successfully" });
});

export const createShape = asyncHandler(async (req, res) => {
  let { body } = req;

  ShapeSchema.parse(body);

  let data = await Shape.create(body);

  res.status(200).send({ data, message: "Success" });
});
