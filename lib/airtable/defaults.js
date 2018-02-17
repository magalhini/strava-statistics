var defaults = Object.freeze({
    location: 'Montreal',
    runsToFetch: process.argv[2] || 2
});
module.exports = defaults;
