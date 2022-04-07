const API_URL = "/api/stations";
const API_DATA = "/api/data";
const API_SEND = "/api/send";

const map = L.map("map").setView([3.4, -76.523913], 12.45);

const tiles = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(map);

const wms = L.tileLayer
  .wms("http://localhost:8080/geoserver/sigwebII/wms", {
    layers: "barrios",
    styles: "pol2",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

const wms2 = L.tileLayer
  .wms("http://localhost:8080/geoserver/sigwebII/wms", {
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
  console.log(data);
}

map.on("click", onMapClick);

const fetchAllStations = () => {
  fetch(API_URL);
};

fetchAllStations();
