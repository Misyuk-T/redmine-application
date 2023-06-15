import { instance } from "./axios";

export const sendSettings = (data) => {
  return instance.post("/settings", data).catch((error) => {
    console.error(error);
  });
};

export const getSettings = () => {
  return instance
    .get("/settings")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
