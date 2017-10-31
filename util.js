function getTimeChunks(breaks, startTime, endTime) {
  const timeChunks = [];
  if (breaks.length) {
    if (startTime !== breaks[0].startTime) {
      timeChunks.push({
        duration: breaks[0].startTime - startTime,
        start: startTime,
      });
    }

    let nextBreak = 1;

    while(nextBreak < breaks.length) {
      timeChunks.push({
        duration: breaks[nextBreak].startTime - breaks[nextBreak-1].getEndTime(),
        start: breaks[nextBreak-1].getEndTime(),
      });
      nextBreak += 1;
    }

    if (endTime !== breaks[breaks.length-1].getEndTime()) {
      timeChunks.push({
        duration: endTime - breaks[breaks.length - 1].getEndTime(),
        start: breaks[breaks.length - 1].getEndTime(),
      });
    }

  } else {
    timeChunks.push({
      duration: endTime - startTime,
      start: startTime,
    });
  }
  return timeChunks;
}

module.exports = {
  getTimeChunks,
};
