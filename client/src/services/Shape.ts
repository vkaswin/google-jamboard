import axios from "./axios";
import { Shape } from "./config";
import { ShapeProps, ShapeTypes, ShapeDetail } from "@/types/Document";

export const createShape = (data: {
  type: ShapeTypes;
  props: ShapeProps;
  documentId: string;
}) => {
  return axios<{ message: string; data: ShapeDetail }>({
    method: "post",
    url: Shape.create,
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
