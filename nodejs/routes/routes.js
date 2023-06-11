const fs = require("fs");
const express = require("express");
const path = require("path");
const axios = require("axios");

const { multer } = require("../middlewares");
const { parseText, parseXMLS } = require("../scripts");

const router = express.Router();

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
      res.status(400).send(error.message);
    }
  });
});

router.all("/redmine/*", async (req, res) => {
  try {
    const redmineURL = "https://redmine.anyforsoft.com";
    const url = `${redmineURL}${req.originalUrl.replace("/redmine", "")}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send("Internal server error");
    throw new Error(`Error while get Redmine API: ${error}`);
  }
});

module.exports = router;
