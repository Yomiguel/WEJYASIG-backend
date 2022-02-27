const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const {
  trainKrigingModel,
  formatStationsData,
  getPredictedStations,
} = require("./controllers/stationsController");

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

  res.json(allData);
});

app.get("/api/stations", async (req, res) => {
  const stationIds = ["244456", "249298", "244447", "242959"];

  const allStationsData = await Promise.all(
    stationIds.map((station) => fetchStationData(station))
  );

  const formattedStationsData = formatStationsData(allStationsData);
  const variogram = trainKrigingModel(formattedStationsData);
  const generatedStations = getPredictedStations(variogram);

  res.json({
    main: formattedStationsData,
    generated: generatedStations,
  });
});
