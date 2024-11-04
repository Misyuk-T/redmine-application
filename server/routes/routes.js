const express = require("express");
const path = require("path");
const axios = require("axios");

const { multer } = require("../middlewares");
const { parseText, parseXMLS } = require("../scripts");

const serverUserAgentPlaceholder = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'

const router = express.Router();

router.post("/submit-form", multer.single("file"), async (req, res) => {
  const formData = req.body;
  const fileType = formData.type;
  const file = req.file;
  const fileExtension = path.extname(file.originalname);
  const isXLSXFile = fileExtension === ".xlsx";
  const isTextFile = fileExtension === ".txt";
  const isJiraFile = fileType === "jira";

  try {
    if ((isJiraFile && isXLSXFile) || (!isJiraFile && isTextFile)) {
      const data = isXLSXFile ? file.buffer : file.buffer.toString("utf8");
      const parsedResponse = isJiraFile ? parseXMLS(data) : parseText(data);
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

router.all("/redmine/*", async (req, res) => {
  try {
    const {redmineApiKey,  redmineUrl } = req.query;
    const redmineURL = `https://redmine.${redmineUrl}.com`;
    const url = `${redmineURL}${req.originalUrl.replace("/redmine", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: {
        key: redmineApiKey,
      },
      headers: {
        "User-Agent": serverUserAgentPlaceholder
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
    const { jiraUrl, jiraApiKey, jiraEmail } = req.query; // Exclude current settings
    const url = `https://${jiraUrl}${req.originalUrl.replace("/jira", "")}`;


    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: `Basic ${Buffer.from(
            `${jiraEmail}:${jiraApiKey}`
        ).toString("base64")}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    // console.error("Error while connecting to JIRA: ", error);
    res.status(500).send("Error while connecting to JIRA");
  }
});


module.exports = router;
