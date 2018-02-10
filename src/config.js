const fetch = require('node-fetch');
const env = require('dotenv').config();
const config = {
  code: process.env.STRAVA_CODE,
  client_id: process.env.STRAVA_CLIENT_ID,
  client_secret: process.env.STRAVA_CLIENT_SECRET,
};

function authorize() {
  return fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify(config),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(json => { process.env.STRAVA_ACCESS_TOKEN = json.access_token })
}

module.exports = {
  authorize
};
