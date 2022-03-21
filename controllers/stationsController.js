const { calculateAQI, calculateConcentration, getColor } = require("../aqi");

const stationsIds = require("../data/stationsId.json");

const formatStationsData = (stations) => {
  const filteredStationsData = stations.filter(
    (station) =>
      station.id == stationsIds.stations[0].id ||
      station.id == stationsIds.stations[1].id ||
      station.id == stationsIds.stations[2].id ||
      station.id == stationsIds.stations[3].id ||
      station.id == stationsIds.stations[4].id
  );

  const formattedStationsData = filteredStationsData.map(({ measurements }) => {
    const pm25 = measurements
    console.log(pm25);
     return pm25;
  });

  return formattedStationsData;
};

module.exports = { formatStationsData };
