import { Stack, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";

import { instance } from "./axios";

import { parseDataFromJira } from "../helpers/parseDataFromJira";
import groupByField from "../helpers/groupByField";
import { formatDateForJira } from "../helpers/getFormattedDate";
import { validateWorkLogsData } from "../helpers/validateWorklogsData";

export const jiraLogin = async (jiraUrl) => {
  try {
    const response = await instance.get("/jira/rest/api/2/myself", {
      params: {
        jiraUrl,
      },
    });

    toast.success(
      <Stack>
        <Text fontWeight={600}>
          Successfully connected to JIRA at {jiraUrl}
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

    return response.data;
  } catch (error) {
    console.error(`Login failed for JIRA at ${jiraUrl}:`, error);
    toast.error(
      <Stack>
        <Text fontWeight={600}>Failed to connect to JIRA at {jiraUrl}</Text>
        <Text>{error.message}</Text>
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
    return null;
  }
};

export const getJiraWorklogIssues = async (
  jiraUrl,
  startDate,
  endDate,
  userId,
  offset = 0,
  prevIssues = []
) => {
  try {
    const response = await instance.get("/jira/rest/api/2/search", {
      params: {
        jiraUrl,
        jql: `worklogAuthor = '${userId}' AND worklogDate >= '${startDate}' AND worklogDate <= '${endDate}'`,
        maxResults: 100,
        startAt: offset,
        fields: "summary,worklog,issuetype,parent,project,status,assignee",
      },
    });

    const issues = response.data.issues;
    const updatedIssues = [...prevIssues, ...issues];

    if (issues.length === 100) {
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

      const startTimestamp = startOfStartDate.getTime() - 1;
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

      toast.success(
        <Stack>
          <Text fontWeight={600}>
            Jira worklogs were successfully fetched. Got ({parsedData.length})
            items
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

      return groupByField(parsedData, "date");
    }
  } catch (error) {
    toast.error(
      <Stack>
        <Text fontWeight={600}>
          Can`t fetch jira woklogs due to error: {error.message}
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
    console.error("Error while fetching recent worklogs:", error);
  }
};

export const getAssignedIssues = async (
  jiraUrl,
  userId,
  offset = 0,
  prevIssues = []
) => {
  try {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const response = await instance.get("/jira/rest/api/2/search", {
      params: {
        jiraUrl,
        jql: `assignee = '${userId}' OR assignee WAS '${userId}' DURING ("${format(
          startDate,
          "yyyy-MM-dd"
        )}", "${format(endDate, "yyyy-MM-dd")} 23:59")`,
        maxResults: 100,
        startAt: offset,
        fields: "summary,issuetype,parent,project,status",
      },
    });

    const issues = response.data.issues;
    const updatedIssues = [...prevIssues, ...issues];

    if (issues.length === 100) {
      return getAssignedIssues(userId, jiraUrl, offset + 100, updatedIssues);
    } else {
      return updatedIssues.map((issue) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype.name,
        parent: issue.fields.parent ? issue.fields.parent.key : null,
        project: issue.fields.project.name,
        status: issue.fields.status.name,
      }));
    }
  } catch (error) {
    console.error(
      `Error while fetching assigned issues from JIRA at ${jiraUrl}:`,
      error
    );
  }
};

export const createJiraWorklogs = async (jiraUrl, worklogs) => {
  try {
    validateWorkLogsData(worklogs, true);
    const requests = [];

    for (const date in worklogs) {
      const worklogsForDate = worklogs[date];
      for (const worklog of worklogsForDate) {
        const { description, hours, date, task } = worklog;

        // Prepare the data for creating the worklog
        const data = {
          comment: description || "",
          timeSpentSeconds: hours * 3600,
          started: formatDateForJira(date),
          issueKey: task,
        };

        //  Make an API call to create the worklog and store the promise
        const request = instance.post(
          `/jira/rest/api/2/issue/${task}/worklog`,
          data,
          { params: jiraUrl }
        );
        requests.push(request);
      }
    }

    // Execute all API calls concurrently using Promise.all
    await Promise.all(requests).then(() => {
      toast.success(
        <Stack>
          <Text fontWeight={600}>
            Worklogs were successfully tracked to jira
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
    });
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
    console.error("Error while creating worklogs:", error);
  }
};
