const map = L.map('map').setView([data.geometry.coordinates[1],data.geometry.coordinates[0]], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 9,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const Marker = L.marker([data.geometry.coordinates[1],data.geometry.coordinates[0]]).addTo(map)
  .bindPopup(`<h4> <b>${data.title}</b></h4> <p> Extact location will be provided after booking </p>`)
  .openPopup();

const circle = L.circle([data.geometry.coordinates[1],data.geometry.coordinates[0]], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.3,
    radius: 10000
}).addTo(map)
.bindPopup(`<h4> <b>${data.title}</b></h4> <p> Extact location will be provided after booking </p>`)
  .openPopup();
