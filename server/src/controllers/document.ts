import Image from "../models/image";
import Document from "../models/document";
import { asyncHandler, CustomError } from "../utils/asyncHandler";
import Shape from "../models/shape";

export const createDocument = asyncHandler(async (req, res) => {
  let data = await Document.create({
    title: "Demo",
    creatorId: "6410632eed1b8da26018876c",
  });

  await Image.create({
    buffer: Buffer.from(new ArrayBuffer(0)),
    documentId: data._id,
  });

  res.status(200).send({
    data,
    message: "Document has been created successfully",
  });
});

export const getDocument = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  let document = await Document.findById(documentId);

  if (!document)
    throw new CustomError({ status: 400, message: "Document not found" });

  let image = await Image.findOne({ documentId });

  if (!image || !image.buffer)
    throw new CustomError({ status: 400, message: "Image not found" });

  let shapes = await Shape.find({ documentId });

  let data = {
    ...document.toObject(),
    image: `data:image/png;base64,${image.buffer.toString("base64")}`,
    shapes,
  };

  res.status(200).send({ data, message: "Success" });
});

export const clearDocument = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  await Image.findOneAndUpdate(
    { documentId },
    {
      buffer: Buffer.from(new ArrayBuffer(0)),
    }
  );

  await Shape.deleteMany({ documentId });

  res.status(200).send({ message: "Document has been cleared successfully" });
});
