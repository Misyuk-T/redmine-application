const { multer } = require("../middlewares");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Hello, world!");
  res.send("Hello, world!");
});

router.post("/submit-form", multer.single("file"), (req, res) => {
  const formData = req.body;
  const file = req.file;
  console.log("got form");
  res.send("Form submitted successfully!");
});

module.exports = router;
