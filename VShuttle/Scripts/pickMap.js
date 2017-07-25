var map;
var allMarker = new Array();
var mapPoints = new Array();
var latlng = new Array();

function initialize() {
  
    var mapDiv = document.getElementById('map-canvas');
    var officeLatLng = { lat: 27.711703, lng: 85.321949 };
    var centerlatLng = new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng);

    map = new google.maps.Map(mapDiv, {
        center: centerlatLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    mapPoints.push(centerlatLng)
    AddMarker(officeLatLng.lat, officeLatLng.lng);
   
    map.addListener('click', function (args) {
        debugger;
        AddMarker(args.latLng.lat(), args.latLng.lng());
        mapPoints.push(args.latLng);
        $("#UserInfo_Latitude").val(args.latLng.lat());
        $("#UserInfo_Longitude").val(args.latLng.lng());
    });
  
    //search location in google map
    initAutocomplete();
    showSuggestion();

    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });

}

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

function initAutocomplete() {

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


function showSuggestion() {
    $("#pac-input").css("display", "block");
    $(".pac-container").css({ "z-index": "2000", "Display": "block" });
}

