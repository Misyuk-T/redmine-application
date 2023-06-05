import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import BoxOverlay from "../BoxOverlay";

import styles from "./InformationTabs.module.scss";
import useWorkLogsStore from "../../store/store";
import TotalInformationTab from "./TotalnformationTab";
import TabItem from "./TabItem";

const InformationTabs = () => {
  const {
    workLogs,
    error,
    addWorkLogs,
    resetWorkLogs,
    addWorkLog,
    editWorkLog,
    addWorkLogsError,
    resetWorkLogsError,
  } = useWorkLogsStore();

  const workLogsArray = workLogs ? Object.entries(workLogs) : [];

  return (
    <Tabs
      className={styles.informationTabs}
      variant="enclosed"
      isFitted
      mt={35}
    >
      <TabList className={styles.tabsList}>
        <Tab
          className={styles.tabItem}
          bgColor="blackAlpha.50"
          fontWeight={600}
        >
          Total information
        </Tab>

        {workLogsArray.map(([date], index) => {
          const [month, day] = date.split("-");

          return (
            <Tab
              key={date + index}
              className={styles.tabItem}
              bgColor="blackAlpha.50"
              fontWeight={600}
            >
              {`${month}-${day}`}
            </Tab>
          );
        })}
      </TabList>

      <TabPanels position="relative">
        <TotalInformationTab workLogs={workLogsArray} />

        {workLogsArray.map(([date, logs]) => {
          return <TabItem dayLogs={logs} />;
        })}

        <BoxOverlay bgColor="blackAlpha.50" />
      </TabPanels>
    </Tabs>
  );
};

export default InformationTabs;
