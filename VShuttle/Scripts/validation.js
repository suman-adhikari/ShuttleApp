//Plugin made by Anup Nepal

(function($) {
    $.fn.validation = function(options) {

        return this.each(function() {
            var $input = $(this);
            var $validationDiv = $("<div class=\"validationError\"></div>");
            var $validationLine = $("<div class=\"validationLine\"></div>");

            var self = {
                initialize: function() {

                    if (options.Event == null)
                        $input.bind("blur", self.checkForValidation);
                    else
                        $input.bind(options.Event, self.checkForValidation);

                    $input.on("removeErrorMessage", function() {
                        self.removeErrorMessage();
                    });

                },
                checkForValidation: function() {
                    if (options.Regex != null && $input.val() != "") {
                        if (!self.compareWithRegex())
                            self.showRegexMessage();
                        else if (options.GreaterThanToday != null && !self.compareGreaterThanToday()) {
                            self.showGreaterThanTodayMessage();
                        } else if (options.GreaterThan != null && !self.compareGreaterThan()) {
                            self.showGreaterThanMessage();
                        } else if (options.UpperLimitTimeCheck != null && options.UpperLimitTimeCheck && !self.CheckUpperLimitTime()) {
                            self.showUpperLimitTimeMessage();
                        } else if (options.LowerLimitTimeCheck && !self.CheckLowerLimitTime()) {
                            self.showLowerLimitTimeMessage();
                        } else {
                            self.removeErrorMessage();
                        }
                    } else if (options.IsEmpty != null && options.IsEmpty == false && $input.val() == "")
                        if (options.DependsUpon != null) {
                            if (options.DependsUpon.is(":checked")) {
                                self.showEmptyMessage();
                            }
                        } else if (options.DependsUponAdditional != null) {
                            if (options.DependsUponAdditional.IsEmpty != null && options.DependsUponAdditional.IsEmpty == false && options.DependsUponAdditional.control.val() != "") {
                                self.showDependsUponAdditionalMessage();
                            } else
                                self.removeErrorMessage();
                        } else
                            self.showEmptyMessage();
                    else if (options.Compare != null && options.Compare) {
                        if (!self.compareWithAnother())
                            self.showCompareMessage();
                        else
                            self.removeErrorMessage();
                    } else if (options.CompareWithArray != null) {
                        if (self.checkIfExist())
                            self.showDuplicateMessage();
                        else
                            self.removeErrorMessage();
                    } else if (options.HasRange != null) {
                        if ($input.val() != "") {
                            if ($input.val() >= 0 && $input.val() <= 150) {
                                self.removeErrorMessage();
                            } else {
                                self.showRangeMessage();
                            }
                        }
                    } else if (options.IsInteger != null && isNaN($input.val())) {
                        self.showNotIntegerMessage();
                    } else
                        self.removeErrorMessage();
                },
                compareWithRegex: function() {
                    var regex = options.Regex;
                    return regex.test($input.val());
                },
                showRegexMessage: function() {
                    $validationDiv.text(options.RegexMessage);
                    self.displayErrorMessage();
                },
                showGreaterThanTodayMessage: function() {
                    $validationDiv.text(options.GreaterThanTodayMessage);
                    self.displayErrorMessage();
                },
                showEmptyMessage: function() {
                    $validationDiv.text(options.EmptyMessage);
                    self.displayErrorMessage();
                },
                showCompareMessage: function() {
                    $validationDiv.text(options.CompareMessage);
                    self.displayErrorMessage();
                },
                showDuplicateMessage: function() {
                    $validationDiv.text(options.DuplicateMessage);
                    self.displayErrorMessage();
                },
                showRangeMessage: function() {
                    $validationDiv.text(options.RangeMessage);
                    self.displayErrorMessage();
                },
                showNotIntegerMessage: function() {
                    $validationDiv.text(options.IntegerMessage);
                    self.displayErrorMessage();
                },
                showUpperLimitTimeMessage: function() {
                    $validationDiv.text(options.UpperLimitTimeMessage);
                    self.displayErrorMessage();
                },
                showLowerLimitTimeMessage: function() {
                    $validationDiv.text(options.LowerLimitTimeMessage);
                    self.displayErrorMessage();
                },
                showDependsUponAdditionalMessage: function() {
                    $validationDiv.text(options.DependsUponAdditionalMessage);
                    self.displayErrorMessage();
                },
                showGreaterThanMessage: function() {
                    $validationDiv.text(options.GreaterThanMessage);
                    self.displayErrorMessage();
                },
                displayErrorMessage: function() {
                    var topPosition = $input.offset().top;
                    var leftPosition = $input.offset().left + $input.width();

                    $("body").append($validationLine.css({
                        'top': topPosition + ($input.height() / 2),
                        'left': leftPosition + 4
                    }));
                    $("body").append($validationDiv.css({
                        'left': leftPosition + 74,
                        'top': topPosition + ($input.height() / 2) - 13
                    }));
                },
                checkIfExist: function() {
                    var duplicateExists = false;

                    var arrayData = JSON.parse(options.CompareWithArray.val());

                    for (i = 0; i < arrayData.length; i++) {
                        if (options.DontCompareWith != 0) {
                            if (options.DontCompareWith != arrayData[i].value)
                                if ($input.val() == arrayData[i].text)
                                    duplicateExists = true;
                        } else {
                            if ($input.val() == arrayData[i].text)
                                duplicateExists = true;
                        }
                    }

                    return duplicateExists;
                },
                compareWithAnother: function() {
                    return $input.val() == options.CompareWith.val();
                },
                removeErrorMessage: function() {
                    $validationDiv.remove();
                    $validationLine.remove();
                },
                compareGreaterThanToday: function() {
                    if (new Date($input.val()) < new Date(options.ServerDateTime))
                        return false;

                    return true;
                },
                compareGreaterThan: function() {
                    if (new Date($input.val()) <= new Date(options.GreaterThan.val()))
                        return false;
                    return true;
                },
                CheckUpperLimitTime: function() {
                    var serverDateTime = new Date(options.ServerDateTime);

                    var fieldTime = new Date(serverDateTime.getMonth() + 1 + "/" + serverDateTime.getDate() + "/" + serverDateTime.getFullYear() + " " + $input.val() + ":00");

                    var maxTime = new Date(serverDateTime.getMonth() + 1 + "/" + serverDateTime.getDate() + "/" + serverDateTime.getFullYear() + " " + options.UpperLimitTime);

                    if (fieldTime > maxTime)
                        return false;
                    return true;

                },
                CheckLowerLimitTime: function() {
                    var serverDateTime = new Date(options.ServerDateTime);

                    var fieldTime = new Date(serverDateTime.getMonth() + 1 + "/" + serverDateTime.getDate() + "/" + serverDateTime.getFullYear() + " " + $input.val() + ":00");

                    var minTime = new Date(serverDateTime.getMonth() + 1 + "/" + serverDateTime.getDate() + "/" + serverDateTime.getFullYear() + " " + options.LowerLimitTime);

                    if (fieldTime < minTime)
                        return false;
                    return true;
                }
            };

            self.initialize();

        });
    };
})(jQuery);