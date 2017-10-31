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

console.log(JSON.stringify(calendarFactory(todos, breaks, hourToMs(8.5), hourToMs(19)).slice(0, 5)));

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
    hourToMs(3.5),
    hourToMs(4),
    hourToMs(1)
  ]
);

assert.deepEqual(
  getTimeChunks(breaks.sort((a, b) => a.startTime - b.startTime), hourToMs(12), hourToMs(19)),
  [
    hourToMs(4),
    hourToMs(1)
  ]
);

assert.deepEqual(
  getTimeChunks(breaks.sort((a, b) => a.startTime - b.startTime), hourToMs(12), hourToMs(18)),
  [hourToMs(4)]
);

assert.deepEqual(
  getTimeChunks([], hourToMs(12), hourToMs(18)),
  [hourToMs(6)]
);
