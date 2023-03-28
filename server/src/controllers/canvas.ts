import Canvas from "../models/canvas";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const updateCanvas = asyncHandler(async (req, res) => {
  let {
    params: { canvasId },
    file: { buffer } = {},
  } = req;

  let canvas = await Canvas.findById(canvasId);

  if (!canvas)
    throw new CustomError({ message: "Canvas not found", status: 400 });

  await Canvas.findByIdAndUpdate(canvasId, { image: buffer });

  res.status(200).send({
    message: "Canvas has been updated successfully",
  });
});
