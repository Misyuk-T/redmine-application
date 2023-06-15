import { addDays, format } from "date-fns";
import { Button, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/worklogsStore";
import { getCorrectGMTDateObject } from "../../helpers/getFormattedDate";

import TotalInformationTab from "./TotalInformationTab/TotalnformationTab";
import TabItem from "./TabItem";
import BoxOverlay from "../BoxOverlay";

import styles from "./InformationTabs.module.scss";

const InformationTabs = () => {
  const { workLogs, addWorkLog } = useWorkLogsStore();

  const workLogsArray = workLogs ? Object.entries(workLogs) : [];
  const lastDate = workLogsArray.length
    ? addDays(
        getCorrectGMTDateObject(workLogsArray[workLogsArray.length - 1][0]),
        1
      )
    : new Date();
  const formattedLastDate = format(lastDate, "dd-MM-yyyy");

  const handleAddWorkLog = () => {
    addWorkLog(formattedLastDate, {
      date: formattedLastDate,
      description: "New task",
      hours: 0.25,
      blb: "nblb",
      project: "",
      task: "",
    });
  };

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
          Total info
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

        <Button
          className={styles.tabItem}
          bgColor="blackAlpha.50"
          fontWeight={600}
          borderBottomRadius={0}
          height="auto"
          onClick={handleAddWorkLog}
        >
          <AddIcon />
        </Button>
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
