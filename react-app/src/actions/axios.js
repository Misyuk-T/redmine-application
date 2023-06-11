import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;

export const instance = axios.create({
  baseURL: "http://localhost:8000",
  params: {
    key: `${apiKey}`,
  },
});
