import { Stack, Text } from "@chakra-ui/react";

import { toast } from "react-toastify";
import { instance } from "./axios";

import { transformToRedmineData } from "../helpers/transformToRedmineData";
import { validateWorkLogsData } from "../helpers/validateWorklogsData";

export const redmineLogin = async () => {
  try {
    const response = await instance.get(`/redmine/users/current.json`);

    toast.success(
      <Stack>
        <Text fontWeight={600}>Successfully connected to redmine</Text>
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

    return response.data.user;
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const getRedmineProjects = async (id) => {
  try {
    const assignedResponse = await instance.get(
      `/redmine/issues.json?assigned_to_id=${id}`
    );
    const watchedResponse = await instance.get(
      `/redmine/issues.json?&watcher_id=${id}`
    );
    const assignedIssues = assignedResponse.data.issues;
    const watchedIssues = watchedResponse.data.issues;

    const extractedData = [...assignedIssues, ...watchedIssues].map((item) => {
      return {
        id: item.id,
        projectName: item.project.name,
        subject: item.subject,
      };
    });

    return [...new Set(extractedData)];
  } catch (error) {
    console.error("Error while getting issues:", error.response.data);
  }
};

export const getLatestRedmineWorkLogs = async (
  id,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  offset = 0,
  workLogs = []
) => {
  try {
    const fromDate = new Date(year, month - 1, 2);
    const toDate = new Date(year, month, 1);

    const response = await instance.get("/redmine/time_entries.json", {
      params: {
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
        user_id: id,
        limit: 100,
        offset: offset,
      },
    });

    const data = response.data.time_entries;
    workLogs.push(...data);

    if (data.length === 100) {
      // If there are more items, recursively call the function with an updated offset
      return getLatestRedmineWorkLogs(id, year, month, offset + 100, workLogs);
    } else {
      // If no more items, return the collected workLogs
      return workLogs;
    }
  } catch (error) {
    console.error("Error fetching worklogs:", error);
  }
};

export const trackTimeToRedmine = async (data) => {
  try {
    validateWorkLogsData(data, false);
    const redmineData = transformToRedmineData(data);

    const requests = redmineData.map((entry) => {
      return instance.post(`/redmine/time_entries.json`, entry);
    });

    await Promise.all(requests);

    toast.success(
      <Stack>
        <Text fontWeight={600}>
          Worklogs were successfully tracked to redmine
        </Text>
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
  } catch (error) {
    toast.error(
      <Stack>
        <Text fontWeight={600}>Can`t submit due to error: {error.message}</Text>
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
    console.error("Error while tracking time:", error);
  }
};
