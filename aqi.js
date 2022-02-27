const colors = ["green", "yellow", "orange", "red", "darkviolet", "darkred"];
const aqiRange = [0, 50, 100, 150, 200, 300, 400, 500];
const concentrationRange = [0, 12, 37, 55, 150, 250, 350, 500];

const calculateAQI = (concentration) => {
  for (let element in concentrationRange) {
    const index = Number(element);
    const maxAQI = aqiRange[index + 1];
    const minAQI = aqiRange[index];
    const maxConcentration = concentrationRange[index + 1];
    const minConcentration = concentrationRange[index];

    if (minConcentration < concentration && concentration <= maxConcentration) {
      return Math.round(
        ((maxAQI - minAQI) / (maxConcentration - minConcentration)) *
          (concentration - minConcentration) +
          minAQI
      );
    }
  }
};

const calculateConcentration = (AQI) => {
  for (let element in concentrationRange) {
    const index = Number(element);
    const maxAQI = aqiRange[index + 1];
    const minAQI = aqiRange[index];
    const maxConcentration = concentrationRange[index + 1];
    const minConcentration = concentrationRange[index];

    if (minAQI < AQI && AQI <= maxAQI) {
      return (
        ((AQI - maxAQI) * (maxConcentration - minConcentration)) /
          (maxAQI - minAQI) +
        minConcentration
      ).toFixed(1);
    }
  }
};

const getColor = (aqi) => {
  if (0 < aqi && aqi < 50) {
    return colors[0];
  }
  if (50 <= aqi && aqi < 100) {
    return colors[1];
  }
  if (100 <= aqi && aqi < 150) {
    return colors[2];
  }
  if (150 <= aqi && aqi < 200) {
    return colors[3];
  }
  if (200 <= aqi && aqi < 300) {
    return colors[4];
  }
  return colors[5];
};

module.exports = { calculateAQI, getColor };
