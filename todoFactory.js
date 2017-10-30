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
