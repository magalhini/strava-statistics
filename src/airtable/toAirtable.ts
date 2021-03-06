import { authorize } from '../config'
const env = require('dotenv').config({ path: '.env' });
const strava = require('strava-v3');
const Airtable = require('airtable');
const helpers = require('../helpers/math');
import { BASES, RUN_TYPES, EFFORT_TYPES, RUN_TAGS } from '../data';
import { getConditions, getHRData } from '../helpers/strava';
const data = require('../data/');
const { defaults, heartRateData } = require('./defaults');
const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base('appbnk2iyitU1firD');

function getRunType(type: string, name: string): string[] {
  const runType = RUN_TYPES[type];
  const runTag = Object
    .keys(RUN_TAGS)
    .filter(tag => name.toLowerCase().indexOf(tag) > -1 && RUN_TAGS[tag]);

  return [runType, ...runTag];
  // return [...(isGroup ? [RUN_TYPES['group']] : []), RUN_TYPES[type]];
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
  });
}

function getRunEffort(name: string) {
  const effort = helpers.getInBrackets(name);
  return effort ? EFFORT_TYPES[effort] : null;
}

function getLocation(name: string) {
  const customLocation = helpers.getInCurly(name);
  return customLocation ? customLocation : defaults.location;
}

function getFromStrava(max:number = 2): Promise<{}> {
  console.log(`Fetching last ${max} runs from Strava into Airtable...`);
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({ page: 1, per_page: max }, (err: string, payload: Run) =>
      err ? reject(err) : resolve(payload)
    )
  });
}

function _prepareHRData(session) {
  const data = {
    rest: heartRateData.rest,
    max: heartRateData.max,
    sessionAvg: getHRData(session).avgHR,
    sessionMax: getHRData(session).maxHR,
  };

  return helpers.calculateHRReserve(data);
}

function insertNewRuns(ids: any, runs: Run[]) {
  const inserts = runs.map(run => {
    const {
      id, name, distance, total_elevation_gain,
      start_date, average_speed, workout_type, moving_time,
      has_heartrate, suffer_score, type
    }: Run = run;

    if (ids.includes(id)) {
      console.log('ID already exists, skipping...');
      return;
    } else if (type !== 'Run') {
      console.log('This is not a run, skipping...');
      return;
    }

    const workout:Workout = {
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
      'HR Reserve': has_heartrate ? _prepareHRData(run) : 0,
    };

    base(BASES.WORKOUTS).create(workout, ((err, record) => {
      if (err) return console.log(err);
      console.log(`Record saved! ${record.getId()}, ${name}`);
    }))
  });
}

Promise.all([
  getAllIds(50),
  getFromStrava(defaults.runsToFetch)
]).then(values => insertNewRuns(values[0], values[1]));
