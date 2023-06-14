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
import { UnlockIcon } from "@chakra-ui/icons";

import useJiraStore from "../../store/jiraStore";
import useWorkLogsStore from "../../store/worklogsStore";
import { getJiraWorklogsByDateRange } from "../../actions/jira";

const extractBaseURLFromURL = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.origin;
  } catch (error) {
    return "";
  }
};

const JiraModal = () => {
  const { user } = useJiraStore();
  const { addWorkLogs } = useWorkLogsStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [range, setRange] = useState(new Date());

  const companyURL = extractBaseURLFromURL(user?.self);

  const handleSubmit = async () => {
    const startDate = format(range.from, "yyyy-MM-dd");
    const endDate = format(range.to, "yyyy-MM-dd");

    addWorkLogs(
      await getJiraWorklogsByDateRange(startDate, endDate, user?.accountId)
    );
  };

  return (
    <>
      <Button
        display="flex"
        flexDirection="column"
        aria-label="open modal"
        onClick={onOpen}
        isDisabled={!user?.accountId}
        fontSize="xs"
        p={2}
        gap={1}
        colorScheme="orange"
      >
        <UnlockIcon />
        <Text>API keys</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader w="100%" p="20px 30px 0 30px">
            Select range to export logs from Jira:{" "}
          </ModalHeader>
          <ModalCloseButton />

          <Stack
            as={ModalBody}
            alignItems="center"
            boxShadow="xl"
            width="fit-content"
            m="0 auto"
            borderRadius={5}
          >
            <DayPicker mode="range" selected={range} onSelect={setRange} />
            <Text m="0 auto">
              Extract from:{" "}
              <Link
                color="blue.500"
                fontSize="sm"
                href={companyURL}
                target="_blank"
              >
                ({companyURL})
              </Link>
            </Text>
          </Stack>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JiraModal;
