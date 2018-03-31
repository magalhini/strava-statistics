const BASES = Object.freeze({
  WORKOUTS: 'Workouts'
});

const RUN_TYPES: RunTypes = Object.freeze({
  0: 'Run',
  1: 'Race',
  2: 'Long Run',
  3: 'Workout',
});

const RUN_TAGS: RunTags = Object.freeze({
  Group: 'Group Run',
  exercises: 'Exercises',
});

const EFFORT_TYPES: EffortTypes = Object.freeze({
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
});

export { BASES, RUN_TYPES, EFFORT_TYPES, RUN_TAGS };
