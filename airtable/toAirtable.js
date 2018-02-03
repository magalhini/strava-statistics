const authorize = require('../config').authorize;
const env = require('dotenv').config({ path: '../.env' });
const strava = require('strava-v3');
const Airtable = require('airtable');
const calc = require('../math/');

const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appbnk2iyitU1firD');

const BASES = Object.freeze({
  WORKOUTS: 'Workouts'
});

function stravaToAirTable() {
  getFromStrava(1)
    .then(insertNewRuns)
}

function getFromStrava(max = 2) {
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({ page: 3, per_page: max }, (err, payload) =>
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
        'Distance': parseInt((distance / 1000).toFixed(2), 10),
        'Speed': calc.metersSecondToMinuteKm(average_speed),
        'Time': calc.secondsToClock(moving_time),
        'Date': start_date,
        'Elevation': total_elevation_gain
      }, ((err, record) => {
        if (err) return console.log(err);
        console.log(`Record saved! ${record.getId()}`)
      }))
  });
}

stravaToAirTable()
