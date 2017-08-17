
function initializeRouteMap(latlngList, _routeid, OnlyMap, _allLocation) {
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
    var AllLocation;

    var _locationWithLatLng;
    var IsDataAvailabel = false;

    //$("#mapModel").find("input").remove();
    AllLocation = _allLocation;
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
        _locationWithLatLng = new Array();
        _locationWithLatLng.push("Hattisar");

        mapPoints = new Array();
        distanceList = new Array();
        //HideSearchInput();

        service = new google.maps.places.PlacesService(map);

        mapPoints.push(originOfc);
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: "blue",
                strokeWeight: 3,
                strokeOpacity: .7
            }
        });
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

        getDesination(_routeid);

    } else {
        IsDataAvailabel = false;
        setRoute(_routeid);
    }

    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });

    function HideSearchInput() {
        $("#pac-input").css("display", "none");
    }

    function CalculateDistance(DistanceList, routeId) {
        debugger;
        var distance;
        var TotalDistance = 0;
        var TotalTime = 0;
        DistanceList.forEach(function (item) {
            distance += (item.distance.value) / 1000 + "->";
            TotalDistance += item.distance.value > 0 ? (item.distance.value) / 1000 : 0;
            TotalTime += item.duration.value > 0 ? (item.duration.value) / 60 : 0;
            
        })
        $("#route-body-" + routeId).closest("div").find("#distancetime-taken").text(TotalDistance.toFixed(2) + " Km " + TotalTime.toFixed(2) + " Min");
        //alert(TotalDistance + " " + TotalTime);
        $("#distance-info").text(distance);
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
    function getDesination(_routeid) {
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
            if (status == "OK") {
                var x = response.rows[0].elements;
                x.forEach(function (item) {
                    distanceFromOrigin.push(item.distance.value)
                })
                var x = distanceFromOrigin.max()
                var index = distanceFromOrigin.indexOf(x);
                destination = mapPoints[index]; // response.destinationAddresses[index];
                mapPoints.splice(index, 1);
                mapPoints.push(destination);
                getRoutePointsAndWaypoints(_routeid)
            } else {
                alert("distance error");
            }
        }

    }

    function getRoutePointsAndWaypoints(_routeid) {

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
            drawRoute(mapPoints[0], mapPoints[mapPoints.length - 1], waypoints, _routeid);
        } else if (mapPoints.length > 1) {
            //Call a drawRoute() function only for start and end locations
            drawRoute(mapPoints[mapPoints.length - 2], mapPoints[mapPoints.length - 1], waypoints, _routeid);
        }
    }

    function drawRoute(originAddress, destinationAddress, _waypoints, _routeid) {
        var _request = '';
        var optimizedRouteLatLong = new Array();
        //This is for more then two locatins
        if (_waypoints.length > 0) {

            _request = {

                origin: originAddress,
                destination: destinationAddress, //destinationAddress,destination
                waypoints: _waypoints,
                provideRouteAlternatives: true,
                optimizeWaypoints: true, //set to true to determine the shortest route
                travelMode: google.maps.DirectionsTravelMode.DRIVING

            };
        } else {
            //This is for one or two locations. Here noway point is used.
            _request = {
                origin: originAddress,
                destination: destinationAddress,
                provideRouteAlternatives: true,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
        }
         //_request.provideRouteAlternatives = true;
        //This will take the request and draw the route and return response and status as output
        directionsService.route(_request, function (_response, _status) {
            if (_status == google.maps.DirectionsStatus.OK) {
                
                CalculateDistance(_response.routes[0].legs,_routeid);
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
                    GetLocationName(optimizedRouteLatLong, _routeid);
                    //getlocnameFromLatLong(optimizedRouteLatLong);
                } else {
                    setTimeout(function () { SetMapCenter(); }, 0000);
                    //SetMapCenter();
                }


            }
        });

    }

    function GetLocationName(optimizedRouteLatLong, _routeid) {
        optimizedRouteLatLong.forEach(function (item) {
            AllLocation.forEach(function (row) {
                if (item.location.lat() == row.Latitude && item.location.lng() == row.Longitude) {
                    _locationWithLatLng.push(row.Location);
                };
            });

        });
        if (_locationWithLatLng.length > optimizedRouteLatLong.length - 1) {
            locationstring(_locationWithLatLng, _routeid)
        };
    }


    function GetLocationNameFromDb(LatLng) {
        var loc = "";
        $.ajax({
            url: '/Home/FindLocationByLatLng',
            async: false,
            type: 'get',
            data: { lat: LatLng.lat(), lng: LatLng.lng() },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                loc = result;
            }
        })
        return loc;
    }

    function locationstring(_location, _routeid) {
        _location = _location.map(function (item) { return ExtractLocation(item) });
        _location = _location.filter(Boolean);
        var unique = _location.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        })
        var allLocation = unique.join(" -> ");
        $("#route_location").val("");
        $("#route_location").val(allLocation);
        setRoute(_routeid);
        SetMapCenter();
    }

    function SetMapCenter() {

        var centre = { lat: 27.796261815236115, lng: 85.111083984375 };
        map.setCenter(centre);
        map.setZoom(12);
    }

    function setRoute(_routeid) {
        var alllocation = IsDataAvailabel ? $("#route_location").val() : "No Data Found";
        $("#route-body-" + _routeid).text(alllocation);
        if (_routeid == 4) {
            $(".routeMap").css("visibility", "visible");
        }
    }

    // Function Not Used

    function GetlatLngFromPlaceId(placeId) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'placeId': placeId }, function (results, status) {
            if (status === 'OK') {
                var x = results[0].geometry.location;
                return x;
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

    function GetLocationNameInOrderOfRoute(location, optimizedRouteLatLong) {
        optimizedRouteLatLong.forEach(function (otpimizedItem) {
            location.forEach(function (item) {
                if (otpimizedItem.lat() == item.lat) {
                    _location.push(item.location.trim());
                }
            })
        })
        locationstring(_location);
    }
    // Fetch from DB, if not found call NearByPlaceService
    function getlocnameFromLatLong(optimizedRouteLatLong) {
        optimizedRouteLatLong.forEach(function (item) {
            var request = {
                location: item,
                radius: '500',
                types: ['bus_station']
            };

            var location = GetLocationNameFromDb(item);

            var loc = function () { };
            loc.lat = item.lat();
            loc.lng = item.lng();

            if (location != "NotFound") {
                loc.location = location;
                _locationWithLatLng.push(loc);

                //_location.push(location);
                //_sublocation.push(location);
            }
            else {
                // alert("servicecall");
                // service.nearbySearch(request, callbackSearchNearByPlaces);
                service.nearbySearch(request, function (result, status) {
                    callbackSearchNearByPlaces(result, status, item)
                });
            }

            function callbackSearchNearByPlaces(result, status, item) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var subloc = result[0].name;
                    var _loc = result[0].vicinity;
                    var loc = function () { };
                    loc.lat = item.lat();
                    loc.lng = item.lng();
                    loc.location = subloc;
                    _locationWithLatLng.push(loc);

                    if (_locationWithLatLng.length > optimizedRouteLatLong.length - 1) {
                        GetLocationNameInOrderOfRoute(_locationWithLatLng, optimizedRouteLatLong)
                    };
                }
                else {
                    alert("Near By");
                }

            }
        })

        if (_locationWithLatLng.length > optimizedRouteLatLong.length - 1) {
            GetLocationNameInOrderOfRoute(_locationWithLatLng, optimizedRouteLatLong)
        };

    }

}