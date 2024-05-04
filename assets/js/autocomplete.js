// Créez une carte Leaflet
let map = L.map('map').setView([51.505, -0.09], 13);
const datalist = document.querySelector('#autocomplete-list')
// Ajoutez une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialisez le géocodeur avec Nominatim comme service de géocodage
let geocoder = L.Control.Geocoder.nominatim();

// Ajoutez un champ de recherche à la carte
let searchControl = L.Control.geocoder({
    geocoder: geocoder
}).addTo(map);

// Sélectionnez le champ d'entrée
let addressInput = document.getElementById('address');

// Réagissez à un changement dans le champ d'entrée
addressInput.addEventListener('input', function() {
    // Déclenchez une recherche géocodée avec la valeur du champ d'entrée
    geocoder.geocode(this.value, function(results) {
        datalist.innerHTML = ''
        results.forEach(value => {
            console.log(value);
            const option = document.createElement('option')
            option.value = value.name
            datalist.appendChild(option)
        });        
    });
});
