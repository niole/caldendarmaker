/**
 * @class
 * @name Event
 * @param {string} name - a name for the event
 * @param {number[]} location - lat long for a event location
 * @param {number} startTime - start of event in ms
 * @param {number} duration - duration of event in ms
 */


class Event {
  constructor(
    name,
    location,
    startTime,
    duration
  ) {
    if (!duration || !startTime) {
      console.error("Make sure the following vars are defined: duration:" + duration+","+ "startTime:"+ startTime);
    }

    this.name = name;
    this.startTime = startTime;
    this.duration = duration;
    this.location = location;
    this.id = Math.random();
  }

  getEndTime() {
    return this.startTime + this.duration;
  }
}


function eventFactory(
    duration,
    startTime,
    name,
    location
) {
  return new Event(
    name,
    location,
    startTime,
    duration
  );
}

module.exports = {
  eventFactory,
  Event,
};
