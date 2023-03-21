import { DocumentDetail } from "@/types/Document";
import axios from "./axios";
import { Document, Image } from "./config";

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
