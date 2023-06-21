import { useRef, useState } from "react";
import { addDays, format } from "date-fns";
import { Button, Tab, TabList, TabPanels, Tabs, Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/worklogsStore";
import { getCorrectGMTDateObject } from "../../helpers/getFormattedDate";

import TotalInformationTab from "./TotalInformationTab/TotalnformationTab";
import TabItem from "./TabItem";
import BoxOverlay from "../BoxOverlay";
import Footer from "../Footer";

import styles from "./InformationTabs.module.scss";

const getSortedByDate = (data) =>
  data.sort((a, b) => {
    const dateA = new Date(a[0].split("-").reverse().join("-"));
    const dateB = new Date(b[0].split("-").reverse().join("-"));
    return dateA - dateB;
  });

const InformationTabs = () => {
  const parentContainerRef = useRef(null);
  const fixedContainerRef = useRef(null);
  const fixedActionsPanelRef = useRef(null);

  const { workLogs, addWorkLog, setIsJiraExport } = useWorkLogsStore();
  const [isScrollEnable, setIsScrollEnable] = useState(false);

  const container = parentContainerRef?.current;
  const pinDiv = fixedContainerRef?.current;
  const pinActionsPanel = fixedActionsPanelRef?.current;

  const workLogsArray = workLogs ? Object.entries(workLogs) : [];
  const sortedArray =
    workLogsArray.length > 0 ? getSortedByDate(workLogsArray) : workLogsArray;
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
    setIsJiraExport(false);
  };

  const handleScroll = () => {
    if (container.scrollLeft > 0 && isScrollEnable) {
      pinDiv.style.transform = `translateX(${container.scrollLeft}px)`;
    } else {
      pinDiv.style.transform = "none";
      pinActionsPanel.style.transform = `translateX(${container.scrollLeft}px)`;
    }
  };

  return (
    <Box h="100%" position="relative">
      <Tabs
        position="relative"
        className={styles.informationTabs}
        variant="enclosed"
        isFitted
        h="calc(100% - 21px)"
        overflowX="auto"
        overflowY="visible"
        ref={parentContainerRef}
        onChange={(index) => {
          setIsScrollEnable(index !== 0);
          pinDiv.style.transform = `translateX(${container.scrollLeft}px)`;
        }}
        onScroll={handleScroll}
      >
        <TabList className={styles.tabsList}>
          <Tab
            minW="120px"
            className={styles.tabItem}
            bgColor="blackAlpha.50"
            fontWeight={600}
          >
            Total
          </Tab>

          {sortedArray.map(([date]) => {
            const [month, day] = date.split("-");

            return (
              <Tab
                key={date}
                className={styles.tabItem}
                bgColor="blackAlpha.50"
                fontWeight={600}
                minW="80px"
              >
                {`${month}-${day}`}
              </Tab>
            );
          })}

          <Button
            bgColor="blackAlpha.50"
            fontWeight={600}
            borderBottomRadius={0}
            borderBottom="1px solid"
            borderColor="transparent"
            height="auto"
            onClick={handleAddWorkLog}
            w="40px"
            mb="-1px"
            _hover={{
              borderColor: "transparent",
            }}
          >
            <AddIcon />
          </Button>
        </TabList>

        <TabPanels
          h="calc(100% - 45px)"
          position="relative"
          ref={fixedContainerRef}
        >
          <TotalInformationTab
            data={workLogsArray}
            ref={fixedActionsPanelRef}
          />

          {sortedArray.map(([date, logs]) => {
            return <TabItem key={date} dayLogs={logs} date={date} />;
          })}
        </TabPanels>
      </Tabs>

      <Footer />
      <BoxOverlay
        bgColor="blackAlpha.50"
        height="calc(100% - 41px)"
        top="41px"
        borderTop="1px solid"
        borderColor="#b7aeae"
      />
    </Box>
  );
};

export default InformationTabs;
