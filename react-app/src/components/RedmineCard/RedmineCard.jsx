import { useEffect, useRef, useState } from "react";
import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { isWeekend, parse } from "date-fns";

import useRedmineStore from "../../store/redmineStore";
import groupByField from "../../helpers/groupByField";
import { debounce } from "../../helpers/debounce";

import RedmineCardItem from "./RedamineCardItem";

const isDayWeekend = (dateString) => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return isWeekend(date);
};

const RedmineCard = () => {
  const { latestActivity } = useRedmineStore();

  const [fontSize, setFontSize] = useState(12);
  const containerRef = useRef(null);

  const groupedByDate = groupByField(latestActivity, "spent_on");
  const groupedByDateArray = Object.entries(groupedByDate);

  const handleResize = debounce(
    (entries) => {
      const containerWidth = entries[0].contentRect.width;

      switch (true) {
        case containerWidth < 600 && containerWidth > 500:
          setFontSize(14);
          break;
        case containerWidth > 600:
          setFontSize(15);
          break;
        default:
          setFontSize(12);
          break;
      }
    },
    10,
    10
  );

  useEffect(() => {
    const currentContainer = containerRef.current;

    new ResizeObserver(handleResize).observe(currentContainer);

    return () => {
      new ResizeObserver(handleResize).unobserve(currentContainer);
    };
  }, []);

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
      ref={containerRef}
    >
      <Heading size="md" mb={2} w="100%">
        Latest Activity
      </Heading>

      {groupedByDateArray.length ? (
        groupedByDateArray.map(([date, activities]) => {
          const totalHours = activities.reduce((acc, current) => {
            return acc + current.hours;
          }, 0);
          const isValidHours = totalHours === 8;
          const isWorkLogInWeekend = isDayWeekend(date);

          return (
            <Box key={date} maxH="9999px">
              <Flex
                position="sticky"
                py={1}
                top="-18px"
                zIndex={1}
                backgroundColor="white"
                gap={1}
              >
                <Text
                  fontWeight="bold"
                  fontSize={fontSize + 2}
                  color={isWorkLogInWeekend ? "tomato" : "blue.600"}
                >
                  {date.split("-").reverse().join("-")}
                </Text>

                {isWorkLogInWeekend && (
                  <Text fontSize={fontSize + 2}>(Weekend)</Text>
                )}

                <Text
                  fontSize={fontSize + 2}
                  color={isValidHours ? "green" : "tomato"}
                >
                  {totalHours}h
                </Text>
              </Flex>

              <RedmineCardItem activities={activities} fontSize={fontSize} />
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
