const {
  getTimeChunks,
} = require('./util.js');
const todoFactory = require('./todoFactory.js');

const _15Min = 15*60*1000;

function calendarFactory(todos, breaks, startTime, endTime) {
  const sortedBreaks = breaks.sort((a, b) => a.startTime - b.startTime);
  const timeChunks = getTimeChunks(breaks, startTime, endTime);

  return fitTodos(todos, timeChunks);
}

function fitTodos(todos, timeChunks, state = [], nextTimeChunk = 0) {
  if (nextTimeChunk === timeChunks.length && todos.length === 0) {
    return [[state]];
  }

  const timeLeft = timeChunks[nextTimeChunk];
  const nextStates = fillTimeChunk(timeLeft, todos);

  let toReturn = [];

  nextStates.forEach(chosen => {
    const nextState = state.concat(chosen);
    const remainder = todos.filter(({ id }) => !chosen.find(c => c.todo.id === id));

    toReturn = toReturn.concat(fitTodos(remainder, timeChunks, nextState, nextTimeChunk + 1));
  });

  return toReturn;
}

function fillTimeChunk(chunkLeft, todos, chosen = [], i = 0) {
  if (i  === todos.length || chunkLeft === 0) {
    return [chosen];
  }

  const durations =
    todos[i].duration ?
    [todos[i].duration] :
    getDurations(todos[i]);

  return durations.reduce((states, d) => {
    if (chunkLeft - d > -1) {
      return states.concat(fillTimeChunk(
          chunkLeft - d,
          todos,
          chosen.concat([{
            duration: d,
            todo: todos[i],
          }]),
        i+1).concat(
        fillTimeChunk(chunkLeft, todos, chosen, i+1)
      ));
    }
    return states;
  }, []);

  return fillTimeChunk(chunkLeft, todos, chosen, i+1);
}

function getDurations(todo) {
  const total = (todo.maxDuration - todo.minDuration)/_15Min;
  const durations = [];

  for (let i=0; i<total+1; i++) {
    durations.push(todo.minDuration + _15Min*i);
  }

  return durations;
}

module.exports = calendarFactory;
