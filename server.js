const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { queryDb, updateDb } = require("./data_base/managment_data_base");

require("dotenv").config();

const { formatStationsData } = require("./controllers/stationsController");
const { Column } = require("pg-promise");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
});

const fetchStationData = async () => {
  const url = "http://api.canair.io:8080/dwc/stations";
  const response = await fetch(url);
  const allData = await response.json();
  return allData;
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/geovisor", (req, res) => {
  res.sendFile(__dirname + "/views/geovisor.html");
});

app.get("/hojadevida", (req, res) => {
  res.sendFile(__dirname + "/views/hojadevida.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/loginregister.html");
});

app.get("/api/stations", async (req, res) => {
  const allStationsData = await fetchStationData();

  const formattedStationsData = formatStationsData(allStationsData);
  const sendData2Db = formattedStationsData.map((data) => {
    updateDb("estaciones", "pm25", data["pm2.5"], "cod", data.station);
    updateDb("estaciones", "aqi", data.aqi, "cod", data.station);
  });
  res.json({
    main: formattedStationsData,
  });
});

//updateDb("estaciones", "aqi", 15, "cod", `D29TTGOT7A0DDA`);
//queryDb("pm25", "estaciones", "cod", `'D29TTGOT7D4D7A'`);
