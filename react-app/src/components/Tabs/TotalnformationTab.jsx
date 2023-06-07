import { Heading, SimpleGrid, Stack, TabPanel, Text } from "@chakra-ui/react";
import { getHours, getTotalHours } from "../../helpers/getHours";

const TotalInformationTab = ({ workLogs }) => {
  const columnNumber = workLogs.length + 1;
  const totalPeriodHours = getTotalHours(workLogs);

  return (
    <TabPanel px={0}>
      <SimpleGrid columns={columnNumber}>
        <Stack justifyContent="center" gap={1}>
          <Heading my={4} size="sm">
            nblb:
          </Heading>
          <Heading my={4} size="sm">
            blb:
          </Heading>
          <Heading my={4} size="sm">
            Total by date:
          </Heading>
          <Heading my={4} size="sm">
            Total by period:
          </Heading>
        </Stack>

        {workLogs.map(([_, logs], index) => {
          const { nblbHours, blbHours, totalHours } = getHours(logs);
          const totalTextColor = totalHours !== 8 ? "tomato" : "green";
          const isLastItem = index === workLogs.length - 1;

          return (
            <Stack justifyContent="center" key={index} gap={1}>
              <Text lineHeight={1.2} my={4} textAlign="center" fontWeight={500}>
                {nblbHours}
              </Text>
              <Text lineHeight={1.2} my={4} textAlign="center" fontWeight={500}>
                {blbHours}
              </Text>
              <Text
                lineHeight={1.2}
                my={4}
                color={totalTextColor}
                textAlign="center"
                fontWeight={600}
              >
                {totalHours}
              </Text>
              <Text
                lineHeight={1.2}
                my={4}
                textAlign="center"
                fontWeight={800}
                fontSize="lg"
              >
                {isLastItem ? totalPeriodHours : "ㅤ"}
              </Text>
              )
            </Stack>
          );
        })}
      </SimpleGrid>
    </TabPanel>
  );
};

export default TotalInformationTab;
