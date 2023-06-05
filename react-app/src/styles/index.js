import { extendTheme } from "@chakra-ui/react";

import "@fontsource/raleway/latin.css";
import "@fontsource/open-sans/latin.css";

const theme = extendTheme({
  fonts: {
    heading: '"Raleway", sans-serif',
  },
});

export default theme;
