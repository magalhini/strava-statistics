type RunTypes = {
  0: string,
  1: string,
  2: string,
  3: string,
  group: string,
};

type EffortTypes = {
  easy: string,
  medium: string,
  hard: string,
  extreme: string,
};

type EmojiConditions = {
  10052: string,
  127783: string,
  9731: string,
};

interface Workout {
  'ID': number,
  'Name': string,
  'Conditions': string | Array<string>,
  'Type': string | Array<string>,
  'Distance': number,
  'Speed': string,
  'Time': string,
  'Effort': string,
  'Where': string,
  'Date': Date,
  'Elevation': number,
  'Average HR': number,
  'Max HR': number,
  'Suffer Score': number
}

type Run = {
  id: number,
  name: string,
  distance: number,
  total_elevation_gain: number,
  start_date: Date,
  average_speed: number,
  workout_type: RunTypes,
  moving_time: number,
  max_heartrate: number,
  average_heartrate: number,
  has_heartrate: boolean,
  suffer_score: number,
}