const express = require("express");
const fetch = require("node-fetch");

const app = express();

const port = 5500;

//endpoint.
app.get("/api/station/:id", async (req, res) => {
  const { id } = req.params;
  const url = `https://airnet.waqi.info/airnet/feed/hourly/${id}`;
  const response = await fetch(url);
  const allData = await response.json();
  const { data, meta } = allData;
  const stationData = {
    pm25: {
      mean: data.pm25.pop().mean,
      time: data.pm25.pop().time,
    },
    location: meta.geo,
  };

  res.json(stationData);
});

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

/*https://airnet.waqi.info/airnet/feed/hourly/244456
https://airnet.waqi.info/airnet/feed/hourly/249298
https://airnet.waqi.info/airnet/feed/hourly/244447
https://airnet.waqi.info/airnet/feed/hourly/242959
https://api.waqi.info/feed/cali/?token=b3a69385843ab9120ecaaf749649b0cff3501534*/
