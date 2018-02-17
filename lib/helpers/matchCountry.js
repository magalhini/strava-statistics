"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
var URI = function (lat, lng) { return "http://api.geonames.org/countryCodeJSON?lat=" + lat + "&lng=" + lng + "&username=magalhini"; };
var getCountryFromCoords = function (coords) {
    if (!coords)
        return;
    var lat = coords[0], lng = coords[1];
    return node_fetch_1["default"](URI(lat, lng))
        .then(function (d) { return d.json(); })["catch"](function (err) { return console.log(err); });
};
var table = {
    CA: '🇨🇦',
    PT: '🇵🇹',
    DE: '🇩🇪',
    PL: '🇵🇱'
};
module.exports = { getCountryFromCoords: getCountryFromCoords, table: table };
