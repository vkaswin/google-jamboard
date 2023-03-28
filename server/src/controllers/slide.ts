import Canvas from "../models/canvas";
import Document from "../models/document";
import Shape from "../models/shape";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  let canvas = await Canvas.create({
    buffer: Buffer.from(new ArrayBuffer(0)),
  });

  let document = await Document.updateOne(
    { _id: documentId },
    {
      $push: {
        slides: { canvas: canvas._id, shapes: [] },
      },
    }
  );

  res
    .status(200)
    .send({ message: "Slide has been created successfully", document });
});

export const deleteSlide = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
    query: { slideId },
  } = req;

  let document = await Document.findById(documentId);

  if (!document)
    throw new CustomError({ message: "Document not found", status: 400 });

  let slide = document.slides.find((slide: any) => {
    return slide._id.toString() === slideId;
  });

  if (slide) {
    await Canvas.findByIdAndDelete(slide.canvas._id);
    await Shape.deleteMany({ _id: { $in: slide.shapes } });
  }

  await Document.deleteOne(
    { _id: documentId, "slides._id": slideId },
    { $pull: "slides.$" }
  );

  res.status(200).send({ message: "Slide has been deleted successfully" });
});
