const {
  getTimeChunks,
} = require('./util.js');
const todoFactory = require('./todoFactory.js');
const { Event } = require('./eventFactory.js');

const _15Min = 15*60*1000;
const MS_DAY = 24*60*60*1000;

function getPrivateIndex(totalEvents) {
  return Math.floor(Math.random()*totalEvents);
}

function shuffle(es) {
  let nextToPlace = 0;
  const shuffled = Array(es.length);

  while(nextToPlace < es.length) {
    let nextIndex = Math.floor(Math.random()*es.length);
    if (shuffled[nextIndex] !== undefined) {
      shuffled[nextIndex] = es[nextToPlace];
      nextToPlace += 1;
    }
  }

  return shuffled;
}

function getFlooredDate(date) {
  return new Date((date.getMonth()+1) + " " + date.getDate() + " " + date.getFullYear());
}

class Calendar {
  constructor(events) {
    this.events = events;
    this.initializedAt = null;
    this.setInitializedDate();
  }

  getEvents() {
    return this.events;
  }

  setInitializedDate() {
    this.initializedAt = getFlooredDate(new Date());
  }

  getDay(date) {
    const flooredDate = date ? getFlooredDate(date) : getFlooredDate(new Date());
    const diffInMs = flooredDate.getTime() - this.initializedAt.getTime();
    const diffInDays = Math.floor(diffInMs/MS_DAY);

    if (diffInDays >= this.events.length) {
      // must start over
      this.setInitializedDate();
      return this.getDay();
    }
    return this.getDayAtIndex(diffInDays);
  }

  getDayAtIndex(i) {
    return this.events[i];
  }

}

function calendarFactory(todos, breaks, startTime, endTime) {
  const sortedBreaks = breaks.sort((a, b) => a.startTime - b.startTime);
  const timeChunks = getTimeChunks(breaks, startTime, endTime);
  const allTodoCombinations = fitTodos(todos, timeChunks);
  return new Calendar(allTodoCombinations);
}

/**
 * Finds all combinations of todos for all chunks of time found between breaks
 * permutations per chunk of time between breaks are not included
 *
 * @param {Todo[]} todos - what the user has defined as wanting to put in schedule
 * @param {number[]} timeChunks - available chunks of time between user provided breaks
 * @param {Event[]} state - events, which are the todos and their durations grouped by time chunk
 * @param {number} nextTimeChunk - the index of the next time chunk to create events for
 * @return {Event[][]} - events grouped by day and secondly the time chunk in which they fit
 * TODO create Calendar data type
 */
function fitTodos(todos, timeChunks, state = [], nextTimeChunk = 0) {
  if (nextTimeChunk === timeChunks.length) {
     if (todos.length === 0) {
        return [state];
     }
     return [];
  }

  const chunk = timeChunks[nextTimeChunk];
  const nextStates = fillTimeChunk(chunk.duration, chunk.start, todos);

  let toReturn = [];

  nextStates.forEach(chosenForTimeChunk => {
    const nextState = state.concat([chosenForTimeChunk]);
    const remainder = todos.filter(({ id }) => !chosenForTimeChunk.find(c => c.todoId === id));

    toReturn = toReturn.concat(fitTodos(remainder, timeChunks, nextState, nextTimeChunk + 1));
  });

  return toReturn;
}

/**
 * Gets combinations of events for a timechunk
 *
 * @param {number} chunkLeft - chunk of time left to fill with events
 * @param {number} startTimeOfChunk - start of chunk of time left to fill with events
 * @param {Todo[]} todos - todos to choose from
 * @param {Event[]} chosen - chose events for this time chunk
 * @param {number} i - index of todo to place next
 * @return {Event[]} - events chosen for this timechunk
 */
function fillTimeChunk(chunkLeft, startTimeOfChunk, todos, chosen = [], i = 0) {
  if (i === todos.length || chunkLeft === 0) {
    return [chosen];
  }

  const durations =
    todos[i].duration ?
    [todos[i].duration] :
    getDurations(todos[i]);

  return durations.reduce((states, d) => {
    if (chunkLeft - d > -1) {
      const event = new Event(
        todos[i].name,
        todos[i].location,
        chosen.length ? chosen[chosen.length - 1].getEndTime() : startTimeOfChunk,
        d,
        todos[i].id
      );

      return states.concat(fillTimeChunk(
          chunkLeft - d,
          startTimeOfChunk,
          todos,
          chosen.concat([event]),
          i+1
        ).concat(
        fillTimeChunk(chunkLeft, startTimeOfChunk, todos, chosen, i+1)
      ));
    }
    return states;
  }, []);

  return fillTimeChunk(chunkLeft, startTimeOfChunk, todos, chosen, i+1);
}

/**
 * Gets the all possible durations for a todo with inspecific duration
 */
function getDurations(todo) {
  const total = (todo.maxDuration - todo.minDuration)/_15Min;
  const durations = [];

  for (let i=0; i<total+1; i++) {
    durations.push(todo.minDuration + _15Min*i);
  }

  return durations;
}

module.exports = calendarFactory;
