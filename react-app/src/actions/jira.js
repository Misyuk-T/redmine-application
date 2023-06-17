import { Stack, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { endOfDay, startOfDay } from "date-fns";

import { instance } from "./axios";

import { parseDataFromJira } from "../helpers/parseDataFromJira";
import groupByField from "../helpers/groupByField";

export const jiraLogin = async () => {
  try {
    const response = await instance.get("/jira/rest/api/2/myself");

    toast.success(
      <Stack>
        <Text fontWeight={600}>Successfully connected to jira</Text>
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

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const getJiraWorklogIssues = async (
  startDate,
  endDate,
  userId,
  offset = 0,
  prevIssues = []
) => {
  try {
    const response = await instance.get("/jira/rest/api/2/search", {
      params: {
        jql: `worklogAuthor = '${userId}' AND worklogDate >= '${startDate}' AND worklogDate <= '${endDate}'`,
        maxResults: 100,
        startAt: offset,
        fields: "summary,worklog,issuetype,parent,project,status,assignee",
      },
    });

    const issues = response.data.issues;
    const updatedIssues = [...prevIssues, ...issues];

    if (response.data.total === 100) {
      return getJiraWorklogIssues(
        startDate,
        endDate,
        userId,
        offset + 100,
        updatedIssues
      );
    } else {
      const startOfStartDate = startOfDay(new Date(startDate));
      const endOfEndDate = endOfDay(new Date(endDate));

      const startTimestamp = startOfStartDate.getTime();
      const endTimestamp = endOfEndDate.getTime();

      const workLogs = [];

      const workLogPromises = updatedIssues.map(async (issue) => {
        const issueKey = issue.key;

        const workLogResponse = await instance.get(
          `/jira/rest/api/2/issue/${issueKey}/worklog`,
          {
            params: {
              authorAccountId: userId,
              startedAfter: startTimestamp,
              startedBefore: endTimestamp,
            },
          }
        );

        const workLogData = workLogResponse.data;

        const workLogsForIssue = workLogData.worklogs
          .filter((worklog) => worklog.author.accountId === userId)
          .map((worklog) => ({
            ...worklog,
            task: issueKey,
          }));

        workLogs.push(...workLogsForIssue);
      });

      await Promise.all(workLogPromises);
      const parsedData = parseDataFromJira(workLogs);

      return groupByField(parsedData, "date");
    }
  } catch (error) {
    console.error("Error while fetching recent worklogs:", error);
  }
};
