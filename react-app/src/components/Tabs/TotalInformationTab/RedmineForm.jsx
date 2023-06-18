import { useState } from "react";
import { Box, Button, Flex, FormLabel, Switch, Text } from "@chakra-ui/react";
import Select from "react-select";

import useWorkLogsStore from "../../../store/worklogsStore";
import useRedmineStore from "../../../store/redmineStore";
import useJiraStore from "../../../store/jiraStore";

import {
  getLatestRedmineWorkLogs,
  trackTimeToRedmine,
} from "../../../actions/redmine";
import { createJiraWorklogs } from "../../../actions/jira";
import { transformToProjectData } from "../../../helpers/transformToSelectData";
import { getTotalHoursFromObject } from "../../../helpers/getHours";
import { filterWorklogsByTask } from "../../../helpers/filterWorklogsForJira";

import ModalDialog from "../../ModalDialog";

const RedmineForm = () => {
  const { addBulkWorkLogProject, workLogs, addWorkLogs, isJiraExport } =
    useWorkLogsStore();
  const { projects, resetLatestActivity, addLatestActivity, user } =
    useRedmineStore();
  const { user: jiraUser } = useJiraStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isBlbLog, setIsBlbLog] = useState(false);

  const jiraWoklogs = filterWorklogsByTask(workLogs);
  const formattedProjectData = transformToProjectData(projects);
  const worklogsArray = workLogs && Object.entries(workLogs);
  const isWorkLogsExist = worklogsArray?.length > 0;
  const isWorklogHaveProject =
    isWorkLogsExist && worklogsArray[0][1][0].project;

  const handleAddProject = () => {
    addBulkWorkLogProject(selectedItem.value);
  };

  const handleBlbStatus = () => {
    const updatedWorkLog = { ...workLogs };

    for (let log in updatedWorkLog) {
      updatedWorkLog[log] = updatedWorkLog[log].map((item) => {
        return {
          ...item,
          blb: isBlbLog ? "nblb" : "blb",
        };
      });
    }
    addWorkLogs(updatedWorkLog);
    setIsBlbLog((prevState) => !prevState);
  };

  const handleRedmineSubmit = async () => {
    await trackTimeToRedmine(workLogs).then(async () => {
      resetLatestActivity();
      addLatestActivity(await getLatestRedmineWorkLogs(user.id));
    });
  };

  const handleJiraSubmit = async () => {
    await createJiraWorklogs(jiraWoklogs);
  };

  return (
    <Flex mt={5} gap={30} justifyContent="space-between">
      <Flex gap={8} alignItems="center">
        <Flex alignItems="center" gap={3}>
          <FormLabel htmlFor="blb" m={0} fontWeight={400}>
            Billability toggle:
          </FormLabel>
          <Switch
            id="blb"
            isDisabled={!user?.id || !isWorkLogsExist}
            onChange={handleBlbStatus}
            size="lg"
          />
        </Flex>

        <Flex gap={3}>
          <Box w="300px">
            <Select
              value={selectedItem}
              onChange={setSelectedItem}
              options={formattedProjectData}
              placeholder="Select project ..."
              menuPlacement="auto"
            />
          </Box>
          <Button
            onClick={handleAddProject}
            variant="outline"
            colorScheme="orange"
            isDisabled={!selectedItem || !isWorkLogsExist}
          >
            Set project to all tasks
          </Button>
        </Flex>
      </Flex>

      <Flex gap={5}>
        <ModalDialog
          headerTitle="Submitting to Jira"
          trigger={
            <Button
              isDisabled={!jiraUser || !isWorkLogsExist || isJiraExport}
              colorScheme="blue"
              size="md"
            >
              Submit to jira
            </Button>
          }
          onConfirm={handleJiraSubmit}
        >
          <Text>
            Do you really want to submit{" "}
            <strong> {getTotalHoursFromObject(jiraWoklogs)} </strong>
            hours to <strong>Jira</strong>?
          </Text>
        </ModalDialog>

        <ModalDialog
          headerTitle="Submitting to Redmine"
          trigger={
            <Button
              isDisabled={
                !isWorklogHaveProject || !user?.id || !isWorkLogsExist
              }
              colorScheme="teal"
              size="md"
            >
              Submit to redmine
            </Button>
          }
          onConfirm={handleRedmineSubmit}
        >
          <Text>
            Do you really want to submit{" "}
            <strong>{getTotalHoursFromObject(workLogs)} </strong>
            hours to <strong>Redmine</strong>?
          </Text>
        </ModalDialog>
      </Flex>
    </Flex>
  );
};

export default RedmineForm;
