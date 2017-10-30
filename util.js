function getTimeChunks(breaks, startTime, endTime) {
  const timeChunks = [];
  if (breaks.length) {
    if (startTime !== breaks[0].startTime) {
      timeChunks.push(breaks[0].startTime - startTime);
    }

    let nextBreak = 1;

    while(nextBreak < breaks.length) {
      timeChunks.push(
        breaks[nextBreak].startTime - breaks[nextBreak-1].getEndTime()
      );
      nextBreak += 1;
    }

    if (endTime !== breaks[breaks.length-1].getEndTime()) {
      timeChunks.push(endTime - breaks[breaks.length - 1].getEndTime());
    }

  } else {
    timeChunks.push(endTime - startTime);
  }
  return timeChunks;
}

module.exports = {
  getTimeChunks,
};
