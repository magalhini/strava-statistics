const BASES = Object.freeze({
  WORKOUTS: 'Workouts'
});

const RUN_TYPES = Object.freeze({
  0: 'Run',
  1: 'Race',
  2: 'Long Run',
  3: 'Workout',
  group: 'Group Run'
});

const EFFORT_TYPES = Object.freeze({
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
});

module.exports = {
  BASES,
  RUN_TYPES,
  EFFORT_TYPES
};
