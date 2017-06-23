//Plugin made By Sushil Shrestha

(function($) {
    $.fn.dateTimePicker = function(options) {

        return this.each(function() {
            var $input = $(this);
            var $container = null;

            var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            var weeekDays = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
            var daySelector = "td:not(:empty)";

            var self = {
                initialize: function() {

                    $container = self.initializeContainer().hide()
                        .append(self.buildCalender(new Date()))
                        .delegate(daySelector, "click", self.clicked)
                        .delegate(".prev", "click", self.loadPrevious)
                        .delegate(".next", "click", self.loadNext)
                        .delegate(".monthSelect", "change", self.pickDate)
                        .delegate(".yearSelect", "change", self.pickDate)
                        .delegate(".prev", "mouseenter mouseleave", self.addPrevHoverClass)
                        .delegate(".next", "mouseenter mouseleave", self.addNextHoverClass)
                        .delegate(".ui-button-ok", "click", self.buttonClick);
                },

                hide: function() {
                    $container.fadeOut(200);
                },

                show: function() {

                    if ($input.val() != "") {
                        var englishDate = new Date($input.val().split("/"));
                        if (isNaN(englishDate.getDay()))
                            $container.empty().append(self.buildCalender(new Date()));
                        else
                            $container.empty().append(self.buildCalender(englishDate));
                    }


                    var bottom = $("body").height() - $($input).offset().top - $($input).outerHeight() - 6;

                    if ($container.height() > bottom) {
                        var topPosition = $($input).offset().top - $container.height() - 6;
                    } else {
                        var topPosition = $($input).offset().top + $($input).outerHeight();
                    }
                    $container.css({
                        'position': "absolute",
                        'top': topPosition,
                        'left': $($input).offset().left,
                        'z-index': 10000
                    });

                    $container.fadeIn(200);
                },
                setInputValue: function() {

                    if ($container.find("td .ui-state-active").length == 0) {
                        $container.find("td .ui-state-highlight").addClass("ui-state-active");
                    }

                    var $activeCell = $container.find("td a.ui-state-active");
                    var selectedYear;
                    selectedYear = $activeCell.closest(".dateTimePicker").find(".yearSelect option:selected").val();
                    var selectedMonth;

                    if ($activeCell.closest(".dateTimePicker").find(".monthSelect").val() > 9)
                        selectedMonth = $activeCell.closest(".dateTimePicker").find(".monthSelect").val();
                    else
                        selectedMonth = "0" + $activeCell.closest(".dateTimePicker").find(".monthSelect").val();

                    var selectedDay = $activeCell.text() > 9 ? $activeCell.text() : "0" + $activeCell.text();


                    $input.val(selectedYear + "-" +
                        selectedMonth + "-" + selectedDay + ", " + $activeCell.closest(".dateTimePicker").find(".ui-tpicker-hour").text() +
                        $activeCell.closest(".dateTimePicker").find(".ui-tpicker-min").text() + $activeCell.closest(".dateTimePicker").find(".ui-tpicker-sec").text()).change();
                },

                buttonClick: function() {
                    self.setInputValue();
                    self.hide();
                },
                clicked: function() {

                    $container.find("td a.ui-state-active").removeClass("ui-state-active");
                    $(this).find("a").addClass("ui-state-active");

                    self.setInputValue();

                },
                loadPrevious: function() {
                    var year = parseInt($(this).closest(".dateTimePicker").find(".yearSelect").val());
                    var month = parseInt($(this).closest(".dateTimePicker").find(".monthSelect").val());
                    if (month == 1) {
                        year = year - 1;
                        month = 12;
                    } else {
                        month = month - 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.empty().append(self.buildCalender(englishDate));
                    $container.find("td a.ui-state-active").removeClass("ui-state-active");
                },
                loadNext: function() {
                    var year = parseInt($(this).closest(".dateTimePicker").find(".yearSelect").val());
                    var month = parseInt($(this).closest(".dateTimePicker").find(".monthSelect").val());
                    if (month == 12) {
                        year = year + 1;
                        month = 1;
                    } else {
                        month = month + 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.empty().append(self.buildCalender(englishDate));
                },
                pickDate: function() {
                    var year = parseInt($(this).closest(".dateTimePicker").find(".yearSelect").val());
                    var month = parseInt($(this).closest(".dateTimePicker").find(".monthSelect").val());
                    var englishDate = new Date(month + "/1/" + year);
                    $container.empty().append(self.buildCalender(englishDate));
                },
                addPrevHoverClass: function() {
                    $(this).toggleClass("ui-state-hover ui-datepicker-prev-hover");
                },
                addNextHoverClass: function() {
                    $(this).toggleClass("ui-state-hover ui-datepicker-next-hover");
                },
                hover: function() {
                    $(this).toggleClass("ui-state-hover");
                },
                initializeContainer: function() {

                    if ($(".dpp").length == 0) {
                        $("<div class=\"dpp\"/>").insertAfter($("body"));
                    }

                    var dateTimePicker = $("<div>").addClass("dateTimePicker ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all");

                    $(".dpp").html(dateTimePicker);

                    return dateTimePicker;
                },

                buildCalender: function(currentDate) {

                    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                    var totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                    var calendarHeader = $("<div></div>").addClass("ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all ");

                    var previousLink = $("<a></a>").addClass("prev ui-datepicker-prev ui-corner-all");
                    var previousSpan = $("<span></span>").addClass("ui-icon ui-icon-circle-triangle-w");
                    previousLink.append(previousSpan);

                    var nextLink = $("<a></a>").addClass("next ui-datepicker-next ui-corner-all");
                    var nextSpan = $("<span></span>").addClass("ui-icon ui-icon-circle-triangle-e");
                    nextLink.append(nextSpan);

                    var headerTitle = $("<div></div>").addClass("ui-datepicker-title");

                    var monthSelect = $("<select></select>").addClass("monthSelect ui-datepicker-month");
                    var yearSelect = $("<select></select>").addClass("yearSelect ui-datepicker-year");
                    var i;
                    for (i = 0; i < months.length; i++) {
                        if (i == (currentDate.getMonth())) {
                            monthSelect.append("<option value='" + (i + 1) + "' selected='selected'>" + months[i] + "</option>");
                        } else {
                            monthSelect.append("<option value='" + (i + 1) + "'>" + months[i] + "</option>");
                        }
                    }


                    for (i = 2000; i <= 2020; i++) {
                        if (i == (currentDate.getFullYear())) {
                            yearSelect.append("<option value='" + i + "' selected='selected'>" + i + "</option>");
                        } else {
                            yearSelect.append("<option value='" + i + "'>" + i + "</option>");
                        }
                    }

                    headerTitle.append(monthSelect).append(yearSelect);

                    calendarHeader = calendarHeader.append(previousLink).append(nextLink).append().append(headerTitle);


                    var weeks = Math.ceil((totalDays + firstDay.getDay()) / 7);

                    var $table = $("<table/>");
                    var count;

                    var $trHead = $("<tr/>");
                    $table.append($trHead);

                    for (var k = 0; k < 7; k++) {
                        var $th = $("<th/>");
                        $th.text(weeekDays[k]);
                        $trHead.append($th);
                    }


                    for (i = 0, count = 1; i < weeks; i++) {
                        var $tr = $("<tr/>");
                        $table.append($tr);
                        for (var j = 0; j < 7; ++j, ++count) {
                            var $td = $("<td/>");
                            if (count > firstDay.getDay() && count <= totalDays + firstDay.getDay()) {
                                if ((count - firstDay.getDay()) == new Date().getDate() && currentDate.getMonth() == new Date().getMonth() && currentDate.getFullYear() == new Date().getFullYear()) {
                                    $td.html("<a class='ui-state-default ui-state-highlight'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                    $tr.append($td);
                                } else if ($input.val() != "") {
                                    if (count - firstDay.getDay() == new Date($input.val().split(" ")[0]).getDate() && firstDay.getMonth() == new Date($input.val().split(" ")[0]).getMonth()
                                        && firstDay.getFullYear() == new Date($input.val().split(" ")[0]).getFullYear()) {
                                        $td.html("<a class='ui-state-default ui-state-active'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                        $tr.append($td);
                                    } else {
                                        if (count - firstDay.getDay() == 1 && (firstDay.getMonth() != new Date($input.val().split(" ")[0]).getMonth()
                                            || firstDay.getFullYear() != new Date($input.val().split(" ")[0]).getFullYear())) {
                                            $td.html("<a class='ui-state-default ui-state-active'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                            $tr.append($td);
                                        } else {
                                            $td.html("<a class='ui-state-default'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                            $tr.append($td);
                                        }
                                    }
                                } else {
                                    if (count - firstDay.getDay() == 1) {
                                        $td.html("<a class='ui-state-default ui-state-active'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                        $tr.append($td);
                                    } else {
                                        $td.html("<a class='ui-state-default'>" + parseInt(count - firstDay.getDay()) + "</a>");
                                        $tr.append($td);
                                    }

                                }

                            } else {
                                $td.html("");
                                $tr.append($td);
                            }
                        }
                    }

                    $table.addClass("ui-datepicker-calendar exclude-interface-table");

                    var $timeDiv = $("<div/>");
                    $timeDiv.addClass("ui-timepicker-div");

                    var $timeDl = $("<dl/>");
                    var $timeDt = $("<dt/>");

                    var $timeHourDD = $("<span/>");
                    var $timeMinDD = $("<span/>");
                    var $timeSecDD = $("<span/>");

                    var $hourDt = $("<dt/>");
                    var $hourDD = $("<dd/>");
                    var $hourSliderDiv = $("<div/>");

                    var $minDt = $("<dt/>");
                    var $minDD = $("<dd/>");
                    var $minSliderDiv = $("<div/>");


                    var $secDt = $("<dt/>");
                    var $secDD = $("<dd/>");
                    var $secSliderDiv = $("<div/>");

                    $timeDt.text("Time ");

                    $timeHourDD.addClass("ui-tpicker-hour");

                    $timeMinDD.addClass("ui-tpicker-min");

                    $timeSecDD.addClass("ui-tpicker-sec");

                    if ($input.val() != "") {

                        (currentDate.getHours() < 10) ? $timeHourDD.text("0" + currentDate.getHours() + ":") : $timeHourDD.text(currentDate.getHours() + ":");

                        (currentDate.getMinutes() < 10) ? $timeMinDD.text("0" + currentDate.getMinutes() + ":") : $timeMinDD.text(currentDate.getMinutes() + ":");

                        (currentDate.getSeconds() < 10) ? $timeSecDD.text("0" + currentDate.getSeconds()) : $timeSecDD.text(currentDate.getSeconds());


                    } else {
                        $timeHourDD.text("00:");
                        $timeMinDD.text("00:");
                        $timeSecDD.text("00");
                    }


                    $hourDt.text("Hour");
                    $hourSliderDiv.slider({
                        value: ($input.val() != "") ? currentDate.getHours() : 0,
                        min: 0,
                        max: 23,
                        step: 1,
                        slide: function(event, ui) {
                            if (ui.value < 10) {
                                $(".ui-tpicker-hour").text("0" + ui.value + ":");
                                self.setInputValue();

                            } else {
                                $(".ui-tpicker-hour").text(ui.value + ":");
                                self.setInputValue();
                            }

                        }
                    });
                    $hourDD.append($hourSliderDiv);

                    $minDt.text("Minute");
                    $minSliderDiv.slider({
                        value: ($input.val() != "") ? currentDate.getMinutes() : 0,
                        min: 0,
                        max: 59,
                        step: 1,
                        slide: function(event, ui) {

                            if (ui.value < 10) {
                                $(".ui-tpicker-min").text("0" + ui.value + ":");
                                self.setInputValue();
                            } else {
                                $(".ui-tpicker-min").text(ui.value + ":");
                                self.setInputValue();
                            }

                        }

                    });

                    $minDD.append($minSliderDiv);

                    $secDt.text("Second");
                    $secSliderDiv.slider({
                        value: ($input.val() != "") ? currentDate.getSeconds() : 0,
                        min: 0,
                        max: 59,
                        step: 1,
                        slide: function(event, ui) {
                            if (ui.value < 10) {
                                $(".ui-tpicker-sec").text("0" + ui.value);
                                self.setInputValue();

                            } else {
                                $(".ui-tpicker-sec").text(ui.value);
                                self.setInputValue();
                            }

                        }
                    });
                    $secDD.append($secSliderDiv);


                    $timeDt.append($timeHourDD).append($timeMinDD).append($timeSecDD);
                    $timeDl.append($timeDt).append($hourDt).append($hourDD).append($hourSliderDiv).append($minDt).append($minDD).append($minSliderDiv).append($secDt).append($secDD).append($secSliderDiv);
                    $timeDiv.append($timeDl);

                    var $buttonOk = $("<input type=\"button\" value=\"Ok\" class=\"datetime-picker-button\"/>");
                    $buttonOk.addClass("ui-button-ok");

                    calendarHeader = calendarHeader.add($table).add($timeDiv).add($buttonOk);

                    return calendarHeader;
                }
            };

            $input.click(function(event) {
                self.initialize();
                self.show();
                return false;
            });

            $(document).mousedown(function(event) {
                if (($(event.target).closest(".dateTimePicker").length == 0) && $(event.target)[0] != $input[0]) {
                    if ($container != null)
                        $container.fadeOut(200);
                }
            });

        });
    };
})(jQuery);