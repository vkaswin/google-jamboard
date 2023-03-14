import Image from "../models/image";
import Document from "../models/document";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

const createDocument = asyncHandler(async (req, res) => {
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

const getDocument = asyncHandler(async (req, res) => {
  let {
    params: { id },
  } = req;

  let document = await Document.findById(id);

  if (!document)
    throw new CustomError({ status: 400, message: "Document not found" });

  let image = await Image.findOne({ documentId: id });

  if (!image || !image.buffer)
    throw new CustomError({ status: 400, message: "Image not found" });

  let data = {
    ...document.toObject(),
    image:
      image.buffer.length > 0
        ? `data:image/png;base64,${image.buffer.toString("base64")}`
        : null,
  };

  res.status(200).send({ data, message: "Success" });
});

export { createDocument, getDocument };
