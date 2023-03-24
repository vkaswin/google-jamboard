import { DocumentDetail, ShapeDetail } from "@/types/Document";
import axios from "./axios";
import { Document, Image, Shape } from "./config";

export const getDocumentById = (id: string) => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Document.getDetail(id),
    method: "get",
  });
};

export const updateImage = (id: string, data: FormData) => {
  return axios({
    url: Image.update(id),
    method: "put",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
};

export const updateShape = (id: string, data: Partial<ShapeDetail>) => {
  return axios({
    url: Shape.update(id),
    method: "put",
    data,
  });
};

export const deleteShape = (id: string) => {
  return axios({
    url: Shape.delete(id),
    method: "delete",
  });
};
