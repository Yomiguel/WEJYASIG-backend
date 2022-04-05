const API_URL = "/api/stations";

const map = L.map("map").setView([3.4, -76.523913], 12.45);

const tiles = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(map);

const wms = L.tileLayer
  .wms("https://52.90.136.189:8080/geoserver/sigwebII/wms", {
    layers: "barrios",
    styles: "pol2",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

const wms2 = L.tileLayer
  .wms("https://52.90.136.189:8080/geoserver/sigwebII/wms", {
    layers: "estaciones",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

const popup = L.popup();

function onMapClick(e) {
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
  const coords = { lat: e.latlng.lat, lon: e.latlng.lng };
  return coords;
}

map.on("click", onMapClick);

const fetchAllStations = () => {
  fetch(API_URL);
};

fetchAllStations();