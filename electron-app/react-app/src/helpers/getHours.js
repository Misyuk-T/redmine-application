export const getHours = (workLogs) => {
  let nblbHours = 0;
  let blbHours = 0;

  workLogs.forEach((log) => {
    if (log.blb === "nblb") {
      nblbHours += log.hours;
    } else {
      blbHours += log.hours;
    }
  });

  const totalHours = nblbHours + blbHours;

  return {
    nblbHours,
    blbHours,
    totalHours,
  };
};

export const getTotalHours = (workLogs) => {
  let totalHours = 0;

  workLogs.forEach(([_, logs]) => {
    logs.forEach((log) => {
      totalHours += log.hours;
    });
  });

  return totalHours;
};
