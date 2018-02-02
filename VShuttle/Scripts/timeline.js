
/* TIMELINE*/

    (function() {
        // VARIABLES
        const timeline = document.querySelector(".timeline ol"),
          elH = document.querySelectorAll(".timeline li > div"),
          arrows = document.querySelectorAll(".timeline .arrows .arrow"),
          arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
          arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
          xScrolling = 280,
          disabledClass = "disabled";

        // START
        window.addEventListener("load", init);

        function init() {
            setEqualHeights(elH);
            animateTl(xScrolling, arrows, timeline);
            setKeyboardFn(arrowPrev, arrowNext);
        }

        // SET EQUAL HEIGHTS
        function setEqualHeights(el) {
            let counter = 0;
            for (let i = 0; i < el.length; i++) {
                const singleHeight = el[i].offsetHeight;

                if (counter < singleHeight) {
                    counter = singleHeight;
                }
            }

            for (let i = 0; i < el.length; i++) {
                el[i].style.height = `${counter}px`;
            }
        }

        // CHECK IF AN ELEMENT IS IN VIEWPORT
        // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // SET STATE OF PREV/NEXT ARROWS
        function setBtnState(el, flag=true) {
            if (flag) {
                el.classList.add(disabledClass);
            } else {
                if (el.classList.contains(disabledClass)) {
                    el.classList.remove(disabledClass);
                }
                el.disabled = false;
            }
        }

            // ANIMATE TIMELINE
            function animateTl(scrolling, el, tl) {
                let counter = 0;
                for (let i = 0; i < el.length; i++) {
                    el[i].addEventListener("click", function() {
                        if (!arrowPrev.disabled) {
                            arrowPrev.disabled = true;
                        }
                        if (!arrowNext.disabled) {
                            arrowNext.disabled = true;
                        }
                        const sign = (this.classList.contains("arrow__prev")) ? "" : "-";
                        if (counter === 0) {
                            tl.style.transform = `translateX(-${scrolling}px)`;
                        } else {
                            const tlStyle = getComputedStyle(tl);
                            // add more browser prefixes if needed here
                            const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
                            const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${sign}${scrolling}`);
                            tl.style.transform = `translateX(${values}px)`;
                        }

                        setTimeout(() => {
                            firstItem = document.querySelector(".timeline li:first-child"),
                            lastItem = document.querySelector(".timeline li:last-child"),
                            isElementInViewport(firstItem) ? setBtnState(arrowPrev) : setBtnState(arrowPrev, false);
                            isElementInViewport(lastItem) ? setBtnState(arrowNext) : setBtnState(arrowNext, false);
                        }, 1100);

                        counter++;
                    });
                }
            }


            // ADD BASIC KEYBOARD FUNCTIONALITY
            function setKeyboardFn(prev, next) {
                document.addEventListener("keydown", (e) => {
                    if ((e.which === 37) || (e.which === 39)) {
                        const timelineOfTop = timeline.offsetTop;
                        const y = window.pageYOffset;
                        if (timelineOfTop !== y) {
                            window.scrollTo(0, timelineOfTop);
                        }
                        if (e.which === 37) {
                            prev.click();
                        } else if (e.which === 39) {
                            next.click();
                        }
                    }
                });
            }

        })();



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
}

function RemovePreviousTimeLine() {

    var timeline = $(".timeline ol");

    timeline
       .css("display", "none")
       .find("li").remove();

    $(".timeline .routenotfound").show().velocity("transition.slideLeftIn", { stagger: 50 });
    $(".timeline .arrows").hide();
    $(".routeMap").hide();

}