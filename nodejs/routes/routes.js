const fs = require("fs");
const express = require("express");
const path = require("path");
const axios = require("axios");
const Store = require("electron-store");

const { multer } = require("../middlewares");
const { parseText, parseXMLS } = require("../scripts");

const router = express.Router();
const store = new Store();

router
  .post("/settings", (req, res) => {
    try {
      const apiKeys = req.body;
      store.set("apiKeys", apiKeys);
      res.status(200);
    } catch (error) {
      console.error("Error while connecting to Redmine: ", error);
      res.status(500).send(`Server error while save settings`);
    }
  })
  .get("/settings", (req, res) => {
    try {
      const savedApiKeys = store.get("apiKeys");
      res.status(200).send(savedApiKeys);
    } catch (error) {
      console.error("Error while connecting to Redmine: ", error);
      res.status(500).send(`Server error while getting settings`);
    }
  });

router.post("/submit-form", multer.single("file"), async (req, res) => {
  const formData = req.body;
  const fileType = formData.type;
  const file = req.file;
  const fileExtension = path.extname(file.path);
  const isXLSXFile = fileExtension === ".xlsx";
  const isTextFile = fileExtension === ".txt";
  const isJiraFile = fileType === "jira";

  fs.readFile(file.path, "utf8", (err, data) => {
    try {
      if ((isJiraFile && isXLSXFile) || (!isJiraFile && isTextFile)) {
        const parsedResponse = isJiraFile
          ? parseXMLS(file.path)
          : parseText(data);
        res.send(parsedResponse);
      } else {
        throw new Error(
          "Invalid file extension. Only .txt for custom and .xlsx for jira files are supported."
        );
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send(`Error while parsing file on server: ${error}`);
    }
  });
});

router.all("/redmine/*", async (req, res) => {
  try {
    const savedApiKeys = store.get("apiKeys");
    const redmineApiKey = savedApiKeys?.redmineApiKey;
    const redmineOrganization = savedApiKeys?.redmineUrl;
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

router.all("/jira/*", async (req, res) => {
  try {
    const savedApiKeys = store.get("apiKeys");
    const jiraApiKey = savedApiKeys?.jiraApiKey;
    const jiraOrganization = savedApiKeys?.jiraUrl;
    const jiraLogin = savedApiKeys?.jiraEmail;
    const redmineURL = `https://${jiraOrganization}.atlassian.net`;
    const url = `${redmineURL}${req.originalUrl.replace("/jira", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${jiraLogin}:${jiraApiKey}`
        ).toString("base64")}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    console.error("Error while connecting to JIRA: ", error);
    res.status(500).send("Error while connecting to JIRA");
  }
});

module.exports = router;
