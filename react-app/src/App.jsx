import { ThemeProvider, Container, Flex } from "@chakra-ui/react";
import Form from "./components/Form/Form";
import InformationTabs from "./components/Tabs/InformationTabs";
import BoxOverlay from "./components/BoxOverlay";

import theme from "./styles/index";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        as={Flex}
        position="relative"
        width="auto"
        maxW={{ xl: "1200px" }}
        px={["16px", "24px"]}
        alignItems="stretch"
        mt={30}
        centerContent
        fontFamily="Raleway"
      >
        <Form />
        <InformationTabs />
      </Container>
      <BoxOverlay bgColor="blackAlpha.50" />
    </ThemeProvider>
  );
}

export default App;
