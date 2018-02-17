import fetch from 'node-fetch';

const URI = (lat, lng) => `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=magalhini`;

const getCountryFromCoords = (coords) => {
  if (!coords) return;

  const [lat, lng] = coords;

  return fetch(URI(lat, lng))
    .then(d => d.json())
    .catch(err => console.log(err));
}

const table = {
  CA: '🇨🇦',
  PT: '🇵🇹',
  DE: '🇩🇪',
  PL: '🇵🇱',
};

module.exports = { getCountryFromCoords, table }