const maps = document.querySelectorAll('.map')

maps.forEach((map,index)=>{
    L.Control.Geocoder.nominatim().geocode(map.getAttribute('data-address'), function (results) {
        if (results && results.length > 0) {
            const latlng = L.latLng(results[0].center.lat, results[0].center.lng);
    
            let mapper = L.map('map'+index).setView(latlng, 13);
    
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapper);
    
            let marker = L.marker(latlng).addTo(mapper);
            marker.bindPopup(map.getAttribute('data-address'));

           
            marker.on('click', function () {
                marker.openPopup();
            });
        } else {
            console.error("Adresse non trouvée !");
        }
        
    });
})

let popupDetails = document.querySelector('#popup-details');
		let shutButton = popupDetails.querySelector('.close');

		function openPopup() {
			popupDetails.style.display = 'block';
            document.body.classList.add('blur');

		}
		function closePopup() {
			popupDetails.style.display = 'none';
            document.body.classList.remove('blur');

		}

		if (popupDetails && shutButton) {
			let detailsButtons = document.querySelectorAll('.details-button');
			
			detailsButtons.forEach(button => {
				button.addEventListener('click', openPopup);
			});

			shutButton.addEventListener('click', closePopup);
		}

        
