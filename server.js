const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { userSchema } = require("./db/schema");
const generatedCoords = require("./data/puntos.json");
require("dotenv").config();

const {
  trainKrigingModel,
  formatStationsData,
  getPredictedStations,
} = require("./controllers/stationsController");

const mongoDB = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoDB.model("user", userSchema);

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 5000;

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

//legacy
/*const fetchStationData = async (id) => {
  const url = `https://airnet.waqi.info/airnet/feed/hourly/${id}`;
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};*/

const fetchStationData = async (lat, lon) => {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=86ff4517b525c7fb1aedd26ebd17d04d`;
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/view/signup.html");
});

//legacy
/*app.get("/api/station/:id", async (req, res) => {
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
});*/

app.get("/api/stations", async (req, res) => {
  const generatedStationCoords = generatedCoords.stations;

  const allStationsData = await Promise.all(
    generatedStationCoords.map((station) =>
      fetchStationData(station.lat, station.lon)
    )
  );

  const formattedStationsData = formatStationsData(allStationsData);

  res.json({
    main: formattedStationsData,
  });
});

//legacy
/*app.get("/api/stations", async (req, res) => {
  const generatedStationCoords = generatedCoords.stations;

  const allStationsData = await Promise.all(
    generatedStationCoords.map((station) => fetchStationData(station.lat, station.lon))
  );


  const formattedStationsData = formatStationsData(allStationsData);
  const variogram = trainKrigingModel(formattedStationsData);
  const generatedStations = getPredictedStations(variogram);

  res.json({
    main: formattedStationsData,
    generated: generatedStations,
  });
});*/

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    User.create({
      username,
      password,
    });
    res.redirect("http://127.0.0.1:5000/geovisor.html");
  } catch (error) {
    console.log(error);
  }
});
