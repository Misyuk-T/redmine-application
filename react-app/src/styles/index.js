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
      body: {
        display: "flex",
        flex: "1 0 auto",
        overflowX: "hidden",
        height: "100%",
      },
      html: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      },
      "#root": {
        flex: "1 0 auto",
      },
    },
  },
});

export default theme;
