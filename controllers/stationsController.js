const { calculateAQI, calculateConcentration, getColor } = require("../aqi");

const stationsIds = require("../data/stationsId.json");

const formatStationsData = (stations) => {
  const filteredStations = stations.filter(
    (station) =>
      station.id == stationsIds.stations[0].id ||
      station.id == stationsIds.stations[1].id ||
      station.id == stationsIds.stations[2].id ||
      station.id == stationsIds.stations[3].id ||
      station.id == stationsIds.stations[4].id
  );

  const filteredStationsData = filteredStations.map(({ measurements }) => {
    const stationsData = measurements[0][1];
    return stationsData;
  });

  const formattedStationsData = filteredStationsData.map(({ measurementDeterminedBy, measurementValue }) => {
    const pm25Value = measurementValue;
    const stationsId = measurementDeterminedBy;
    return {
      "pm2.5": pm25Value,
      "aqi": Number(calculateAQI(pm25Value).toFixed(0)),
      "station": stationsId 

    };
  });
  console.log(formattedStationsData);
  return formattedStationsData;
};

module.exports = { formatStationsData };
