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

const allDays = calendarFactory(todos, breaks, hourToMs(8.5), hourToMs(19));

console.log(JSON.stringify(allDays.slice(0,10)));

assert(allDays.slice(0, 50).every(day => day.length === 3), "every day has 3 periods for this calendar");
assert(
  allDays[0][0].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(3.5),
  "the aggregate duration in the first period should be less than or equal to 3.5 hours"
);
assert(
  allDays[0][1].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(4),
  "the aggregate duration in the first period should be less than or equal to 4 hours"
);
assert(
  allDays[0][2].reduce((totalD, todo) => totalD+todo.duration, 0) <= hourToMs(1),
  "the aggregate duration in the first period should be less than or equal to 1 hour"
);

const day1 = JSON.stringify(allDays[0]);
assert.equal(
  allDays.find((day, i) => {
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
