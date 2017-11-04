const assert = require('assert');
const {
  getTimeChunks,
} = require('./util.js');
const breakFactory = require('./breakFactory.js');
const todoFactory = require('./todoFactory.js');
const calendarFactory = require('./calendarFactory.js');

function hourToMs(h) {
  return h*60*60*1000;
}

const breaks = [
  breakFactory(
    "lunch",
    undefined,
    hourToMs(12),
    hourToMs(1)
  ),
  breakFactory(
    "dinner",
    undefined,
    hourToMs(17),
    hourToMs(1)
  ),
];

const todos = [
  todoFactory(
    "climbing",
    undefined,
    hourToMs(1),
    hourToMs(1.5),
    [37.850831, -122.292731]
  ),
  todoFactory(
    "nicta haskell course",
    undefined,
    hourToMs(1.5),
    hourToMs(2),
    [37.872122, -122.268897]
  ),
  todoFactory(
    "actually watch music tutorials and do them",
    hourToMs(1),
    [37.866532, -122.250610]
  ),
  todoFactory(
    "coursera course",
    undefined,
    hourToMs(2),
    hourToMs(2.5),
    [37.872893, -122.260958]
  ),
];

const calendar = calendarFactory(todos, breaks, hourToMs(8.5), hourToMs(19));

assert.deepEqual(
  calendar.getDay(new Date(calendar.initializedAt.getTime() + hourToMs(24*4))),
  calendar.getDayAtIndex(3),
  "The fourth day should be at the third index in events"
);
assert.deepEqual(
  calendar.getDay(new Date(calendar.initializedAt.getTime())),
  calendar.getDayAtIndex(0),
  "The first day should be at the zeroeth index in events"
);
assert.equal(calendar.getEvents()[0][1][1].startTime, calendar.getEvents()[0][1][0].getEndTime(), "Start time of subsequent event must equal end time of previous event");
assert.equal(calendar.getEvents()[0][0][0].startTime, hourToMs(8.5), "Start time of event starting the day is the day wide start time.");
assert.equal(calendar.getEvents()[0][1][0].startTime, hourToMs(13), "Start time of event starting the chunk after a break is the end of the break");
assert(calendar.getEvents().slice(0, 50).every(day => day.length === 3), "every day has 3 periods for this calendar");
assert(
  calendar.getEvents()[0][0].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(3.5),
  "the aggregate duration in the first period should be less than or equal to 3.5 hours"
);
assert(
  calendar.getEvents()[0][1].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(4),
  "the aggregate duration in the first period should be less than or equal to 4 hours"
);
assert(
  calendar.getEvents()[0][2].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(1),
  "the aggregate duration in the first period should be less than or equal to 1 hour"
);

const day1 = JSON.stringify(calendar.getEvents()[0]);
assert.equal(
  calendar.getEvents().find((day, i) => {
    if (i === 0) {
      return false;
    }
    return day1 === JSON.stringify(day);
  }),
  undefined,
  "events of an id and a duration should be unique"
);

assert.equal(
  breakFactory(
    "dinner",
    undefined,
    hourToMs(17),
    hourToMs(1)
  ).getEndTime(),
  hourToMs(18),
  "endtime should be 18"
);

assert.equal(
  breakFactory(
    "dinner",
    undefined,
    hourToMs(17),
    hourToMs(1)
  ).startTime,
  hourToMs(17),
  "starttime should be 17"
);
assert.equal(
  breakFactory(
    "lunch",
    undefined,
    hourToMs(12),
    hourToMs(1)
  ).getEndTime(),
  hourToMs(13),
  "endtime should be 13"
);

assert.equal(
  breakFactory(
    "lunch",
    undefined,
    hourToMs(12),
    hourToMs(1)
  ).startTime,
  hourToMs(12),
  "starttime should be 12"
);


assert.deepEqual(
  getTimeChunks(breaks.sort((a, b) => a.startTime - b.startTime), hourToMs(8.5), hourToMs(19)),
  [
    {
      duration: hourToMs(3.5),
      start: hourToMs(8.5),
    },
    {
      duration: hourToMs(4),
      start: hourToMs(13),
    },
    {
      duration: hourToMs(1),
      start: hourToMs(18),
    }
  ]
);

assert.deepEqual(
  getTimeChunks(breaks.sort((a, b) => a.startTime - b.startTime), hourToMs(12), hourToMs(19)),
  [
    {
      duration: hourToMs(4),
      start: hourToMs(13),
    },
    {
      duration: hourToMs(1),
      start: hourToMs(18),
    }
  ]
);

assert.deepEqual(
  getTimeChunks(breaks.sort((a, b) => a.startTime - b.startTime), hourToMs(12), hourToMs(18)),
  [{
    duration: hourToMs(4),
    start: hourToMs(13),
  }]
);

assert.deepEqual(
  getTimeChunks([], hourToMs(12), hourToMs(18)),
  [{
    duration: hourToMs(6),
    start: hourToMs(12),
  }]
);
