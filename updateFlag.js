const authorize = require('./config').authorize;
const env = require('dotenv').config();
const updateTitle = require('./helpers/helpers').updateTitle;
const isEmoji = require('./helpers/helpers').isEmoji;
const PromiseThrottle = require('promise-throttle');
const getCountryFromCoords = require('./matchCountry').getCountryFromCoords;
const countryFlags = require('./matchCountry').table;
const strava = require('strava-v3');

let promiseThrottle = new PromiseThrottle({
  requestsPerSecond: 1,           // up to 1 request per second
  promiseImplementation: Promise  // the Promise library you are using
});

authorize().then(() => {
  getActivities(200)
    .then(data => {
      for (let i = data.length - 1; i >= 0; i--) {
        promiseThrottle.add(listCountry.bind(this, data[i]))
          .then(flag => checkForUpdateTitle(flag, data[i]))
          .catch(err => console.log(err))
      }
  });
});

function checkForUpdateTitle(flag, activity) {
  const { name } = activity;

  if (flag && (name.codePointAt(0) !== flag.codePointAt(0) && isEmoji(flag))) {
    const updatedName = `${flag} ${name}`;
    updateTitle(activity, updatedName);
  } else { console.log('Activity already has a flag.') }
}

function getActivities(max = 50) {
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({ per_page: max }, (err, payload) =>
      err ? reject(err) : resolve(payload)
    )
  });
}

const listCountry = (activity) => {
  const coords =  activity.start_latlng;
  const { id, name } = activity;

  if (activity.start_latlng) {
    return getCountryFromCoords(coords)
      .then(res => countryFlags[res.countryCode])
  } else {
    return new Promise((res, rej) => rej('There is no GPS data for this route'))
  }
}
