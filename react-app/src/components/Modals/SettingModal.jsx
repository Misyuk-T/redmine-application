import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Flex,
  Image,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";

import useRedmineStore from "../../store/redmineStore";
import useJiraStore from "../../store/jiraStore";
import { getSettings, sendSettings } from "../../actions/settings";
import {
  getLatestRedmineWorkLogs,
  getRedmineProjects,
  redmineLogin,
} from "../../actions/redmine";
import { jiraLogin } from "../../actions/jira";

import SettingModalItem from "./SettingModalItem";

import RedmineApi from "../../assets/RedmineAPI.png";
import JiraUserName from "../../assets/JiraUserName.png";

const fieldItems = [
  {
    name: "Redmine URL",
    id: "redmineUrl",
    leftAddon: "https://redmine.",
    rightAddon: ".com",
  },
  {
    name: "JIRA URL",
    id: "jiraUrl",
    leftAddon: "https://",
    rightAddon: ".atlassian.net",
  },
  {
    name: "Redmine API Key",
    id: "redmineApiKey",
    content: (
      <OrderedList>
        <ListItem>Open your redmine account</ListItem>
        <ListItem>
          On the top-right corner find show <strong>API access key</strong>
        </ListItem>
        <ListItem>Copy this key into field</ListItem>
        <Image mt={5} src={RedmineApi} w="500px" h={300} />
      </OrderedList>
    ),
    leftAddon: "",
    rightAddon: "",
  },

  {
    name: "JIRA API Key",
    id: "jiraApiKey",
    content: (
      <OrderedList>
        <ListItem>
          Open next link:{" "}
          <Link
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            target="_blank"
            color="blue.500"
          >
            Generate Jira API key
          </Link>
        </ListItem>
        <ListItem>Follow instruction to generate API key</ListItem>
      </OrderedList>
    ),
    leftAddon: "",
    rightAddon: "",
  },
  {
    name: "JIRA Email",
    id: "jiraEmail",
    content: (
      <OrderedList>
        <ListItem>Atlassian account username</ListItem>
        <Image mt={5} src={JiraUserName} w={300} h={300} />
      </OrderedList>
    ),
    leftAddon: "",
    rightAddon: "",
  },
];

const getOrganizationUrls = (jiraOrganization, redmineOrganization) => {
  const redmineUrl = redmineOrganization
    ? `https://redmine.${redmineOrganization}.com`
    : "";
  const jiraUrl = jiraOrganization
    ? `https://${jiraOrganization}.atlassian.net`
    : "";

  return { redmineUrl, jiraUrl };
};

const SettingModal = () => {
  const { addOrganizationURL, addUser, addProjects, addLatestActivity } =
    useRedmineStore();
  const { addOrganizationURL: setJiraUrl, addUser: addJiraUser } =
    useJiraStore();

  const [isLoading, setIsLoading] = useState(false);
  const [initialValue, setInitialValue] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {},
  });

  const saveOrganizationUrls = (jiraOrganization, redmineOrganization) => {
    const { redmineUrl, jiraUrl } = getOrganizationUrls(
      jiraOrganization,
      redmineOrganization
    );

    addOrganizationURL(redmineUrl);
    setJiraUrl(jiraUrl);
  };

  const fetchRedmineUser = async () => {
    const user = await redmineLogin();
    addUser(user);
    return user;
  };

  const fetchJiraUser = async () => {
    addJiraUser(await jiraLogin());
  };

  const handleSaveApiKeys = async (data) => {
    setIsLoading(true);
    await sendSettings(data).then(() => {
      fetchJiraUser().then();
      fetchRedmineUser().then(async (user) => {
        if (user) {
          addProjects(await getRedmineProjects(user.id));
          addLatestActivity(await getLatestRedmineWorkLogs(user.id));
        }

        saveOrganizationUrls(data?.jiraUrl, data?.redmineUrl);
        onClose();
        setIsLoading(false);
      });
    });
  };

  const fetchSettings = async () => {
    await getSettings().then((data) => {
      const jiraOrganization = data?.jiraUrl || "";
      const redmineOrganization = data?.redmineUrl || "";

      setValue("redmineUrl", redmineOrganization);
      setValue("jiraUrl", jiraOrganization);
      setValue("redmineApiKey", data?.redmineApiKey || "");
      setValue("jiraApiKey", data?.jiraApiKey || "");
      setValue("jiraEmail", data?.jiraEmail || "");

      saveOrganizationUrls(jiraOrganization, redmineOrganization);
      setInitialValue(data);
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <Button
        display="flex"
        flexDirection="column"
        onClick={onOpen}
        fontSize="xs"
        p={2}
        gap={1}
        colorScheme="orange"
        boxShadow="xl"
      >
        <UnlockIcon />
        <Text>Settings</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            w="100%"
            p="20px 30px"
            borderBottom="1px solid"
            borderColor="gray.300"
          >
            Settings:
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              {fieldItems.map(
                ({ id, name, content, leftAddon, rightAddon }) => {
                  return (
                    <SettingModalItem
                      key={id}
                      id={id}
                      name={name}
                      register={register}
                      leftAddon={leftAddon}
                      rightAddon={rightAddon}
                      errors={errors}
                    >
                      {content}
                    </SettingModalItem>
                  );
                }
              )}
            </Stack>
          </ModalBody>

          <Flex as={ModalFooter} gap={5}>
            <Button
              colorScheme="red"
              onClick={() => reset(initialValue)}
              variant="outline"
              isDisabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSubmit(handleSaveApiKeys)}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Submit
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingModal;
