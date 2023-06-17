import { useState } from "react";
import { Box, Button, Flex, FormLabel, Switch } from "@chakra-ui/react";
import Select from "react-select";

import useWorkLogsStore from "../../../store/worklogsStore";
import useRedmineStore from "../../../store/redmineStore";

import {
  getLatestRedmineWorkLogs,
  trackTimeToRedmine,
} from "../../../actions/redmine";
import { transformToSelectData } from "../../../helpers/transformToSelectData";

const RedmineForm = () => {
  const { addBulkWorkLogProject, workLogs, addWorkLogs } = useWorkLogsStore();
  const { projects, resetLatestActivity, addLatestActivity, user } =
    useRedmineStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isProjectsSelected, setIsProjectsSelected] = useState(false);
  const [isBlbLog, setIsBlbLog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formattedProjectData = transformToSelectData(projects);
  const isWorkLogsExist = workLogs && Object.entries(workLogs).length > 0;

  const handleAddProject = () => {
    addBulkWorkLogProject(selectedItem.value);
    setIsProjectsSelected(true);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    await trackTimeToRedmine(workLogs).then(async () => {
      resetLatestActivity();
      addLatestActivity(await getLatestRedmineWorkLogs(user.id));
    });
    setIsLoading(false);
  };

  return (
    <Flex mt={5} gap={10} justifyContent="space-between">
      <Flex gap={5} alignItems="center">
        <Flex alignItems="center" mr={5}>
          <FormLabel htmlFor="blb" mb="0" fontWeight={400}>
            BLB toggle
          </FormLabel>
          <Switch
            id="blb"
            isDisabled={!user?.id || !isWorkLogsExist}
            onChange={handleBlbStatus}
            size="lg"
          />
        </Flex>

        <Box w="300px">
          <Select
            value={selectedItem}
            onChange={setSelectedItem}
            options={formattedProjectData}
            placeholder="Select project ..."
          />
        </Box>

        <Button
          onClick={handleAddProject}
          variant="outline"
          colorScheme="orange"
          size="md"
          isDisabled={!selectedItem || !isWorkLogsExist}
        >
          Set project to all tasks
        </Button>
      </Flex>

      <Button
        onClick={handleSubmit}
        isDisabled={!isProjectsSelected || !user?.id || !isWorkLogsExist}
        colorScheme="teal"
        size="md"
        isLoading={isLoading}
        loadingText="Submitting..."
      >
        Submit to redmine
      </Button>
    </Flex>
  );
};

export default RedmineForm;
