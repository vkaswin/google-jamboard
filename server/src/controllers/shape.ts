import Shape from "../models/shape";
import { ShapeSchema } from "../schema/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const updateShapeById = asyncHandler(async (req, res) => {
  let {
    params: { id },
    body,
  } = req;

  let data = ShapeSchema.parse(body);

  await Shape.findByIdAndUpdate(id, data);

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
