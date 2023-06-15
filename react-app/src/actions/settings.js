import { instance } from "./axios";

export const sendSettings = (data) => {
  console.log(data, "send data");
  return instance.post("/settings", data).catch((error) => {
    console.error(error);
  });
};

export const getSettings = () => {
  return instance
    .get("/settings")
    .then((response) => {
      console.log("response.data", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
