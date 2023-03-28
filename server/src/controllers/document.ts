import mongoose from "mongoose";
import Canvas from "../models/canvas";
import Document from "../models/document";
import { asyncHandler, CustomError } from "../utils/asyncHandler";
import Shape from "../models/shape";

export const createDocument = asyncHandler(async (req, res) => {
  let canvas = await Canvas.create({
    buffer: Buffer.from(new ArrayBuffer(0)),
  });

  let document = await Document.create({
    title: "Demo",
    creatorId: "6410632eed1b8da26018876c",
    slides: [{ canvas: canvas._id, shapes: [] }],
  });

  res.status(200).send({
    data: {
      documentId: document._id,
    },
    message: "Document has been created successfully",
  });
});

export const getDocument = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  let document = await Document.findById(documentId)
    .populate("slides.shapes")
    .populate("slides.canvas");

  if (!document)
    throw new CustomError({ status: 400, message: "Document not found" });

  res.status(200).send({ data: document.toObject(), message: "Success" });
});

export const clearDocument = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  await Canvas.findOneAndUpdate(
    { documentId },
    {
      buffer: Buffer.from(new ArrayBuffer(0)),
    }
  );

  await Shape.deleteMany({ documentId });

  res.status(200).send({ message: "Document has been cleared successfully" });
});
