const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const pgp = require("pg-promise")();
const db = pgp(
  `postgres://${process.env.USER}:${process.env.PASSWORD}:5432/${process.env.DB}`
);
require("dotenv").config();

const { formatStationsData } = require("./controllers/stationsController");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 5000;

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

const fetchStationData = async () => {
  const url = "http://api.canair.io:8080/dwc/stations";
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/view/signup.html");
});

app.get("/api/stations", async (req, res) => {
  const allStationsData = await fetchStationData();

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
