var Units = Object.freeze({
    mps: 16.666666666667
});
var metersSecondToMinuteKm = function (ms) {
    var pace = Units.mps / ms;
    return Math.floor(pace) + ":" + pad(((pace % 1) * 60).toFixed(0));
};
var secondsToClock = function (seconds) {
    return clockTime(seconds);
};
function pad(num) {
    return ('0' + num).slice(-2);
}
function clockTime(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
}
function getInBrackets(string) {
    var matches = string.match(/\[(.*?)\]/);
    if (matches) {
        return matches[1];
    }
    return null;
}
function getInCurly(string) {
    var matches = string.match(/\{(.*?)\}/);
    if (matches) {
        return matches[1];
    }
    return null;
}
module.exports = {
    metersSecondToMinuteKm: metersSecondToMinuteKm,
    secondsToClock: secondsToClock,
    getInBrackets: getInBrackets,
    getInCurly: getInCurly
};
