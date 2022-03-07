const { calculateAQI, calculateConcentration, getColor } = require("../aqi");

const generatedCoords = require("../data/puntos.json");

const formatStationsData = (stations) => {
  const formattedStationsData = stations.map(({ coord, list }) => {
    const pm25 = list[0].components.pm2_5;
    const aqi = calculateAQI(Number(pm25));

    return {
      data: {
        pm25: pm25,
        aqi: aqi
      },
      location: coord,
      color: getColor(aqi)
    };
  });

  return formattedStationsData;
};

module.exports = { formatStationsData };
