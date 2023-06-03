function initMap() {
    const kolkata = new google.maps.LatLng(22.572645, 88.363892);
    map = new google.maps.Map(document.getElementById("map"), {
        center: kolkata,
        zoom: 15,
    });
    const request = {
        placeId: place_id,
        fields: ["name", "formatted_address", "place_id", "geometry"],
    };
    const infowindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);

    service.getDetails(request, (place, status) => {
        if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
        ) {
            map.setCenter(place.geometry.location);
            const marker = new google.maps.Marker({
                map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, "click", () => {
                const content = document.createElement("div");
                const nameElement = document.createElement("h5");

                nameElement.textContent = place.name;
                content.appendChild(nameElement);

                const placeAddressElement = document.createElement("p");

                placeAddressElement.textContent = place.formatted_address;
                content.appendChild(placeAddressElement);
                infowindow.setContent(content);
                infowindow.open(map, marker);
            });
        }
    });
}

window.initMap = initMap;