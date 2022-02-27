const calculateAQI = (concentration) => {
  console.log(">>");
  const aqiRange = [0, 50, 100, 150, 200, 300, 400, 500];
  const concentrationRange = [0, 15.4, 40.4, 65.4, 150.4, 250.4, 350.4, 500.4];

  for (let element in concentrationRange) {
    const maxAQI = aqiRange[Number(element) + 1];
    const minAQI = aqiRange[Number(element)];
    const maxConcentration = concentrationRange[Number(element) + 1];
    const minConcentration = concentrationRange[Number(element)];

    if (minConcentration < concentration && concentration <= maxConcentration) {
      return Math.round(
        ((maxAQI - minAQI) / (maxConcentration - minConcentration)) *
          (concentration - minConcentration) +
          minAQI
      );
    }
  }
};

module.exports = { calculateAQI };
