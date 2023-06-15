import { instance } from "./axios";

import { parseDataFromJira } from "../helpers/parseDataFromJira";
import groupByField from "../helpers/groupByField";

export const jiraLogin = async () => {
  try {
    const response = await instance.get("/jira/rest/api/2/myself");

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const getJiraWorklogsByDateRange = async (
  startDate,
  endDate,
  jiraUserId,
  offset = 0,
  worklogs = []
) => {
  try {
    const response = await instance.get("/jira/rest/api/2/search", {
      params: {
        jql: `worklogAuthor = currentUser() OR assignee = currentUser() AND updated >= ${startDate} AND updated <= ${endDate}`,
        maxResults: 100,
        startAt: offset,
        fields: "summary,worklog,issuetype,parent,project,status,assignee",
      },
    });

    const formattedData = parseDataFromJira(response.data, jiraUserId);
    const updatedWorklogs = [...worklogs, ...formattedData];

    if (response.data.total === 100) {
      // Recursively call the function with the next page of results
      return getJiraWorklogsByDateRange(
        startDate,
        endDate,
        jiraUserId,
        offset + 100,
        updatedWorklogs
      );
    } else {
      return groupByField(updatedWorklogs, "date");
    }
  } catch (error) {
    console.error("Error while fetching recent worklogs:", error);
  }
};
