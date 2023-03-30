import axios from "./axios";
import { Document } from "./config";
import { DocumentDetail } from "@/types/Document";

export const getDocumentById = (documentId: string) => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Document.getDetail(documentId),
    method: "get",
  });
};

export const clearDocument = (documentId: string) => {
  return axios({
    url: Document.clear(documentId),
    method: "put",
  });
};

export const deleteDocument = (documentId: string) => {
  return axios({
    url: Document.delete(documentId),
    method: "delete",
  });
};

export const updateDocument = (
  documentId: string,
  data: Partial<DocumentDetail>
) => {
  return axios({ url: Document.update(documentId), method: "put", data });
};
