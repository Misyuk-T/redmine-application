import { Flex, IconButton, SimpleGrid, TabPanel } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/worklogsStore";

import WorkLogItem from "./WorklogItem/WorkLogItem";

const TabItem = ({ dayLogs, date }) => {
  const { addWorkLog } = useWorkLogsStore();

  const handleCreate = () => {
    addWorkLog(date, {
      date,
      description: "New task",
      hours: 0.25,
      blb: "nblb",
      project: "",
      task: "",
    });
  };

  return (
    <TabPanel px={0}>
      <SimpleGrid
        justifyContent="center"
        minChildWidth={300}
        spacing={5}
        mt={30}
        templateColumns="repeat(auto-fit, minmax(300px, 370px))"
      >
        {dayLogs.map((item, index) => {
          return <WorkLogItem data={item} key={item.description + index} />;
        })}

        <Flex alignItems="center" justifyContent="center" minH="200px">
          <IconButton
            onClick={handleCreate}
            bg="teal.600"
            w={70}
            h={70}
            boxShadow="dark-lg"
            borderRadius="50%"
            aria-label="add more"
            _hover={{
              bg: "teal.500",
            }}
          >
            <AddIcon color="white" w={5} h={5} size="large" />
          </IconButton>
        </Flex>
      </SimpleGrid>
    </TabPanel>
  );
};

export default TabItem;
