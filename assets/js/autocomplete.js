// Créez une carte Leaflet
let map = L.map('map').setView([51.505, -0.09], 13);
const datalist = document.querySelector('#autocomplete-list')
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


let geocoder = L.Control.Geocoder.nominatim();

let searchControl = L.Control.geocoder({
    geocoder: geocoder
}).addTo(map);

let addressInput = document.getElementById('address');

addressInput.addEventListener('input', function() {
    geocoder.geocode(this.value, function(results) {
        datalist.innerHTML = ''
        results.forEach(value => {
           
            const option = document.createElement('option')
            option.value = value.name
            datalist.appendChild(option)
        });        
    });
});
