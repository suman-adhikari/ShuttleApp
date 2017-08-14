


function AddMarker(lat, lng, map, Icon) {
    var latLng = new google.maps.LatLng(lat, lng)
    var iconurl = "Content/Image/color.png".replace("color", Icon);
    mark = new google.maps.Marker({
         position: latLng,
         map: map,
         title: 'Home',
         icon: iconurl,
        description: 'Home'
     });
     return mark;
}

function RemoveMarker(allMarker) {
    while (allMarker.length) {
        allMarker.pop().setMap(null);
    }
}

function ExtractLocation(location) {
    return location.replace("Bus Stop", "").replace("Bus Stand", "").replace("just standa", "").replace("BUS STOP", "").replace("Koteshwore", "Koteshwor");
}

function resizeMap(map) {
    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });
}

function ShowPopUpInfo(map, marker, contentString) {
    var infowindow = new google.maps.InfoWindow({
        content: contentString
       // pixelOffset: new google.maps.Size(+20, +15)
        
    });
    infowindow.open(map, marker)
}

function GetLatLng(lat,lng) {
    return new google.maps.LatLng(lat, lng);
}