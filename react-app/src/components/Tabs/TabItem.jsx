import {
  Card,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/store";

import WorkLogItem from "./WorklogItem/WorkLogItem";

const TabItem = ({ dayLogs, date }) => {
  const { addWorkLog } = useWorkLogsStore();

  console.log(dayLogs, "dayLogs");

  const handleCreate = () => {
    addWorkLog(date, {
      date,
      description: "New empty task",
      hours: 0.25,
      blb: "nblb",
      project: "",
      task: "",
    });
  };

  return (
    <TabPanel px={0}>
      <SimpleGrid
        minChildWidth={300}
        spacing={5}
        mt={30}
        templateColumns="repeat(auto-fit, minmax(300px, 370px))"
      >
        {dayLogs.map((item) => {
          return <WorkLogItem data={item} key={item.description} />;
        })}

        <Flex alignItems="center" justifyContent="center">
          <IconButton
            onClick={handleCreate}
            border="5px solid"
            variant="fill"
            borderColor="teal.600"
            bg="teal.600"
            w={70}
            h={70}
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
