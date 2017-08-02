var mapPoints;
var routeid;
var loadOnlyMap;

var map;
var directionsService 
var directionsRenderer
var service;

var originOfc;
var officeLatLng;
var _location;
var _sublocation;
var IsDataAvailabel = false;

function initializeRouteMap(latlngList, _routeid, OnlyMap) {
    debugger;
    routeid = _routeid;
    officeLatLng = { lat: 27.711753319439183, lng: 85.32223284244537 };
    originOfc = new google.maps.LatLng(officeLatLng.lat, officeLatLng.lng);
    var mapDiv = document.getElementById('map-canvas');

    map = new google.maps.Map(mapDiv, {
        center: originOfc,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    if (latlngList.length > 0) {
        IsDataAvailabel = true;
        loadOnlyMap = OnlyMap;
        _location = new Array();
        _sublocation = new Array();
        
        mapPoints = new Array();
        distanceList = new Array();
        HideSearchInput();
       
        service = new google.maps.places.PlacesService(map);

        mapPoints.push(originOfc);
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        directionsRenderer.setOptions({
            draggable: true
        });

        map.addListener('click', function (args) {
            // AddMarker(args.latLng.lat(),args.latLng.lng());         
        });

        GetMapPoints(latlngList);

        Array.prototype.max = function () {
            return Math.max.apply(Math, this);
        };

        getDesination();

    } else {
        IsDataAvailabel = false;
        setRoute();
    }
   
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
    var destination = "";

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
    var optimizedRouteLatLong = new Array();
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
            directionsRenderer.setDirections(_response);

            if (!loadOnlyMap) {              
                placeIdList = _response.geocoded_waypoints;
                var i = -1;
                optimizedRouteLatLong.push(_response.request.origin);
                if (_response.request.waypoints != undefined) {
                    _response.request.waypoints.forEach(function (item) {
                        i++;
                        optimizedRouteLatLong.push(_response.request.waypoints[_response.routes[0].waypoint_order[i]].location);
                        //optimizedRouteLatLong.push(item.location);
                    });
                }
                optimizedRouteLatLong.push(_response.request.destination);
                getlocnameFromLatLong(optimizedRouteLatLong);
            } else {
                SetMapCenter();
            }

            
        }       
    });
   
}

function getlocname(placeIdList) {
  
    var index = 0;
   // var service = new google.maps.places.PlacesService(map);
    placeIdList.forEach(function (item) {      
        service.getDetails({
            placeId: item.place_id
        }, function (place, status) {
            
            if (status === google.maps.places.PlacesServiceStatus.OK) {             
                index++;
                
                 getlocnameFromLatLong(index, place.geometry.location);

                //_location.push(place.address_components[0].long_name);
                //_sublocation.push(place.address_components[1].long_name);
                //if (index == placeIdList.length - 1) {
                //  locationstring()
                // };

            }
            else {
                alert("getlocname : GetDetail ")
            }
        });

    });
    
}

function getlocnameFromLatLong(optimizedRouteLatLong) {
  
    //var service = new google.maps.places.PlacesService(map);
    optimizedRouteLatLong.forEach(function (item) {
        var request = {
            location: item,
            radius: '500',
            types: ['bus_station']
        };

        
        // service.nearbySearch(request, callbackSearchNearByPlaces);
        service.nearbySearch(request, function (result, status) {          
            callbackSearchNearByPlaces(result, status)
        });

        function callbackSearchNearByPlaces(result, status) {
         
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var subloc = result[0].name;
                var loc = result[0].vicinity;

                _location.push(result[0].name);
                _sublocation.push(result[0].vicinity);
                if (_location.length > optimizedRouteLatLong.length-1) {
                    locationstring(_location)
                };
            }
            else {
                alert("Near By");
            }

        }
    })
}

function locationstring(_location) {
    var unique = _location.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    })    
    var allLocation = unique.map(function (item) { return ExtractLocation(item) }).join(" -> ");
    $("#route_location").val("");
    $("#route_location").val(allLocation);
    setRoute();
    SetMapCenter();
}

function SetMapCenter() {
    map.setCenter(originOfc);
    map.setZoom(13);
}

function setRoute() {
    
    var alllocation = IsDataAvailabel ? $("#route_location").val() : "No Data Found";
    $("#route-body-" + routeid).text(alllocation);
}

function GetlatLngFromPlaceId(placeId) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'placeId': placeId}, function(results, status) {
        if (status === 'OK') {
            var x = results[0].geometry.location;
            return x;
        }
    });
}
