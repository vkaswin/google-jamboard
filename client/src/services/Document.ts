import axios from "./axios";
import { Document } from "./config";
import { DocumentDetail, DocumentList, PageMeta } from "@/types/Document";

export const getDocumentById = (documentId: string) => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Document.getDetail(documentId),
    method: "get",
  });
};

export const getDocuments = (params: {
  page: number;
  limit: number;
  search: string | null;
}) => {
  return axios<{
    list: DocumentList[];
    pageMeta: PageMeta;
    message: string;
  }>({
    url: Document.getAll,
    method: "get",
    params,
  });
};

export const createDocument = () => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Document.create,
    method: "post",
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
