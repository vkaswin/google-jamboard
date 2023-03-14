import Image from "../models/image";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

const updateImage = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    file: { buffer } = {},
  } = req;

  await Image.findOneAndUpdate({ documentId }, { $set: { buffer } });

  res.status(200).send({
    message: "Image has been created successfully",
  });
});

export { updateImage };
