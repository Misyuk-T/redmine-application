const express = require("express");
const path = require("path");
const axios = require("axios");

const { multer } = require("../middlewares");
const { parseText, parseXMLS } = require("../scripts");

const router = express.Router();
const store = {};

// router
//   .post("/settings", (req, res) => {
//     try {
//       const newSettings = req.body;
//       const savedSettings = store.get("settings") || {};
//
//       // Merge new settings with existing settings
//       const updatedSettings = { ...savedSettings, ...newSettings };
//
//       store.set("settings", updatedSettings);
//       res.status(200).send();
//     } catch (error) {
//       console.error("Error while saving settings: ", error);
//       res.status(500).send("Server error while saving settings");
//     }
//   })
//   .get("/settings", (req, res) => {
//     try {
//       const savedSettings = store.get("settings") || {};
//       res.status(200).send(savedSettings);
//     } catch (error) {
//       console.error("Error while getting settings: ", error);
//       res.status(500).send("Server error while getting settings");
//     }
//   })
//   .delete("/settings/:id", (req, res) => {
//     try {
//       const id = req.params.id;
//       const savedSettings = store.get("settings") || {};
//
//       if (savedSettings.hasOwnProperty(id)) {
//         delete savedSettings[id];
//         store.set("settings", savedSettings);
//         res.status(200).send();
//       } else {
//         res.status(404).send("Settings were not found on server");
//       }
//     } catch (error) {
//       console.error("Error while deleting settings: ", error);
//       res.status(500).send("Server error while deleting settings");
//     }
//   });
//
// router
//   .post("/current-settings", (req, res) => {
//     try {
//       const currentSettings = req.body;
//       store.set("currentSettings", currentSettings);
//       res.status(200).send();
//     } catch (error) {
//       console.error("Error while save settings: ", error);
//       res.status(500).send(`Server error while save current settings`);
//     }
//   })
//   .get("/current-settings", (req, res) => {
//     try {
//       const savedCurrentSettings = store.get("currentSettings");
//       res.status(200).send(savedCurrentSettings);
//     } catch (error) {
//       console.error("Error while get settings: ", error);
//       res.status(500).send(`Server error while getting current settings`);
//     }
//   });
//
// router.post("/submit-form", multer.single("file"), async (req, res) => {
//   const formData = req.body;
//   const fileType = formData.type;
//   const file = req.file;
//   const fileExtension = path.extname(file.originalname);
//   const isXLSXFile = fileExtension === ".xlsx";
//   const isTextFile = fileExtension === ".txt";
//   const isJiraFile = fileType === "jira";
//
//   try {
//     if ((isJiraFile && isXLSXFile) || (!isJiraFile && isTextFile)) {
//       const data = isXLSXFile ? file.buffer : file.buffer.toString("utf8");
//       const parsedResponse = isJiraFile ? parseXMLS(data) : parseText(data);
//       res.send(parsedResponse);
//     } else {
//       throw new Error(
//         "Invalid file extension. Only .txt for custom and .xlsx for jira files are supported."
//       );
//     }
//   } catch (error) {
//     console.error("Error: ", error);
//     res.status(500).send(`Error while parsing file on server: ${error}`);
//   }
// });

router.all("/redmine/*", async (req, res) => {
  try {
    // const savedCurrentSettings = store.get("currentSettings");
    // const redmineApiKey = savedCurrentSettings?.redmineApiKey;
    const redmineApiKey = 'dccc1ca874382c662192a9c2e373de41b104ce2b';
    // const redmineOrganization = savedCurrentSettings?.redmineUrl;
    const redmineOrganization = 'anyforsoft';
    const redmineURL = `https://redmine.${redmineOrganization}.com`;
    const url = `${redmineURL}${req.originalUrl.replace("/redmine", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: {
        key: redmineApiKey,
      },
    });

    res.send(response.data);
  } catch (error) {
    console.error("Error while connecting to Redmine: ", error);
    res.status(500).send("Error while connecting to Redmine");
  }
});

// router.all("/jira/*", async (req, res) => {
//   try {
//     const savedCurrentSettings = store.get("currentSettings");
//     const jiraApiKey = savedCurrentSettings?.jiraApiKey;
//     const jiraOrganization = savedCurrentSettings?.jiraUrl;
//     const jiraLogin = savedCurrentSettings?.jiraEmail;
//     const redmineURL = `https://${jiraOrganization}.atlassian.net`;
//     const url = `${redmineURL}${req.originalUrl.replace("/jira", "")}`;
//
//     const response = await axios({
//       method: req.method,
//       url,
//       data: req.body,
//       headers: {
//         Authorization: `Basic ${Buffer.from(
//           `${jiraLogin}:${jiraApiKey}`
//         ).toString("base64")}`,
//       },
//     });
//
//     res.send(response.data);
//   } catch (error) {
//     console.error("Error while connecting to JIRA: ", error);
//     res.status(500).send("Error while connecting to JIRA");
//   }
// });

module.exports = router;
