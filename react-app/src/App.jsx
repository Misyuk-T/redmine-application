import { useEffect } from "react";
import { ChakraProvider, Container, Flex, Stack } from "@chakra-ui/react";

import useRedmineStore from "./store/redmineStore";
import useJiraStore from "./store/jiraStore";

import { jiraLogin } from "./actions/jira";
import {
  getLatestRedmineWorkLogs,
  getRedmineProjects,
  redmineLogin,
} from "./actions/redmine";

import Form from "./components/Form/Form";
import InformationTabs from "./components/Tabs/InformationTabs";
import BoxOverlay from "./components/BoxOverlay";
import RedmineCard from "./components/RedmineCard/RedmineCard";
import JiraModal from "./components/Modals/JiraModal";
import Avatar from "./components/Avatar";
import SettingModals from "./components/Modals/SettingModals";

import theme from "./styles/index";

const App = () => {
  const { addUser: addJiraUser, user: jiraUser } = useJiraStore();
  const { addUser, addProjects, addLatestActivity, user } = useRedmineStore();

  const fetchRedmineUser = async () => {
    const user = await redmineLogin();
    addUser(user);
    return user;
  };

  const fetchJiraUser = async () => {
    addJiraUser(await jiraLogin());
  };

  useEffect(() => {
    fetchJiraUser().then();
    fetchRedmineUser().then(async (user) => {
      if (user) {
        addProjects(await getRedmineProjects(user.id));
        addLatestActivity(await getLatestRedmineWorkLogs(user.id));
      }
    });
  }, []);

  return (
    <ChakraProvider theme={theme} resetCSS>
      <Container
        as={Flex}
        position="relative"
        width="auto"
        maxW="1200px"
        px={["16px", "24px"]}
        flexGrow={1}
        flexShrink={0}
        alignItems="stretch"
        h="100%"
        w="100%"
        pt={30}
        centerContent
      >
        <Flex justifyContent="space-between" gap={5}>
          <Flex gap={5} w="90%">
            <RedmineCard />
            <Form />
          </Flex>

          <Stack justifyContent="space-between" maxH="152px">
            <Stack>
              <Avatar title="redmine" user={user} />
              <Avatar title="jira" user={jiraUser} />
            </Stack>

            <Flex gap={2} alignSelf="flex-start">
              <SettingModals />
              <JiraModal />
            </Flex>
          </Stack>
        </Flex>

        <InformationTabs />
      </Container>
      <BoxOverlay bgColor="blackAlpha.50" />
    </ChakraProvider>
  );
};

export default App;
