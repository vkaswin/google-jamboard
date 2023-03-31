import Document from "../models/document";
import Shape from "../models/shape";
import Canvas from "../models/canvas";
import { asyncHandler, CustomError } from "../utils/asyncHandler";

export const createDocument = asyncHandler(async (req, res) => {
  let { user } = req;

  let canvas = await Canvas.create({
    image: Buffer.from(new ArrayBuffer(0)),
  });

  let document = await Document.create({
    creatorId: user._id,
    slides: [{ canvas: canvas._id, shapes: [] }],
  });

  res.status(200).send({
    data: document,
    message: "Document has been created successfully",
  });
});

export const getAllDocuments = asyncHandler(async (req, res) => {
  let { user, query } = req;

  let limit = query.limit ? +query.limit : 25;
  let page = query.page ? +query.page : 1;
  let skip = (page - 1) * limit;

  let filterQuery = {
    creatorId: user._id,
    ...(query.search && {
      title: { $regex: query.search, $options: "i" },
    }),
  };

  let documents = await Document.find(filterQuery, {
    title: 1,
    updatedAt: 1,
    createdAt: 1,
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip);

  let total = await Document.find(filterQuery).countDocuments();

  res.status(200).send({
    list: documents,
    pageMeta: {
      page,
      total,
      totalPages: Math.ceil(total / limit),
    },
    message: "Success",
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

export const deleteDocument = asyncHandler(async (req, res) => {
  let {
    params: { documentId },
  } = req;

  let document = await Document.findById(documentId);

  if (!document)
    throw new CustomError({ message: "Document not found", status: 400 });

  let { canvas, shapes } = document.slides.reduce<{
    canvas: string[];
    shapes: string[];
  }>(
    (data, slide) => {
      data.canvas.push(slide.canvas._id.toString());
      let shapeIds = slide.shapes.map(({ _id }) => _id.toString());
      data.shapes.push(...shapeIds);
      return data;
    },
    { canvas: [], shapes: [] }
  );

  await Shape.deleteMany({ _id: { $in: shapes } });

  await Canvas.deleteMany({ _id: canvas });

  await Document.findByIdAndDelete(documentId);

  res.status(200).send({
    message: "Document has been deleted successfully",
  });
});

export const updateDocument = asyncHandler(async (req, res) => {
  let {
    body,
    params: { documentId },
  } = req;

  let document = await Document.findById(documentId);

  if (!document)
    throw new CustomError({ message: "Document not found", status: 400 });

  await Document.findByIdAndUpdate(documentId, body);

  res.status(200).send({ message: "Document has been updated successfully" });
});
