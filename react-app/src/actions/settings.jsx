import { instance } from "./axios";
import { toast } from "react-toastify";
import { Stack, Text } from "@chakra-ui/react";

export const sendCurrentSettings = (data) => {
  return instance
    .post("/current-settings", data)
    .then(() => {
      toast.success(
        <Stack>
          <Text fontWeight={600}>Setings were set as current</Text>
        </Stack>,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getCurrentSettings = (data) => {
  return instance
    .get("/current-settings", data)
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
};

export const sendSettings = (data) => {
  return instance
    .post("/settings", data)
    .then(() => {
      toast.success(
        <Stack>
          <Text fontWeight={600}>Settings were successfully saved</Text>
        </Stack>,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });
};

export const deleteSettings = (id) => {
  return instance
    .delete(`/settings/${id}`)
    .then(() => {
      toast.success(
        <Stack>
          <Text fontWeight={600}>Settings were successfully deleted</Text>
        </Stack>,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        }
      );
    })
    .catch((error) => {
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
