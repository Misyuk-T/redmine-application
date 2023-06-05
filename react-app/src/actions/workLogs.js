import axios from "axios";

export const sendWorkLogs = (formData) => {
  return axios
    .post("http://localhost:8000/submit-form", formData)
    .then((response) => {
      console.log("response data");
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error.response.data;
    });
};
