import { SimpleGrid, TabPanel } from "@chakra-ui/react";
import WorkLogItem from "./WorkLogItem";

const TabItem = ({ dayLogs }) => {
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
      </SimpleGrid>
    </TabPanel>
  );
};

export default TabItem;
