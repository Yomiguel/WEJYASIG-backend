const API_URL = "/api/stations";
const API_DATA = "/api/data";
const API_SEND = "/api/send";

const aqiRange = [0, 50, 100, 150, 200, 300, 400, 500];

const calidad = [
  "Buenas",
  "Moderadas",
  "Insanas para grupos Sensibles",
  "Insanas",
  "Muy insanas",
];

const recomendations = [
  "Calidad del aire es satisfactoria, lacontaminación no ofrece riesgo para la salud. :v.",
  "Calidad del aire es aceptable, aunque algunos contaminantes pueden suponer un ligero riesgo para la salud de los grupos de riesgo e individuos sensibles a la polución.  -_-.",
  "Los miembros de los grupos de riesgo pueden experimentar efectos para la salud, pero la población general no se ve afectada. -_-",
  "Toda lo población puede experimentar efectos sobre la salud y los grupos de riesgo efectos mucho más serios. U_U.",
  "Toda la población puede verse seriamente afectada. T_T.",
];

const quality = (aqi) => {
  if (0 <= aqi && aqi <= 50) {
    return [calidad[0], recomendations[0]];
  }
  if (50 < aqi && aqi <= 100) {
    return [calidad[1], recomendations[1]];
  }
  if (100 < aqi && aqi <= 150) {
    return [calidad[2], recomendations[2]];
  }
  if (150 < aqi && aqi <= 200) {
    return [calidad[3], recomendations[3]];
  }
  return [calidad[4], recomendations[4]];
};

const map = L.map("map").setView([3.4, -76.523913], 12.45);

const tiles = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(map);

const wms = L.tileLayer
  .wms("http://54.226.99.175:8080/geoserver/sigwebII/wms", {
    layers: "barrios",
    //styles: "pol2",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

const wms2 = L.tileLayer
  .wms("http://54.226.99.175:8080/geoserver/sigwebII/wms", {
    layers: "estaciones",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

const popup = L.popup();

async function onMapClick(e) {
  popup.setLatLng(e.latlng);
  popup
    .setLatLng(e.latlng)
    .setContent(
      "Has seleccionado la coordenada:<br> " +
        e.latlng.lat.toString() +
        "," +
        e.latlng.lng.toString()
    )
    .openOn(map);
  const latitud = e.latlng.lat;
  const longitud = e.latlng.lng;
  const coords = { lat: latitud, lon: longitud };
  fetch(API_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coords),
  });
  const response = await fetch(API_SEND);
  const data = await response.json();
  const dataPm25 = data[0].pm25;
  const dataAqi = data[1].aqi;
  cal = quality(dataAqi);
  setTimeout(() => {
    popup
      .setContent(
        "La concentración de pm 2.5 para su posición es " +
          dataPm25.toString() +
          "ug/m3, " +
          "el indice de calidad del aíre es " +
          dataAqi.toString() +
          ", lo cual indica que las condiciones son " +
          cal[0].toString() + " , es decir, " + "que la " + cal[1].toString() 
      )
      .openOn(map);
  }, 2500);
}

map.on("click", onMapClick);

const fetchAllStations = () => {
  fetch(API_URL);
};

fetchAllStations();
