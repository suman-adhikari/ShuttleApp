
function AddMarker(lat, lng) {
    debugger;
    var latLng = new google.maps.LatLng(lat, lng)
    var mark = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Home',
        description: 'Home'
    });
}

function ExtractLocation(location) {
    return location.replace("Bus Stop", "").replace("Bus Stand", "").replace("just standa", "").replace("BUS STOP", "");
}