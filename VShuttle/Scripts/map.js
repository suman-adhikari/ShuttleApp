
function initializeRouteMap(latlngList) {
    var mapDiv = document.getElementById('map-canvas');
    var officeLatLng = { lat: 27.711753319439183, lng: 85.32223284244537 };
    var MyLatLng = { lat: 0, lng: 0 };
    var allMarker = new Array();
    var mapPoints = new Array();
    var distance = 0;
    var totalDistance = 0;
    var distanceList = new Array();
    var destination = "";

    var latlng = new Array();
    var originOfc = new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng);
    debugger;
    var map = new google.maps.Map(mapDiv, {
        center: originOfc,
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


    latlngList.forEach(function (item) {
        if (item.Latitude != null) {
            var latLng = new google.maps.LatLng(item.Latitude, item.Longitude)
            mapPoints.push(latLng);
        }
    });

    Array.prototype.max = function () {
        return Math.max.apply(Math, this);
    };

   

    function getlocname(placeIdList) {
        //var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=27.666473038237093,85.43665587902069&sensor=true";
        //var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJLS28pqgZ6zkRJOo-W-q6Gmw&key=AIzaSyDq0QcBfmGJaAq5Lu1Ik57BxqRKyY93_jw";
        var i = 0;
        var location = new Array();
        var sublocation = new Array();

        placeIdList.forEach(function (item) {
                var service = new google.maps.places.PlacesService(map);
                service.getDetails({
                placeId: item.place_id
          }, function (place, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                  i++;
                //var city = place.address_components[0].long_name + ": " + place.address_components[1].long_name;
                location.push(place.address_components[0].long_name);
                sublocation.push(place.address_components[1].long_name);
                if (i == placeIdList.length - 1) {
                    locationstring(sublocation)
                };
               
            }
          });
                  
        });

    }
    getDesination();

    function locationstring(sublocation) {

        var unique = sublocation.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        })
        var allLocation = unique.join(" -> ");
        $("#route_location").val(allLocation);
        setRoute();
    }

    // selecting destination
    function getDesination() {
        var distanceFromOrigin = new Array();
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
              origins: [originOfc],
              destinations: mapPoints,
              travelMode: 'DRIVING'
          }, callback);

        function callback(response, status) {
           
            var x = response.rows[0].elements;
            x.forEach(function (item) {
                distanceFromOrigin.push(item.distance.value)
            })
            var x = distanceFromOrigin.max()
            var index = distanceFromOrigin.indexOf(x);
            destination = mapPoints[index]; // response.destinationAddresses[index];
            mapPoints.splice(index,index);
            getRoutePointsAndWaypoints()
        }

       
    }

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
        //AddMarker(args.latLng.lat(),args.latLng.lng());         
    });

    function CalculateDistance() {
        _request = {
            origin: mapPoints[mapPoints.length - 2],
            destination: mapPoints[mapPoints.length - 1],
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(_request, function (_response, _status) {

            if (_status == google.maps.DirectionsStatus.OK) {
                distance = (_response.routes[0].legs[0].distance.value) / 1000;
                totalDistance += distance;
                distanceList.push(distance);
            }
        });

    }

    function getRoutePointsAndWaypoints() {
       
        var waypoints = new Array();

        if (mapPoints.length > 2) {
            for (var j = 1; j < mapPoints.length; j++) {
                var address = mapPoints[j];
                if (address !== "") {
                    waypoints.push({
                        location: address,
                        stopover: true  //stopover is used to show marker on map for waypoints
                    });
                }
            }
            //Call a drawRoute() function
            drawRoute(mapPoints[0], mapPoints[mapPoints.length - 1], waypoints);
        } else if (mapPoints.length > 1) {
            //Call a drawRoute() function only for start and end locations
            drawRoute(mapPoints[mapPoints.length - 2], mapPoints[mapPoints.length - 1], waypoints);
        }
    }

    function drawRoute(originAddress, destinationAddress, _waypoints) {    
        var _request = '';

        //This is for more then two locatins
        if (_waypoints.length > 0) {

            _request = {

                origin: originAddress,
                destination:destination, //destinationAddress,
                waypoints: _waypoints,
                optimizeWaypoints: true, //set to true to determine the shortest route
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
        } else {
            //This is for one or two locations. Here noway point is used.
            _request = {
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
        }

        //This will take the request and draw the route and return response and status as output
        directionsService.route(_request, function (_response, _status) {
            if (_status == google.maps.DirectionsStatus.OK) {

                placeIdList = _response.geocoded_waypoints;             
                getlocname(placeIdList);

                directionsRenderer.setDirections(_response);
                var legs = _response.routes[0].legs;
                var totalDuration = 0;
                for (var i = 0; i < legs.length; ++i) {
                    totalDistance += legs[i].distance.value;
                    totalDuration += legs[i].duration.value;
                }

                //distance = (_response.routes[0].legs[0].distance.value)/1000;
                //totalDistance +=distance;
               // alert((totalDistance / 1000) + "KM : Duration: " + (totalDuration / 60));

            }
        });
    }

    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });

   

}