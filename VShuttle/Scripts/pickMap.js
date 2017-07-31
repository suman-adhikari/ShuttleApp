var map_pickmap;
var mapPoints = new Array();
var latlng = new Array();
var allMarker = new Array();


function initialize(div_id) {
    var mapDiv = document.getElementById(div_id);   
    var officeLatLng = { lat: 27.711703, lng: 85.321949 };
    var centerlatLng = new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng);

    map_pickmap = new google.maps.Map(mapDiv, {
        center: centerlatLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    mapPoints.push(centerlatLng)
    AddMarker(officeLatLng.lat, officeLatLng.lng,map_pickmap);
   
    map_pickmap.addListener('click', function (args) {
     
        var lat = args.latLng.lat();
        var lng = args.latLng.lng();
        var LatLng = new google.maps.LatLng(lat, lng);
        
        RemoveMarker(allMarker);
        //console.log(args.latLng.lat() + ' : ' + args.latLng.lng())
        var marker = AddMarker(lat,lng, map_pickmap);
        allMarker.push(marker);

        mapPoints.push(args.latLng);
        getLocnameFromPinnedAddress(LatLng)
        $("#UserInfo_Latitude").val(lat);
        $("#UserInfo_Longitude").val(lng);
        //for update
        $("#Latitude").val(lat);
        $("#Longitude").val(lng);      
    });
  
    //search location in google map
    //initAutocomplete();
    //showSuggestion();

    google.maps.event.addListenerOnce(map_pickmap, 'idle', function () {
        google.maps.event.trigger(map_pickmap, 'resize');
    });

}

function getLocnameFromPinnedAddress(LatLng) {

    var service = new google.maps.places.PlacesService(map_pickmap);
   
        var request = {
            location: LatLng,
            radius: '500',
            types: ['bus_station']
        };


        // service.nearbySearch(request, callbackSearchNearByPlaces);
        service.nearbySearch(request, function (result, status) {
            callbackSearchNearByPlaces(result, status)
        });

        function callbackSearchNearByPlaces(result, status) {
            debugger;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var subloc = result[0].name;
                var loc = result[0].vicinity;
                subloc = ExtractLocation(subloc);
                $("#UserInfo_SubLocation").val(subloc);
                $("#SubLocation").val(subloc);
            }

        }
}

function initAutocomplete() {

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map_pickmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map_pickmap.addListener('bounds_changed', function () {
        searchBox.setBounds(map_pickmap.getBounds());
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
                map: map_pickmap,
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
        map_pickmap.fitBounds(bounds);
    });
}


function showSuggestion() {
    $("#pac-input").css("display", "block");
    $(".pac-container").css({ "z-index": "2000", "Display": "block" });
}

