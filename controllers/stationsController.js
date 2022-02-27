const kriging = require("../kriging");
const { calculateAQI, calculateConcentration, getColor } = require("../aqi");

const generatedCoords = require("../data/puntos.json");

const trainKrigingModel = (stations) => {
  const aqiValues = stations.map((station) => station.aqi);
  const latitudes = stations.map((station) => station.location[0]);
  const longitudes = stations.map((station) => station.location[1]);
  const model = "spherical";
  const sigma2 = 0;
  const alpha = 25;
  const variogram = kriging.train(
    aqiValues,
    latitudes,
    longitudes,
    model,
    sigma2,
    alpha
  );

  return variogram;
};

const formatStationsData = (stations) => {
  const filteredStationsData = stations.filter(
    (station) => station.status === "ok" && station.data
  );

  const formattedStationsData = filteredStationsData.map(
    ({ data, meta, loiq }) => {
      const pm25 = data.pm25.pop();
      const aqi = calculateAQI(Number(pm25.mean));
      const date = new Date(pm25.time).toUTCString();

      return {
        name: loiq.display_name,
        aqi,
        pm25: {
          mean: pm25.mean,
        },
        time: date,
        location: meta.geo,
        color: getColor(aqi),
      };
    }
  );

  return formattedStationsData;
};

const getPredictedStations = (variogram) => {
  const generatedStationCoords = generatedCoords.stations;
  const generatedStationData = generatedStationCoords.map((stationCoords) => {
    const predictedAqi = kriging.predict(
      stationCoords.lat,
      stationCoords.lon,
      variogram
    );
    return {
      aqi: predictedAqi,
      pm25: {
        mean: Number(calculateConcentration(predictedAqi)),
      },
      location: [stationCoords.lat, stationCoords.lon],
      color: getColor(predictedAqi),
    };
  });

  return generatedStationData;
};

module.exports = { trainKrigingModel, formatStationsData, getPredictedStations };
