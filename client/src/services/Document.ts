import axios from "./axios";
import { Document } from "./config";
import { DocumentDetail } from "@/types/Document";

export const getDocumentById = (id: string) => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Document.getDetail(id),
    method: "get",
  });
};

export const clearDocument = (id: string) => {
  return axios({
    url: Document.clear(id),
    method: "put",
  });
};
