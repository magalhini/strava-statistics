const authorize = require('../config').authorize;
const env = require('dotenv').config({ path: '../.env' });
const strava = require('strava-v3');
const Airtable = require('airtable');
const calc = require('../math/');
const getConditions = require('../helpers/helpers').getCondition;

const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appbnk2iyitU1firD');

const BASES = Object.freeze({
  WORKOUTS: 'Workouts'
});

const TYPES = Object.freeze({
  0: 'Run',
  1: 'Race',
  2: 'Long Run',
  3: 'Workout',
  group: 'Group Run'
});

function getRunType(type, name) {
  const isGroup = name && name.indexOf('Group') > -1;
  return [
    ...(isGroup ? [TYPES['group']] : []), TYPES[type]
  ];
}

function stravaToAirTable() {
  getFromStrava(5)
    .then(insertNewRuns)
}

function getFromStrava(max = 2) {
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({ page: 1, per_page: max }, (err, payload) =>
      err ? reject(err) : resolve(payload)
    )
  });
}

function insertNewRuns(runs) {
  const inserts = runs.map(run => {
    const { id, name, distance, total_elevation_gain,
      start_date, average_speed, workout_type, moving_time } = run;

      base(BASES.WORKOUTS).create({
        'ID': id,
        'Name': name,
        'Conditions': getConditions(name),
        'Type': getRunType(workout_type, name),
        'Distance': Number((distance / 1000).toFixed(2)),
        'Speed': calc.metersSecondToMinuteKm(average_speed),
        'Time': calc.secondsToClock(moving_time),
        'Date': start_date,
        'Elevation': total_elevation_gain
      }, ((err, record) => {
        if (err) return console.log(err);
        console.log(`Record saved! ${record.getId()}, ${name}`);
      }))
  });
}

stravaToAirTable()
console.log('Fetching runs from Strava to Airtable...');
