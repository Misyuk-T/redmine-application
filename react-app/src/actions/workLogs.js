import { instance } from "./axios";

export const sendWorkLogs = (formData) => {
  return instance
    .post("/submit-form", formData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error.response.data;
    });
};
