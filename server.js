const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { calculateAQI, calculateConcentration, getColor } = require("./aqi");
const kriging = require("./kriging");
const generatedCoords = require("./data/puntos.json");

const app = express();

app.use(cors("*"));

const port = 5000;

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

const fetchStationData = async (id) => {
  const url = `https://airnet.waqi.info/airnet/feed/hourly/${id}`;
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};

app.get("/api/station/:id", async (req, res) => {
  const { id } = req.params;

  const allData = await fetchStationData(id);

  // const { data, meta } = allData;
  // const stationData = {
  //   pm25: {
  //     mean: data.pm25.pop().mean,
  //     time: data.pm25.pop().time,
  //   },
  //   location: meta.geo,
  //   // color: colors[Math.floor(Math.random() * 4)],
  // };

  res.json(allData);
  // res.json(stationData);
});

app.get("/api/stations", async (req, res) => {
  const stationIds = ["244456", "249298", "244447", "242959"];

  const allStationsData = await Promise.all(
    stationIds.map((station) => fetchStationData(station))
  );

  const filteredStationsData = allStationsData.filter(
    (station) => station.status === "ok" && station.data
  );

  const formattedStationsData = filteredStationsData.map(
    ({ data, meta, loiq }) => {
      const aqi = calculateAQI(Number(data.pm25.pop().mean));
      const date = new Date(data.pm25.pop().time).toUTCString();

      return {
        name: loiq.display_name,
        aqi,
        pm25: {
          mean: data.pm25.pop().mean,
        },
        time: date,
        location: meta.geo,
        color: getColor(aqi),
      };
    }
  );

  ////////////////////////////////////////////////////////////////

  const aqiValues = formattedStationsData.map((station) => station.aqi);
  const latitudes = formattedStationsData.map((station) => station.location[0]);
  const longitudes = formattedStationsData.map(
    (station) => station.location[1]
  );
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

  ////////////////////////////////////////////////////////////////
  const generatedStationCoords = generatedCoords.stations;
  const generatedStationData = generatedStationCoords.map((station) => {
    const predictedAqi = Math.round(
      kriging.predict(station.lat, station.lon, variogram)
    );
    return {
      aqi: predictedAqi,
      pm25: {
        mean: calculateConcentration(predictedAqi),
      },
      location: [station.lat, station.lon],
      color: getColor(predictedAqi),
    };
  });

  res.json({
    main: formattedStationsData,
    generated: generatedStationData,
  });
});
