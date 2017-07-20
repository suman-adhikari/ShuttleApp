var allMarker;
var mapPoints;
var distanceList
var destination;
var distance = 0;
var totalDistance = 0;

var map;
var directionsService 
var directionsRenderer
var originOfc;
var officeLatLng;
var optimizedRouteLatLong;

var location = new Array();
var sublocation = new Array();

function initializeRouteMap(latlngList) {
    officeLatLng = { lat: 27.711753319439183, lng: 85.32223284244537 };
    var mapDiv = document.getElementById('map-canvas');
    mapPoints = new Array();
    distanceList = new Array();
    destination = "";
    HideSearchInput();
    originOfc = new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng);
    
    map = new google.maps.Map(mapDiv, {
        center: originOfc,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    mapPoints.push(originOfc);   
    directionsService = new google.maps.DirectionsService();   
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setOptions({
        draggable: true
    });


    map.addListener('click', function (args) {
        //AddMarker(args.latLng.lat(),args.latLng.lng());         
    });

    GetMapPoints(latlngList);

    Array.prototype.max = function () {
        return Math.max.apply(Math, this);
    };   

    getDesination();
   
    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    }); 
   
}



function HideSearchInput() {
    $("#pac-input").css("display", "none");
}

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


//AddMarker(officeLatLng.lat, officeLatLng.lng);
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


function GetMapPoints(latlngList) {
    latlngList.forEach(function (item) {
        if (item.Latitude != null) {
            var latLng = new google.maps.LatLng(item.Latitude, item.Longitude)
            mapPoints.push(latLng);
        }
    });
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
        mapPoints.splice(index, 1);
        mapPoints.push(destination);
        getRoutePointsAndWaypoints()
    }

}


function getRoutePointsAndWaypoints() {

    var waypoints = new Array();

    if (mapPoints.length > 2) {
        for (var j = 1; j < mapPoints.length - 1; j++) {
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
    optimizedRouteLatLong = new Array();
    //This is for more then two locatins
    if (_waypoints.length > 0) {

        _request = {

            origin: originAddress,
            destination: destinationAddress, //destinationAddress,destination
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
            debugger;
            directionsRenderer.setDirections(_response);
            placeIdList = _response.geocoded_waypoints;
            var i = -1;
            optimizedRouteLatLong.push(_response.request.origin);
            if (_response.request.waypoints != undefined) {
                _response.request.waypoints.forEach(function (item) {
                    i++;
                    optimizedRouteLatLong.push(_response.request.waypoints[_response.routes[0].waypoint_order.indexOf(i)].location);
                });
            }
            optimizedRouteLatLong.push(_response.request.destination);
            //getlocnameFromLatLong(optimizedRouteLatLong);
            getlocname(placeIdList);
          
            //var legs = _response.routes[0].legs;
            //var totalDuration = 0;
            //for (var i = 0; i < legs.length; ++i) {
              //  totalDistance += legs[i].distance.value;
              //  totalDuration += legs[i].duration.value;
            //}

            //distance = (_response.routes[0].legs[0].distance.value)/1000;
            //totalDistance +=distance;
            // alert((totalDistance / 1000) + "KM : Duration: " + (totalDuration / 60));

        }
    });
}

function getlocnameFromLatLong(IsLastValue,latlng) {
    var i = 0;



        var request = {
            location: latlng,
            radius: '500',
            types: ['bus_station']
        };
        var service = new google.maps.places.PlacesService(map);        
       // service.nearbySearch(request, callbackSearchNearByPlaces);
        service.nearbySearch(request, function (result, status) {
            i++;
            callbackSearchNearByPlaces(IsLastValue, result, status)
        });

    function callbackSearchNearByPlaces(printLocation,result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            
            var subloc = result[0].name;
            var loc = result[0].vicinity;
           
            location.push(result[0].name);
            sublocation.push(result[0].vicinity);
            if (printLocation) {
                locationstring(location)
             };
        }

       
  
    }
}


function getlocname(placeIdList) {
    debugger;
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
                debugger;

                getlocnameFromLatLong(i==placeIdList.length-1, place.geometry.location);

                //var city = place.address_components[0].long_name + ": " + place.address_components[1].long_name;
                //location.push(place.address_components[0].long_name);
                //sublocation.push(place.address_components[1].long_name);
                //if (i == placeIdList.length-1) {
                  //  locationstring(sublocation)
               // };

            }
        });

    });

}



function locationstring(sublocation) {
    var unique = sublocation.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    })
    debugger;
    //var allLocation = unique.map(function (x) { return x.place; }).join(" -> ");
    var allLocation = unique.join(" -> ");
    $("#route_location").val(allLocation);
    setRoute();
    SetMapCenter();
}

function SetMapCenter() {
    map.setCenter(new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng));
    map.setZoom(13);
}

function setRoute() {
    var alllocation = $("#route_location").val();
    $(".route-body").text(alllocation);
}

function GetlatLngFromPlaceId(placeId) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'placeId': placeId}, function(results, status) {
        if (status === 'OK') {
            debugger;
            var x = results[0].geometry.location;
            return x;
        }
    });
}
