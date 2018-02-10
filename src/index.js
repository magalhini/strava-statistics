const env = require('dotenv').config();
const strava = require('strava-v3');
const DateDiff = require('date-diff');
const fetch = require('node-fetch');
const config = require('./config');

fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  body: JSON.stringify(config),
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(json => { process.env.STRAVA_ACCESS_TOKEN = json.access_token })
  .then(res => listAllActivities(5))

function getTopSufferScore(activities) {
  activities.forEach(item => item.has_heartrate && console.log(`Maximum HR: ${item.max_heartrate} @ SC: ${item.suffer_score}`))
}

function getTotalElevation(activities) {
  return activities.reduce((acc, act) => acc + act.total_elevation_gain, 0);
}

function listAllActivities(max = 50) {
  strava.athlete.listActivities({ per_page: max }, (err, payload, limits) => {
    if (!err) {
      const totalElevation = getTotalElevation(payload);

      const diff = new DateDiff(
        new Date(payload[0].start_date),
        new Date(payload[payload.length - 1].start_date)
      );

      const days = Math.round(diff.days());
      console.log(`Total elevation in the last ${days} days: ${Math.round(totalElevation)} meters`);
    } else {
      console.log(err);
    }
  });
}
