import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import BoxOverlay from "../BoxOverlay";

import useWorkLogsStore from "../../store/worklogsStore";

import TotalInformationTab from "./TotalInformationTab/TotalnformationTab";
import TabItem from "./TabItem";

import styles from "./InformationTabs.module.scss";

const InformationTabs = () => {
  const { workLogs } = useWorkLogsStore();

  const workLogsArray = workLogs ? Object.entries(workLogs) : [];

  return (
    <Tabs
      className={styles.informationTabs}
      variant="enclosed"
      isFitted
      mt={35}
      h="100%"
    >
      <TabList className={styles.tabsList}>
        <Tab
          className={styles.tabItem}
          bgColor="blackAlpha.50"
          fontWeight={600}
        >
          Total information
        </Tab>

        {workLogsArray.map(([date]) => {
          const [month, day] = date.split("-");

          return (
            <Tab
              key={date}
              className={styles.tabItem}
              bgColor="blackAlpha.50"
              fontWeight={600}
            >
              {`${month}-${day}`}
            </Tab>
          );
        })}
      </TabList>

      <TabPanels h="calc(100% - 45px)" position="relative">
        <TotalInformationTab data={workLogsArray} />

        {workLogsArray.map(([date, logs]) => {
          return <TabItem key={date} dayLogs={logs} date={date} />;
        })}

        <BoxOverlay bgColor="blackAlpha.50" />
      </TabPanels>
    </Tabs>
  );
};

export default InformationTabs;
