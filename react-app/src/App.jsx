import { ChakraProvider, Container, Flex } from "@chakra-ui/react";

import Form from "./components/Form/Form";
import InformationTabs from "./components/Tabs/InformationTabs";
import BoxOverlay from "./components/BoxOverlay";

import theme from "./styles/index";

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Container
        as={Flex}
        position="relative"
        width="auto"
        maxW={{ xl: "1200px" }}
        px={["16px", "24px"]}
        alignItems="stretch"
        h="100%"
        w="100%"
        mt={30}
        centerContent
      >
        <Form />
        <InformationTabs />
      </Container>
      <BoxOverlay bgColor="blackAlpha.50" />
    </ChakraProvider>
  );
}

export default App;
