import axios from "./axios";
import { Slide } from "./config";
import { DocumentDetail, SlideDetail, SlideProps } from "@/types/Document";

export const createSlide = (
  documentId: string,
  params: { position: number },
  data?: Omit<SlideDetail, "_id">
) => {
  return axios<{ data: DocumentDetail; message: string }>({
    url: Slide.create(documentId),
    method: "post",
    params,
    data,
  });
};

export const deleteSlide = (
  documentId: string,
  params: { slideId: string }
) => {
  return axios({
    url: Slide.delete(documentId),
    method: "delete",
    params,
  });
};

export const clearSlide = (documentId: string, params: { slideId: string }) => {
  return axios({
    url: Slide.clear(documentId),
    method: "put",
    params,
  });
};

export const updateSlide = (
  documentId: string,
  params: { slideId: string },
  data: SlideProps
) => {
  return axios({
    url: Slide.update(documentId),
    method: "put",
    params,
    data,
  });
};
