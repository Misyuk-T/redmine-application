import { extendTheme } from "@chakra-ui/react";

import "@fontsource/raleway/latin.css";
import "@fontsource/open-sans/latin.css";

import "react-day-picker/dist/style.css";

const theme = extendTheme({
  fonts: {
    heading: '"Raleway", sans-serif',
  },
  body: {
    fontFamily: "Open sans",
  },
  styles: {
    global: {
      "html, body": {
        height: "100%",
      },
      "#root": {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
    },
  },
});

export default theme;
