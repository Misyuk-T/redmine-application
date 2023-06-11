import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { isWeekend, parse } from "date-fns";

import useRedmineStore from "../../store/redmineStore";
import groupByField from "../../helpers/groupByField";

import RedmineCardItem from "./RedamineCardItem";

const isDayWeekend = (dateString) => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return isWeekend(date);
};

const RedmineCard = () => {
  const { latestActivity } = useRedmineStore();

  const groupedByDate = groupByField(latestActivity, "spent_on");
  const groupedByDateArray = Object.entries(groupedByDate);

  return (
    <Card
      p={4}
      boxShadow="md"
      backgroundColor="white"
      overflow="auto"
      w="50%"
      minW="50%"
      maxW="650px"
      maxH="500px"
      resize="both"
      minH="152px"
      h="152px"
    >
      <Heading size="md" mb={2} w="100%">
        Latest Activity
      </Heading>

      {groupedByDateArray.length ? (
        groupedByDateArray.map(([date, activities]) => {
          const totalHours = activities.reduce((acc, current) => {
            return acc + current.hours;
          }, 0);
          const isValidHours = totalHours <= 8 && totalHours > 0;
          const isWorkLogInWeekend = isDayWeekend(date);

          return (
            <Box key={date} maxH="9999px">
              <Flex
                position="sticky"
                py={1}
                top="-16px"
                zIndex={1}
                backgroundColor="white"
                gap={1}
              >
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  color={isWorkLogInWeekend ? "tomato" : "blue.600"}
                >
                  {date.split("-").reverse().join("-")}
                </Text>

                {isWorkLogInWeekend && <Text fontSize="sm">(Weekend)</Text>}

                <Text fontSize="sm" color={isValidHours ? "green" : "tomato"}>
                  {totalHours}h
                </Text>
              </Flex>

              <RedmineCardItem activities={activities} />
            </Box>
          );
        })
      ) : (
        <Text>There is no latest activity</Text>
      )}
    </Card>
  );
};

export default RedmineCard;
