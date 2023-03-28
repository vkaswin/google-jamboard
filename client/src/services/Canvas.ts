import axios from "./axios";
import { Canvas } from "./config";

export const updateCanvas = (canvasId: string, data: FormData) => {
  return axios({
    url: Canvas.update(canvasId),
    method: "put",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
};
