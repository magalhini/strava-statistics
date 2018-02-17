const Units = Object.freeze({
  mps: 16.666666666667
});

const metersSecondToMinuteKm = (ms) => {
  const pace = Units.mps / ms;
  return `${Math.floor(pace)}:${pad(((pace % 1) * 60).toFixed(0))}`;
};

const secondsToClock = (seconds) => {
  return clockTime(seconds);
};

function pad(num) {
  return ('0' + num).slice(-2);
}

function clockTime(secs) {
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  let hours = Math.floor(minutes/60)
  minutes = minutes % 60;
  return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
}

function getInBrackets(string) {
  const matches = string.match(/\[(.*?)\]/);

  if (matches) {
    return matches[1];
  }

  return null;
}

function getInCurly(string) {
  const matches = string.match(/\{(.*?)\}/);

  if (matches) {
    return matches[1];
  }

  return null;
}

module.exports = {
  metersSecondToMinuteKm,
  secondsToClock,
  getInBrackets,
  getInCurly,
};
