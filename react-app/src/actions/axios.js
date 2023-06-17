import axios from "axios";
import { toast } from "react-toastify";
import { Stack, Text } from "@chakra-ui/react";

export const instance = axios.create({
  baseURL: "http://localhost:8000",
});

instance.interceptors.response.use(null, (error) => {
  const errorText = error.response.data;
  const statusRequest = error.response.status;

  if (errorText) {
    toast.error(
      <Stack>
        <Text fontWeight={600}>Status: {statusRequest}</Text>
        <Text>{errorText}</Text>
      </Stack>,
      {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  }

  return Promise.reject(error);
});
