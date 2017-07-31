
function AddMarker(lat, lng, map) {
    var latLng = new google.maps.LatLng(lat, lng)
     mark = new google.maps.Marker({
         position: latLng,
        map: map,
        title: 'Home',
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
    return location.replace("Bus Stop", "").replace("Bus Stand", "").replace("just standa", "").replace("BUS STOP", "");
}