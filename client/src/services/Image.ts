import axios from "./axios";
import { Image } from "./config";

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
