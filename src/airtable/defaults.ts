const defaults = Object.freeze({
  location: 'Montreal',
  runsToFetch: process.argv[2] || 2
});

const heartRateData: HeartRate = {
  rest: 59,
  max: 189,
}

module.exports = {
  defaults,
  heartRateData
};
