"use strict";
exports.__esModule = true;
var strava = require('strava-v3');
var isEmoji = function (char) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return regex.test(char);
};
exports.isEmoji = isEmoji;
var EMOJI_CONDITIONS = {
    10052: 'Snow',
    127783: 'Rain',
    9731: 'Snowing'
};
var getHRData = function (_a) {
    var _b = _a.max_heartrate, max_heartrate = _b === void 0 ? 0 : _b, _c = _a.average_heartrate, average_heartrate = _c === void 0 ? 0 : _c;
    return {
        maxHR: max_heartrate,
        avgHR: average_heartrate
    };
};
exports.getHRData = getHRData;
var getConditions = function (name, description) {
    if (description === void 0) { description = ''; }
    var splitName = name.split(' ');
    var splitDescription = description.split(' ');
    var all = splitName.concat(splitDescription);
    return all.reduce(function (acc, string) {
        var charPoint = string.codePointAt(0);
        if (EMOJI_CONDITIONS[charPoint]) {
            acc.push(EMOJI_CONDITIONS[charPoint]);
        }
        if (EMOJI_CONDITIONS[string]) {
            acc.push(EMOJI_CONDITIONS[string]);
        }
        return acc;
    }, []);
};
exports.getConditions = getConditions;
var updateTitle = function (activity, newTitle) {
    if (!activity || !newTitle)
        return null;
    strava.activities.update({
        id: activity.id,
        name: newTitle
    }, function (done, err) { return console.log("Activity " + activity.id + "'s title updated with " + newTitle); });
};
exports.updateTitle = updateTitle;
