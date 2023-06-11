import { instance } from "./axios";

import { transformToRedmineData } from "../helpers/transformToRedmineData";
import { validateWorkLogsData } from "../helpers/validateWorklogsData";

export const redmineLogin = async () => {
  try {
    const response = await instance.get(`/redmine/users/current.json`);

    return response.data.user;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
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
    throw error;
  }
};

export const getLatestRedmineWorkLogs = async (id) => {
  try {
    const response = await instance.get(`/redmine/time_entries.json`, {
      params: {
        from: "2023-06-01",
        to: "2023-06-29",
        user_id: id,
        limit: 50,
      },
    });

    // Process the response data
    const workLogs = response.data.time_entries;
    console.log(workLogs, "YOUR LATEST REDMINE WORKLOGS");
  } catch (error) {
    console.error("Error fetching worklogs:", error);
    throw error;
  }
};

export const trackTimeToRedmine = async (data) => {
  console.log(data, "data");

  try {
    console.log(data);
    if (!data || !Object.keys(data).length) {
      throw new Error(`Data is empty.`);
    }

    validateWorkLogsData(data);
    console.log("after validate");
    const redmineData = transformToRedmineData(data);

    console.log(redmineData, "redmineData in transform function");
    //  instance.post(`redmine/time_entries.json`, timeEntry)
    // const responses = await Promise.all(requests);
    console.log(`successfully tracked`);
  } catch (error) {
    console.error("Error while tracking time:", error);
    // throw error;
  }
};
