const maps = document.querySelectorAll('.map')

maps.forEach((map,index)=>{
    L.Control.Geocoder.nominatim().geocode(map.getAttribute('data-address'), function (results) {
        if (results && results.length > 0) {
            const latlng = L.latLng(results[0].center.lat, results[0].center.lng);
    
            // Initialisation de la carte avec les coordonnées obtenues
            let mapper = L.map('map'+index).setView(latlng, 13);
    
            // Ajout d'une couche de tuiles (par exemple, OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapper);
    
            // Ajout d'un marqueur à l'adresse
            L.marker(latlng).addTo(mapper);
        } else {
            console.error("Adresse non trouvée !");
        }
        
    });
})




