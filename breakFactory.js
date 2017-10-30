const { Event } = require('./eventFactory.js');

class Break extends Event {
  constructor(
    name,
    location,
    startTime,
    duration
  ) {
    super(
      name,
      location,
      startTime,
      duration
    );
    this.name = name;
    this.startTime = startTime;
    this.duration = duration;
    this.location = location;
    this.id = Math.random();
  }
}


function breakFactory(
    name,
    location,
    startTime,
    duration
) {

  return new Break(
    name,
    location,
    startTime,
    duration
  );
}

module.exports = breakFactory;
