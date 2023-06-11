import { useEffect } from "react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";

import useRedmineStore from "./store/redmineStore";
import {
  getLatestRedmineWorkLogs,
  getRedmineProjects,
  redmineLogin,
} from "./actions/redmine";

import Form from "./components/Form/Form";
import InformationTabs from "./components/Tabs/InformationTabs";
import BoxOverlay from "./components/BoxOverlay";
import RedmineCard from "./components/RedmineCard/RedmineCard";

import theme from "./styles/index";

const App = () => {
  const { addUser, addProjects, addLatestActivity } = useRedmineStore();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await redmineLogin();
      addUser(user);
      return user;
    };

    fetchUser().then(async (user) => {
      addProjects(await getRedmineProjects(user.id));
      addLatestActivity(await getLatestRedmineWorkLogs(user.id));
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
        <Flex gap={5} alignSelf="flex-end" w="90%">
          <RedmineCard />
          <Form />
        </Flex>
        <InformationTabs />
      </Container>
      <BoxOverlay bgColor="blackAlpha.50" />
    </ChakraProvider>
  );
};

export default App;
