import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const parseDataFromJira = (data, accountId) => {
  return data.issues.flatMap((ticket) => {
    return ticket.fields.worklog.worklogs
      .filter((worklog) => worklog.author.accountId === accountId)
      .map((authorLog) => {
        const formattedCurrentDate = authorLog.started.replace(
          /(\+\d{2})(\d{2})$/,
          "$1:$2"
        );
        return {
          description: authorLog.comment || "",
          hours: parseInt(authorLog.timeSpent),
          date: format(new Date(formattedCurrentDate), "dd-MM-yyyy"),
          task: ticket.key,
          project: "",
          blb: "nblb",
          id: uuidv4(),
        };
      });
  });
};
