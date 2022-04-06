const express = require("express");
const db = require("./data_base/dbconexion.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { Column } = require("pg-promise");

const { queryDb, updateDb } = require("./data_base/managment_data_base");
const { formatStationsData } = require("./controllers/stationsController");
const { response } = require("express");

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

app.get("/api/stations", async () => {
  const allStationsData = await fetchStationData();

  const formattedStationsData = formatStationsData(allStationsData);
  formattedStationsData.forEach((data) => {
    updateDb("estaciones", "pm25", data["pm2.5"], "cod", data.station);
    updateDb("estaciones", "aqi", data.aqi, "cod", data.station);
  });
});

app.post("/data", (req, res) => {
  console.log(req.body);
  //db.none(`UPDATE datos SET latitud = ${coords.lat}';`);
});
