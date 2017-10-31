/**
 * @class
 * @name Todo
 * @param {string} name - a name for the todo
 * @param {number} duration - duration of todo in ms
 * @param {number} minDuration - min duration of todo in ms
 * @param {number} maxDuration - max duration of todo in ms
 * @param {number[]} location - lat long for a todo location
 */

class Todo {
  constructor(
    name,
    duration,
    minDuration,
    maxDuration,
    location
  ) {
    this.name = name;
    this.duration = duration;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
    this.location = location;
    this.id = Math.random();
  }
}


function todoFactory(
    name,
    duration,
    minDuration,
    maxDuration,
    location
) {
  if (!duration && !minDuration && !maxDuration) {
    console.error("Include a duration, min, or max, when defining a todo");
  }

  return new Todo(
    name,
    duration,
    minDuration,
    maxDuration,
    location
  );
}

module.exports = todoFactory;
