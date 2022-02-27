const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");

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

const fetchAllStationsAQI = async () => {
  const URL = "https://api.waqi.info/api/feed/@242959/aqi.json";
  const payload = {
    token: " b3a69385843ab9120ecaaf749649b0cff3501534",
    id: "242959",
  };

  const data = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: new FormData(payload),
  });

  return data;
};

app.get("/api", async (req, res) => {
  const aqi = await fetchAllStationsAQI();
  res.json(aqi);
});

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
  const colors = ["red", "orange", "yellow", "green"];
  const stationIds = [
    "244456",
    "249298",
    "244447",
    "242959",
    "13298378", // Non-existent station
  ];

  const allStationsData = await Promise.all(
    stationIds.map((station) => fetchStationData(station))
  );

  const filteredStationsData = allStationsData.filter(
    (station) => station.status === "ok" && station.data
  );

  const formattedStationsData = filteredStationsData.map(({ data, meta }) => ({
    pm25: {
      mean: data.pm25.pop().mean,
      time: data.pm25.pop().time,
    },
    location: meta.geo,
    color: colors[Math.floor(Math.random() * 4)],
  }));

  res.json(formattedStationsData);
});

/*https://airnet.waqi.info/airnet/feed/hourly/244456
https://airnet.waqi.info/airnet/feed/hourly/249298
https://airnet.waqi.info/airnet/feed/hourly/244447
https://airnet.waqi.info/airnet/feed/hourly/242959
https://api.waqi.info/feed/cali/?token=b3a69385843ab9120ecaaf749649b0cff3501534*/
