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

    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });

}