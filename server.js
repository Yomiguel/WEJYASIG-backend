const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { queryDb, updateDb } = require("./data_base/managment_data_base");
const router = express.Router;


require("dotenv").config();

const { formatStationsData } = require("./controllers/stationsController");
const { Column } = require("pg-promise");

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
  const sendData2Db = formattedStationsData.map(data => {
    updateDb("estaciones", "pm25", data["pm2.5"], "cod", data.station);
    updateDb("estaciones", "aqi", data.aqi, "cod", data.station);
  });
  res.json({
    main: formattedStationsData,
  });
});


//updateDb("estaciones", "aqi", 15, "cod", `D29TTGOT7A0DDA`);
//queryDb("pm25", "estaciones", "cod", `'D29TTGOT7D4D7A'`);