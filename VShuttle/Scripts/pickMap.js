function initialize() {
    debugger;
    var mapDiv = document.getElementById('map-canvas');
    var officeLatLng = { lat: 27.711703, lng: 85.321949 };
    var MyLatLng = { lat: 0, lng: 0 };
    var allMarker = new Array();
    var mapPoints = new Array();
    var distance = 0;
    var totalDistance = 0;
    var distanceList = new Array();

    var latlng = new Array();

    var map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    mapPoints.push(new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng))
    var path = new google.maps.MVCArray();
    var directionsService = new google.maps.DirectionsService();
    var poly = new google.maps.Polyline({ map: map, strokeColor: 'red' });

    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsRenderer.setOptions({
        draggable: true
    });

    AddMarker(officeLatLng.lat, officeLatLng.lng);

    function AddMarker(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng)
        var mark = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'Home',
            description: 'Home'
        });
        allMarker.push(mark);
    }

    map.addListener('click', function (args) {
        AddMarker(args.latLng.lat(), args.latLng.lng());     
        mapPoints.push(args.latLng);
       // latlng.push(args.latLng.lat() + ":" + args.latLng.lng());
        $("#UserInfo_Latitude").val(args.latLng.lat());
        $("#UserInfo_Longitude").val(args.latLng.lng());
    });

    //search location in google map

    function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }


    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });

}