import { useEffect } from "react";
import { ChakraProvider, Container, Flex, Stack } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import useRedmineStore from "./store/redmineStore";
import useJiraStore from "./store/jiraStore";

import Form from "./components/Form/Form";
import InformationTabs from "./components/Tabs/InformationTabs";
import BoxOverlay from "./components/BoxOverlay";
import RedmineCard from "./components/RedmineCard/RedmineCard";
import JiraModal from "./components/Modals/JiraModal";
import Avatar from "./components/Avatar";
import SettingModal from "./components/Modals/SettingModal";
import ServicesStatus from "./components/ServicesStatus";
import Loader from "./components/Loader";

import theme from "./styles/index";
import { observeAuth } from "./actions/auth";
import useAuthStore from "./store/userStore";

const App = () => {
  const { user: jiraUser } = useJiraStore();
  const { user } = useRedmineStore();
  const { isAuthObserve, user: googleUser, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthObserve) {
      observeAuth();
      useAuthStore.setState({ isAuthObserve: true });
    }
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
        gap="30px"
      >
        <Flex justifyContent="space-between" gap={5}>
          <Flex gap={5} w="80%" justifyContent="space-between">
            <RedmineCard />
            <Form />
          </Flex>

          <Stack
            justifyContent="space-between"
            maxH="152px"
            maxW="210px"
            flexGrow={1}
          >
            <Stack>
              <Avatar user={googleUser} />

              <Stack boxShadow="sm" p={1} w="100%" bg="white" borderRadius={6}>
                <ServicesStatus title="redmine" user={user} />
                <ServicesStatus title="jira" user={jiraUser} />
              </Stack>
            </Stack>

            <Flex
              gap={1}
              alignSelf="flex-start"
              justifyContent="space-between"
              w="100%"
            >
              <SettingModal />
              <JiraModal />
            </Flex>
          </Stack>
        </Flex>

        <InformationTabs />
        <Loader isVisible={isLoading} isFixed />
      </Container>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BoxOverlay bgColor="blackAlpha.50" />
    </ChakraProvider>
  );
};

export default App;
