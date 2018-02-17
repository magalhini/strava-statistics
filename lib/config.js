"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var config = {
    code: process.env.STRAVA_CODE,
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET
};
function authorize() {
    return node_fetch_1["default"]('https://www.strava.com/oauth/token', {
        method: 'POST',
        body: JSON.stringify(config),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { process.env.STRAVA_ACCESS_TOKEN = json.access_token; });
}
exports.authorize = authorize;
