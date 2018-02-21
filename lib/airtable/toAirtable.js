"use strict";
exports.__esModule = true;
var env = require('dotenv').config({ path: '.env' });
var strava = require('strava-v3');
var Airtable = require('airtable');
var helpers = require('../helpers/math');
var data_1 = require("../data");
var strava_1 = require("../helpers/strava");
var data = require('../data/');
var defaults = require('./defaults');
var base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base('appbnk2iyitU1firD');
function getRunType(type, name) {
    var runType = data_1.RUN_TYPES[type];
    var runTag = Object
        .keys(data_1.RUN_TAGS)
        .filter(function (tag) { return name.toLowerCase().indexOf(tag) > -1 && data_1.RUN_TAGS[tag]; });
    return [runType].concat(runTag);
    // return [...(isGroup ? [RUN_TYPES['group']] : []), RUN_TYPES[type]];
}
var getAllIds = function (n) {
    if (n === void 0) { n = 1; }
    return new Promise(function (resolve, reject) {
        base(data_1.BASES.WORKOUTS).select({
            maxRecords: n
        }).eachPage(function (records, next) {
            var ids = records.map(function (record) { return record.get('ID'); });
            resolve(ids);
        }, function (err) {
            if (err)
                reject(err);
        });
    });
};
function getRunEffort(name) {
    var effort = helpers.getInBrackets(name);
    return effort ? data_1.EFFORT_TYPES[effort] : null;
}
function getLocation(name) {
    var customLocation = helpers.getInCurly(name);
    return customLocation ? customLocation : defaults.location;
}
function getFromStrava(max) {
    if (max === void 0) { max = 2; }
    console.log("Fetching last " + max + " runs from Strava into Airtable...");
    return new Promise(function (resolve, reject) {
        strava.athlete.listActivities({ page: 1, per_page: max }, function (err, payload) {
            return err ? reject(err) : resolve(payload);
        });
    });
}
function insertNewRuns(ids, runs) {
    var inserts = runs.map(function (run) {
        var id = run.id, name = run.name, distance = run.distance, total_elevation_gain = run.total_elevation_gain, start_date = run.start_date, average_speed = run.average_speed, workout_type = run.workout_type, moving_time = run.moving_time, has_heartrate = run.has_heartrate, suffer_score = run.suffer_score;
        if (ids.includes(id)) {
            console.log('ID already exists, skipping...');
            return;
        }
        var workout = {
            'ID': id,
            'Name': name,
            'Conditions': strava_1.getConditions(name),
            'Type': getRunType(workout_type, name),
            'Distance': Number((distance / 1000).toFixed(2)),
            'Speed': helpers.metersSecondToMinuteKm(average_speed),
            'Time': helpers.secondsToClock(moving_time),
            'Effort': getRunEffort(name),
            'Where': getLocation(name),
            'Date': start_date,
            'Elevation': total_elevation_gain,
            'Average HR': strava_1.getHRData(run).avgHR,
            'Max HR': strava_1.getHRData(run).maxHR,
            'Suffer Score': suffer_score || 0
        };
        base(data_1.BASES.WORKOUTS).create(workout, (function (err, record) {
            if (err)
                return console.log(err);
            console.log("Record saved! " + record.getId() + ", " + name);
        }));
    });
}
Promise.all([
    getAllIds(50),
    getFromStrava(defaults.runsToFetch)
]).then(function (values) { return insertNewRuns(values[0], values[1]); });
