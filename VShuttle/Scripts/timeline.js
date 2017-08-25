
function GenerateTimelineRoute(_locationWithLatLng, _routeid) {
   



    //return true;
    $(".timeline ol").css("display", "block");
    $(".timeline .arrows").show();
    $(".timeline ol").find("li").remove();
    $(".timeline .routenotfound").css("display", "none");
    $(".routeMap").show();

    _locationWithLatLng = _locationWithLatLng.map(function (item) { return ExtractLocation(item) });
    _locationWithLatLng = _locationWithLatLng.filter(Boolean);
    var unique = _locationWithLatLng.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    })

    var count =0;
    unique.forEach(function (item) {
        count++;
        var x = '<li><div>' +
                  '<time><span class="timeline-location-number">'+count+' </span>' + item + '</time><span></br></span>' +
             '</div></li>';
          
        $(".timeline ol").append(x);

        if (count == unique.length) {
            $(".timeline ol").append("<li></li>");
        }

    })

    $("ol time").velocity("transition.slideLeftIn", { stagger: 50 });


   // $("ol li").velocity(
   //{ left: "-500px" },
   //{
   //    duration: 3000,
   //    easing: "linear"
   //}
   //);

   

}

function RemovePreviousTimeLine() {

    $(".timeline ol").find("li").remove();
    $(".timeline .routenotfound").show().velocity("transition.slideLeftIn", { stagger: 50 });
    //$("ol time").velocity("transition.slideLeftIn", { stagger: 50 });
    $(".timeline ol").css("display", "none");
    $(".timeline .arrows").hide();
    $(".routeMap").hide();

}