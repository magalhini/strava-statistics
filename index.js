const env = require('dotenv').config();
const strava = require('strava-v3');
const DateDiff = require('date-diff');
const fetch = require('node-fetch');
const createThrottle = require('async-throttle');
const getCountryFromCoords = require('./matchCountry').getCountryFromCoords;
const countryFlags = require('./matchCountry').table;
const config = require('./config');
const isEmoji = require('./helpers/helpers').isEmoji;

fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  body: JSON.stringify(config),
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(json => { process.env.STRAVA_ACCESS_TOKEN = json.access_token })
  // .then(res => addFlagToLastActivity())
  .then(res => listAllActivities())

function addFlagToLastActivity() {
  strava.athlete.listActivities({}, (err, payload) => {
    const latestActivity = payload[0];
    const { name } = latestActivity;

    listCountry(latestActivity)
      .then(flag => {
        if (name.codePointAt(0) !== flag.codePointAt(0) && isEmoji(flag)) {
          const updatedName = `${flag} ${name}`;
          updateTitle(latestActivity, updatedName);
        } else { console.log('Activity already has a flag.') }
      });
  })
}

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

      getTopSufferScore(payload);

      const days = Math.round(diff.days());
      console.log(`Total elevation in the last ${days} days: ${Math.round(totalElevation)} meters`);
    } else {
      console.log(err);
    }
  });
}

const listCountry = (activity) => {
  const coords =  activity.start_latlng;
  const { id, name } = activity;

  if (activity.start_latlng) {
    return getCountryFromCoords(coords)
      .then(res => countryFlags[res.countryCode])
      .then(flag => { console.log(flag, id, name); return flag })
  }
}

const updateTitle = (activity, newTitle) => {
  if (!activity || !newTitle) return null;

  strava.activities.update({
    id: activity.id,
    name: newTitle
  }, (done, err) => console.log(`Activity ${activity.id} title updated.`))
}
