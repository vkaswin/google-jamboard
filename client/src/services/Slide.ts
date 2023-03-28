import axios from "./axios";
import { Slide } from "./config";

export const clearSlide = (documentId: string, params: { slideId: string }) => {
  return axios({
    url: Slide.clear(documentId),
    method: "put",
  });
};
