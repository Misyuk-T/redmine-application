export const calculateTotals = (data) => {
  let totalTime = 0;
  let blbTime = 0;
  let nblbTime = 0;

  data.forEach((workLog) => {
    const hours = workLog.hours;
    const blb = workLog.blb;

    totalTime += hours;

    if (blb === "blb") {
      blbTime += hours;
    } else {
      nblbTime += hours;
    }
  });

  return {
    totalTime,
    blbTime,
    nblbTime,
  };
};
