const XLSX = require("xlsx");

const parseCustomData = (data) => {
  let currentDay = "";

  const lines = data.split("\n");
  const entries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d{2}\.\d{2}$/)) {
      currentDay = line;
    } else if (line.match(/^\d+\./)) {
      let hours;

      const parts = line.split(" ");
      const description = parts
        .slice(0, -1)
        .join(" ")
        .replace(/^\d+\.\s*/, "")
        .replace(/\s*\d+(\.\d+)?h$/, "")
        .trim();

      const lastPart = parts[parts.length - 1].trim();
      const preLastPart = parts[parts.length - 2].trim();
      const status =
        lastPart.includes("nblb") || lastPart.includes("blb")
          ? lastPart
          : "nblb";

      if (preLastPart.match(/^\d+(\.\d+)?h$/)) {
        hours = preLastPart;
      }
      if (lastPart.match(/^\d+(\.\d+)?h$/)) {
        hours = lastPart;
      }

      entries.push({
        date: currentDay,
        description,
        hours,
        status,
      });
    }
  }

  return entries;
};

const parseXMLS = () => {
  const workbook = XLSX.readFile("worklogs.xlsx");
  const sheetName = workbook.SheetNames[1];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
};

module.exports = { parseCustomData, parseXMLS };
