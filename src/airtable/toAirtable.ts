const authorize = require('../config').authorize;
const env = require('dotenv').config({ path: '../.env' });
const strava = require('strava-v3');
const Airtable = require('airtable');
const helpers = require('../helpers/math');
const stravaHelpers = require('../helpers/strava');
const data = require('../data/');
const defaults = require('./defaults');

const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base('appbnk2iyitU1firD');
const { getConditions, getHRData } = stravaHelpers;
const { BASES, RUN_TYPES, EFFORT_TYPES } = data;

function getRunType(type, name: string) {
  const isGroup = name && name.indexOf('Group') > -1;
  return [
    ...(isGroup ? [RUN_TYPES['group']] : []), RUN_TYPES[type]
  ];
}

const getAllIds = (n: number = 1): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    base(BASES.WORKOUTS).select({
      maxRecords: n
    }).eachPage((records, next) => {
      const ids = records.map(record => record.get('ID'));
      resolve(ids);
    }, (err) => {
      if (err) reject(err);
    });
  })
}

function getRunEffort(name: string) {
  const effort = helpers.getInBrackets(name);
  return effort ? EFFORT_TYPES[effort] : null;
}

function getLocation(name: string) {
  const customLocation = helpers.getInCurly(name);
  return customLocation ? customLocation : defaults.location;
}

function stravaToAirTable(howMany = 1) {
  console.log(`Fetching last ${howMany} runs from Strava into Airtable...`);
  getFromStrava(howMany)
    .then(insertNewRuns);
}

function getFromStrava(max:number = 2): Promise<Array> {
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({ page: 1, per_page: max }, (err, payload) =>
      err ? reject(err) : resolve(payload)
    )
  });
}

function insertNewRuns(ids:Array<number>, runs) {
  const inserts = runs.map(run => {
    const {
      id, name, distance, total_elevation_gain,
      start_date, average_speed, workout_type, moving_time,
      has_heartrate, suffer_score
    } = run;

    if (ids.includes(id)) console.log('ID already exists')

    return

    base(BASES.WORKOUTS).create({
      'ID': id,
      'Name': name,
      'Conditions': getConditions(name),
      'Type': getRunType(workout_type, name),
      'Distance': Number((distance / 1000).toFixed(2)),
      'Speed': helpers.metersSecondToMinuteKm(average_speed),
      'Time': helpers.secondsToClock(moving_time),
      'Effort': getRunEffort(name),
      'Where': getLocation(name),
      'Date': start_date,
      'Elevation': total_elevation_gain,
      'Average HR': getHRData(run).avgHR,
      'Max HR': getHRData(run).maxHR,
      'Suffer Score': suffer_score || 0,
    }, ((err, record) => {
      if (err) return console.log(err);
      console.log(`Record saved! ${record.getId()}, ${name}`);
    }))
  });
}

// stravaToAirTable(30);
Promise.all([
  getAllIds(30),
  getFromStrava(30)
]).then(values => insertNewRuns(values[0], values[1]));
