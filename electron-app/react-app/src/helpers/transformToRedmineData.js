export const transformToRedmineData = (workLogs) => {
  const redmineData = [];

  for (const key in workLogs) {
    if (workLogs.hasOwnProperty(key)) {
      const currentDate = key.split("-").reverse().join("-");
      const blb = workLogs[key][0].blb === "blb" ? "1" : "3";

      for (const item of workLogs[key]) {
        const timeEntry = {
          time_entry: {
            hours: item.hours,
            issue_id: item.project,
            spent_on: currentDate,
            comments: item.description,
            custom_fields: [{ id: 7, name: "Type", value: blb }],
          },
        };

        redmineData.push(timeEntry);
      }
    }
  }

  return redmineData;
};
