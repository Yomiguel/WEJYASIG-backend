const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { userSchema } = require("./db/schema");
const generatedCoords = require("./data/puntos.json");
require("dotenv").config();

const { formatStationsData } = require("./controllers/stationsController");

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

const fetchStationData = async (lat, lon) => {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=86ff4517b525c7fb1aedd26ebd17d04d`;
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/view/signup.html");
});

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
