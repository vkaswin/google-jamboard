import axios from "./axios";
import { Slide } from "./config";
import { SlideDetail } from "@/types/Document";

export const createSlide = (
  documentId: string,
  params: { position: number }
) => {
  return axios<{ data: SlideDetail; message: string }>({
    url: Slide.create(documentId),
    method: "post",
    params,
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
