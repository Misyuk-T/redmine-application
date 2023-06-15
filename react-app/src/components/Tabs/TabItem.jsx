import { Flex, IconButton, SimpleGrid, TabPanel, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/worklogsStore";

import WorkLogItem from "./WorklogItem/WorkLogItem";
import { calculateTotals } from "../../helpers/calculateTotals";

const TabItem = ({ dayLogs, date }) => {
  const { addWorkLog } = useWorkLogsStore();
  const { totalTime, blbTime, nblbTime } = calculateTotals(dayLogs);
  const textColor = totalTime !== 8 ? "tomato" : "green";

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
      <Flex gap={5}>
        <Text color={textColor}>
          <Text as="span" fontWeight={700} color="black">
            Total time:{" "}
          </Text>
          {totalTime}h
        </Text>
        <Text>
          <strong>blb: </strong>
          {blbTime}h
        </Text>
        <Text>
          <strong>nblb: </strong>
          {nblbTime}h
        </Text>
      </Flex>
      <SimpleGrid
        minChildWidth={300}
        spacing={5}
        mt={15}
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
