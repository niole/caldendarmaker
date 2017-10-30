const {
  getTimeChunks,
} = require('./util.js');
const todoFactory = require('./todoFactory.js');

function calendarFactory(todos, breaks, startTime, endTime) {
  const sortedBreaks = breaks.sort((a, b) => a.startTime - b.startTime);
  const timeChunks = getTimeChunks(breaks, startTime, endTime);

  fitTodos.apply(null, arguments);

  return todos;
}

function fitTodos(todos, breaks, startTime, endTime) {
  // assumes all todos
  let nextBreak = 0;
}

module.exports = calendarFactory;
