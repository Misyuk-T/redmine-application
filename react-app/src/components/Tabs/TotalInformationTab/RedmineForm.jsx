import { useState } from "react";

import { Box, Button, Flex } from "@chakra-ui/react";

import Select from "react-select";

import useWorkLogsStore from "../../../store/worklogsStore";
import useRedmineStore from "../../../store/redmineStore";

import {
  getLatestRedmineWorkLogs,
  trackTimeToRedmine,
} from "../../../actions/redmine";
import { transformToSelectData } from "../../../helpers/transformToSelectData";

const RedmineForm = () => {
  const { addBulkWorkLogProject, workLogs } = useWorkLogsStore();
  const { projects, resetLatestActivity, addLatestActivity, user } =
    useRedmineStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isProjectsSelected, setIsProjectsSelected] = useState(false);

  const formattedProjectData = transformToSelectData(projects);
  const isWorkLogsExist = workLogs && Object.entries(workLogs).length > 0;

  const handleAddProject = () => {
    addBulkWorkLogProject(selectedItem.value);
    setIsProjectsSelected(true);
  };

  const handleSubmit = async () => {
    await trackTimeToRedmine(workLogs).then(async () => {
      resetLatestActivity();
      addLatestActivity(await getLatestRedmineWorkLogs(user.id));
    });
  };

  return (
    <Flex m="0 0 0 auto" mt={5} gap={10}>
      <Flex gap={5}>
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
          isDisabled={!selectedItem}
        >
          Set project to all tasks
        </Button>
      </Flex>

      <Button
        onClick={handleSubmit}
        isDisabled={!isProjectsSelected || !user?.id || !isWorkLogsExist}
        colorScheme="teal"
        size="md"
      >
        Submit to redmine
      </Button>
    </Flex>
  );
};

export default RedmineForm;
