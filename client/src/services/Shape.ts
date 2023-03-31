import axios from "./axios";
import { Shape } from "./config";
import { NewShapeType, ShapeDetail } from "@/types/Document";

export const createShape = (
  documentId: string,
  params: { slideId: string },
  data: NewShapeType["shape"]
) => {
  return axios<{ message: string; data: ShapeDetail }>({
    method: "post",
    url: Shape.create(documentId),
    params,
    data,
  });
};

export const updateShape = (shapeId: string, data: Partial<ShapeDetail>) => {
  return axios({
    url: Shape.update(shapeId),
    method: "put",
    data,
  });
};

export const deleteShape = (
  documentId: string,
  params: { shapeId: string; slideId: string }
) => {
  return axios({
    url: Shape.delete(documentId),
    method: "delete",
    params,
  });
};
