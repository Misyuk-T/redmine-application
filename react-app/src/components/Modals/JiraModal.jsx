import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

import useJiraStore from "../../store/jiraStore";
import useWorkLogsStore from "../../store/worklogsStore";
import { getJiraWorklogIssues } from "../../actions/jira";

const JiraModal = () => {
  const { user, organizationURL } = useJiraStore();
  const { addWorkLogs, setIsJiraExport } = useWorkLogsStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [range, setRange] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const startDate = format(range.from, "yyyy-MM-dd");
    const endDate = format(range.to, "yyyy-MM-dd");

    setIsLoading(true);
    addWorkLogs(
      await getJiraWorklogIssues(startDate, endDate, user?.accountId)
    );
    setIsJiraExport(true);
    onClose();
    setIsLoading(false);
  };

  return (
    <>
      <Button
        display="flex"
        flexDirection="column"
        alignItems="center"
        aria-label="open modal"
        onClick={onOpen}
        isDisabled={!user?.accountId}
        fontSize="xs"
        p={3}
        gap={1}
        colorScheme="blue"
        boxShadow="xl"
        whiteSpace="wrap"
      >
        <CalendarIcon />
        <Text>Export from Jira logs</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            w="100%"
            p="20px 30px"
            borderBottom="1px solid"
            borderColor="gray.300"
            mb="20px"
          >
            Select date range to export worklogs{" "}
          </ModalHeader>
          <ModalCloseButton />

          <Stack
            as={ModalBody}
            alignItems="center"
            border="1px solid"
            width="fit-content"
            m="0 auto"
            borderRadius={5}
            background="gray.50"
          >
            <DayPicker mode="range" selected={range} onSelect={setRange} />
            <Text m="0 auto">
              Extract from:{" "}
              <Link
                color="blue.500"
                fontSize="sm"
                href={organizationURL}
                target="_blank"
              >
                ({organizationURL})
              </Link>
            </Text>
          </Stack>

          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
              isDisabled={!range?.from || !range?.to}
              isLoading={isLoading}
              loadingText="Exporting..."
            >
              Export worklogs
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JiraModal;
