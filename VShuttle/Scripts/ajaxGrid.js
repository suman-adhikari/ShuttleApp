
(function ($) {

    $.fn.ajaxGrid = function (options) {

        return this.each(function () {
            var counter = 0;

            var $table = $(this);
            var pageUl;
            var $Previous = "Previous";
            var $Next = "Next";
            var $NoRecordsFound = "No Records Found";

            var advanceSorting = "";
            var sortingCycle = ["", "asc", "desc"];

            if (options.Previous != null || options.Previous != "") {
                $Previous = options.Previous;
            }

            if (options.Next != null || options.Next != "") {
                $Next = options.Next;
            }

            if (options.NoRecordsFound != null || options.NoRecordsFound != "") {
                $NoRecordsFound = options.NoRecordsFound;
            }

            var self = {
                initialize: function () {

                    var currentPage=1;
                    var currentOffset = 0;

                    if(options.currentPage != null && options.currentPage != "" ){
                        currentPage = options.currentPage;
                        currentOffset = (currentPage - 1)*options.pageSize;
                    }

                    self.createTable(currentOffset, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, currentPage);

                    $table.on("refreshGrid", function (event, jsonParameters) {
                        
                        if (options.filterData != null)
                            options.filterData = self.concatJson(options.filterData, jsonParameters);
                        else
                            options.filterData = jsonParameters;



                        self.createTable(currentOffset, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, currentPage);
                    });

                    $table.on("loadMore", function (event, jsonParameters) {
                        if (options.filterData != null)
                            options.filterData = self.concatJson(options.filterData, jsonParameters);
                        else
                            options.filterData = jsonParameters;

                        self.appendTable(currentOffset, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, currentPage);
                    });

                    $table.on("changeMessage", function(event, message){
                        $NoRecordsFound  = message;
                    });

                    if ($table.hasClass("table-sorted")) {

                        $.each($table.find(options.tableHeading).parent('th'), function () {
                            if (!$(this).hasClass("sorting-false")) {
                                $(this).addClass('sorting');
                            }
                        });

                        //$table.find(options.tableHeading).parent('th').addClass('sorting');

                        $table.find(options.tableHeading).parent('th.sorting').bind("click", function (e) {
                            self.sorting(this, options.pageSize, e);
                        });
                    }

                    if (options.refreshEverySeconds != null) {
                        setInterval(function () {
                            self.createTable(0, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, 1);
                        }, options.refreshEverySeconds * 1000);
                    }
                },
                compareObjectValue: function (object, valueToCompare) {

                    var matches = false;

                    for (var comp = 0; comp < object.length; comp++) {
                        if (object[comp].name == valueToCompare) {
                            matches = true;
                            break;
                        }
                    }

                    return matches;

                },

                appendTable: function (offset, pageSize, sortExpression, sortOrder, pageNumber) {

                    if (options.hideControlDuringTableCreation != null)
                        options.hideControlDuringTableCreation.css("visibility", "hidden");

                    var parameter = {
                        'offset': offset,
                        'rowNumber': pageSize,
                        'sortExpression': sortExpression,
                        'sortOrder': sortOrder,
                        'pageNumber': pageNumber
                    };

                    if (options.filterData != null)
                        parameter = self.concatJson(parameter, options.filterData);

                    if (options.advanceSorting != null)
                        parameter = self.concatJson(parameter, {advanceSorting: advanceSorting});

                    var parameterJson = null;

                    if (options.addParameterToRow != null) {
                        parameterJson = JSON.parse(parameter.param);
                    }

                    $.ajax({
                        url: options.url,
                        type: options.requestType,
                        dataType: "json",
                        data: parameter,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                            options.loadingImage.css("visibility", "visible");
                        },
                        complete: function (data) {

                            var responseData = JSON.parse(data.responseText);

                            options.loadingImage.css("visibility", "hidden");

                            if (options.afterAjaxCallComplete != null) {
                                if (responseData.AdditionalData != null) {
                                    if (counter == 0) {
                                        options.afterAjaxCallComplete(responseData.AdditionalData);
                                        counter++;
                                    }
                                } else {
                                    options.afterAjaxCallComplete();
                                }
                            }

                            if (options.afterSelfCallComplete != null) {
                                options.afterSelfCallComplete($table);
                            }

                            if (options.afterAjaxCallAllTime != null) {
                                options.afterAjaxCallAllTime();
                            }
                        },
                        success: function (data) {
                            
                            if (options.getAjaxResultData != null && options.getAjaxResultData.toSetVariableName != null) {
                                var variableName = options.getAjaxResultData.toSetVariableName;

                                if (data[options.getAjaxResultData.keyValueName] !== undefined) {
                                    window[variableName] = data[options.getAjaxResultData.keyValueName];
                                }
                            }


                            /*if (typeof(options.footer) != "undefined" && typeof(options.footer.SumHeaders) != "undefined") {
                             for (var i = 0; i < options.footer.SumHeaders.length; i++) {
                             var sum = 0;
                             $.each(data.Data, function (key, val) {
                             sum = sum + parseInt(val[options.footer.SumHeaders[i]]);
                             });
                             $table.find('tfoot tr a[field-name=' + options.footer.SumHeaders[i] + ']').html(sum);
                             }
                             }*/

                            self.CreatingDataRow(data.Data, parameterJson);

                            /* $table.find('tbody').html('');

                             if (pageUl != null)
                             pageUl.remove();

                             var background = "#EAEBED";
                             if (data.Header > 0) {
                             if (data.hasOwnProperty('titleCol'))
                             self.CreatingDataHeader(data.Data, parameterJson, background, data.titleCol);
                             else
                             self.CreatingDataHeader(data.Data, parameterJson, background);
                             }
                             else {
                             self.CreatingDataRow(data.Data, parameterJson);
                             }
                             self.createPaging(data.RowCount, pageNumber, options.pageSize);*/
                        }
                    });
                },

                createTable: function (offset, pageSize, sortExpression, sortOrder, pageNumber) {
                  
                    if (options.hideControlDuringTableCreation != null)
                        options.hideControlDuringTableCreation.css("visibility", "hidden");

                    var parameter = {
                        'offset': offset,
                        'rowNumber': pageSize,
                        'sortExpression': sortExpression,
                        'sortOrder': sortOrder,
                        'pageNumber': pageNumber
                    };

                    if (options.filterData != null)
                        parameter = self.concatJson(parameter, options.filterData);

                    if (options.advanceSorting != null)
                        parameter = self.concatJson(parameter, {advanceSorting: advanceSorting});

                    var parameterJson = null;

                    if (options.addParameterToRow != null) {
                        parameterJson = JSON.parse(parameter.param);
                    }

                    $.ajax({
                        url: options.url,
                        type: options.requestType,
                        dataType: "json",
                        data: parameter,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                            options.loadingImage.css("visibility", "visible");
                        },
                        complete: function (data) {

                            var responseData = JSON.parse(data.responseText);

                            options.loadingImage.css("visibility", "hidden");

                            if (options.afterAjaxCallComplete != null) {
                                if (responseData.AdditionalData != null) {
                                    if (counter == 0) {
                                        options.afterAjaxCallComplete(responseData.AdditionalData);
                                        counter++;
                                    }
                                } else {
                                    options.afterAjaxCallComplete();
                                }
                            }

                            if (options.afterSelfCallComplete != null) {
                                options.afterSelfCallComplete($table);
                            }

                            if (options.afterAjaxCallAllTime != null) {
                                options.afterAjaxCallAllTime();
                            }

                        },
                        success: function (data) {

                            if (typeof(options.footer) != "undefined" && typeof(options.footer.SumHeaders) != "undefined") {
                                for (var i = 0; i < options.footer.SumHeaders.length; i++) {
                                    var sum = 0;
                                    $.each(data.Data, function (key, val) {
                                        sum = sum + parseInt(val[options.footer.SumHeaders[i]]);
                                    });
                                    $table.find('tfoot tr a[field-name=' + options.footer.SumHeaders[i] + ']').html(sum);
                                }

                            }

                            if (options.getAjaxResultData != null && options.getAjaxResultData.toSetVariableName != null) {
                                var variableName = options.getAjaxResultData.toSetVariableName;

                                if (data[options.getAjaxResultData.keyValueName] !== undefined) {
                                    window[variableName] = data[options.getAjaxResultData.keyValueName];
                                }
                            }

                            $table.find('tbody').html('');

                            if (pageUl != null)
                                pageUl.remove();

                            var background = "#EAEBED";
                            if (data.Header > 0) {
                                if (data.hasOwnProperty('titleCol'))
                                    self.CreatingDataHeader(data.Data, parameterJson, background, data.titleCol);
                                else
                                    self.CreatingDataHeader(data.Data, parameterJson, background);
                            }
                            else {
                                self.CreatingDataRow(data.Data, parameterJson);
                            }
                            self.createPaging(data.RowCount, pageNumber, options.pageSize);
                        }
                    });
                },
                CreatingDataHeader: function (Data, parameterJson, background, titleCol) {

                    titleCol = (titleCol === undefined) ? false : titleCol;

                    var noOfColumns = $table.find("tr:first th").length;
                    $.each(Data, function (headerIndex, headerValue) {

                        if (headerIndex >= 0) {
                            self.CreatingDataRow(Data, parameterJson);
                            return false;
                        } else {
                            var $tr = $("<tr />");
                            if (titleCol == false) {
                                var $td = $("<td colspan='" + noOfColumns + "' />");

                                $td.css({
                                    "text-align": "center",
                                    "vertical-align": "middle",
                                    "background-color": background,
                                    "color": "#3B6998",
                                    "font-size": "12px",
                                    "font-weight": "bold",
                                    "border": '0'
                                });

                                var div = $("<div/>");
                                div.append(headerIndex);
                                if (options.dataRowHeaderClass != null) {
                                    $.each(options.dataRowHeaderClass, function () {
                                        if (this["class"] != null && this.noCondition == true) {
                                            div.addClass(this["class"]);
                                        }
                                    });
                                }
                                $td.append(div);
                                $tr.append($td);
                            } else {
                                var cols = $table.find("thead tr th:visible").length;
                                for (var i = 1; i <= cols; i++) {
                                    var $td = $("<td />");

                                    $td.css({
                                        "text-align": "center",
                                        "vertical-align": "middle",
                                        "background-color": background,
                                        "color": "#3B6998",
                                        "font-size": "12px",
                                        "font-weight": "bold",
                                        "border": '0'
                                    });

                                    var div = $("<div/>");
                                    div.append(headerIndex);
                                    if (options.dataRowHeaderClass != null) {
                                        $.each(options.dataRowHeaderClass, function () {
                                            if (this["class"] != null && this.noCondition == true) {
                                                div.addClass(this["class"]);
                                            }
                                        });
                                    }
                                    if (i == titleCol)
                                        $td.append(div);

                                    $tr.append($td);
                                }
                            }

                            $table.find('tbody').append($tr);
                            var background1 = "#F7F7F7";
                            if (titleCol != false)
                                self.CreatingDataHeader(headerValue, parameterJson, background1, titleCol);
                            else
                                self.CreatingDataHeader(headerValue, parameterJson, background1);

                        }

                    });
                },
                CreatingDataRow: function (rowData, parameterJson) {
                    var jsonMergeRowData = {};

                    if (options.tableHeaderProperties != null) {
                        $.each(options.tableHeaderProperties, function () {
                            if (this.tableHeaderClass != null) {
                                if (this.widthValue) {
                                    $table.find('th.' + this.tableHeaderClass).css('width', this.widthValue);
                                }
                                if (this.minWidthValue)
                                    $table.find('th.' + this.tableHeaderClass).css('min-width', this.minWidthValue);
                            }
                            if (this.fieldName != null) {
                                if (this.widthValue) {
                                    $table.find('th a[field-name="' + this.fieldName + '"]').parent("th").css('width', this.widthValue);
                                }
                                if (this.minWidthValue)
                                    $table.find('th a[field-name="' + this.fieldName + '"]').parent("th").css('min-width', this.minWidthValue);
                            }


                        });


                    }

                    $.each(rowData, function (dataIndex, item) {

                        var $tr = $("<tr/>");

                        if (parameterJson != null) {
                            $tr.attr(options.addParameterToRow, parameterJson[options.addParameterToRow]);
                        }

                        $tr.attr('id', item[options.id]);

                        var $combineTd = $("<td/>");

                        var startAppending = false;

                        $table.find('thead th').each(function () {

                            var addTd = [];

                            if (options.rowClass != null) {

                                if (options.rowClass.noCondition != null && options.rowClass.noCondition == true) {
                                    $tr.addClass(options.rowClass["class"]);
                                } else {
                                    for (var rowClassVal = 0; rowClassVal < options.rowClass.length; rowClassVal++) {
                                        if (item[options.rowClass[rowClassVal].header] == options.rowClass[rowClassVal].value) {
                                            $tr.addClass(options.rowClass[rowClassVal]["class"]);
                                        }
                                    }

                                }
                            }

                            var $td = $("<td/>");

                            if ($(this).find('a').length != 0) {

                                if (options.contentAdditionalProperty != null && self.compareObjectValue(options.contentAdditionalProperty, $(this).find('a').attr('field-name'))) {

                                    var hasMergeContent = [];

                                    for (var cap = 0; cap < options.contentAdditionalProperty.length; cap++) {

                                        if ($(this).find('a').attr('field-name') == options.contentAdditionalProperty[cap].name) {

                                            if (options.contentAdditionalProperty[cap].mergeRepeatedName != null && options.contentAdditionalProperty[cap].mergeRepeatedName) {

                                                if (!$.isEmptyObject(jsonMergeRowData) && jsonMergeRowData.hasOwnProperty(options.contentAdditionalProperty[cap].name) &&
                                                    jsonMergeRowData[options.contentAdditionalProperty[cap].name].Value == item[options.contentAdditionalProperty[cap].mergeRespectTo]) {
                                                    addTd[options.contentAdditionalProperty[cap].name] = false;
                                                } else {
                                                    addTd[options.contentAdditionalProperty[cap].name] = true;
                                                }

                                                hasMergeContent[options.contentAdditionalProperty[cap].name] = true;

                                                var valueToCompare = rowData[dataIndex][options.contentAdditionalProperty[cap].mergeRespectTo];
                                                var startingIndex = dataIndex + 1;
                                                var offset = 1;

                                                for (i = startingIndex; i < rowData.length; i++) {
                                                    if (valueToCompare == rowData[i][options.contentAdditionalProperty[cap].mergeRespectTo]) {
                                                        offset++;
                                                    } else {
                                                        break;
                                                    }
                                                }

                                                jsonMergeRowData[options.contentAdditionalProperty[cap].name] = {
                                                    Value: valueToCompare,
                                                    Offset: offset
                                                };
                                            }
                                            if (options.contentAdditionalProperty[cap].name == $(this).find('a').attr('field-name')) {
                                                var additionalControl = options.contentAdditionalProperty[cap].control.clone();

                                                if (options.contentAdditionalProperty[cap].type != null && options.contentAdditionalProperty[cap].type == 'Text') {
                                                    for (k = 0; k < options.contentAdditionalProperty[cap].properties.length; k++) {

                                                        if (options.contentAdditionalProperty[cap].properties[k].addText != null && options.contentAdditionalProperty[cap].properties[k].addText != "") {
                                                            if (item[options.contentAdditionalProperty[cap].properties[k].text] != undefined){

                                                                var separator="";

                                                                if(options.contentAdditionalProperty[cap].properties[k].separator!=null){
                                                                    separator=options.contentAdditionalProperty[cap].properties[k].separator;
                                                                }

                                                                additionalControl.text(item[options.contentAdditionalProperty[cap].properties[k].text] + separator + item[options.contentAdditionalProperty[cap].properties[k].addText]);
                                                            }

                                                        }
                                                        else {
                                                            additionalControl.text(item[options.contentAdditionalProperty[cap].properties[k].text]);
                                                            additionalControl.attr('title', (item[options.contentAdditionalProperty[cap].properties[k].text]));
                                                        }

                                                    }
                                                } else if (options.contentAdditionalProperty[cap].type != null && options.contentAdditionalProperty[cap].type == 'Image') {
                                                    for (k = 0; k < options.contentAdditionalProperty[cap].properties.length; k++) {

                                                        if ($.isArray(options.contentAdditionalProperty[cap].properties[k].value)) {
                                                            if ($.inArray(item[options.contentAdditionalProperty[cap].name], options.contentAdditionalProperty[cap].properties[k].value))
                                                                additionalControl.attr(options.contentAdditionalProperty[cap].properties[k].property, options.contentAdditionalProperty[cap].properties[k].value);

                                                        } else if (options.contentAdditionalProperty[cap].properties[k].whenValue == item[options.contentAdditionalProperty[cap].name]) {
                                                            additionalControl.attr(options.contentAdditionalProperty[cap].properties[k].property, options.contentAdditionalProperty[cap].properties[k].value);
                                                        }
                                                    }
                                                }
                                                else {
                                                    for (k = 0; k < options.contentAdditionalProperty[cap].properties.length; k++) {
                                                        if (options.contentAdditionalProperty[cap].properties[k].type != null && options.contentAdditionalProperty[cap].properties[k].type == "Text") {
                                                            additionalControl.find(options.contentAdditionalProperty[cap].properties[k].field).text(item[options.contentAdditionalProperty[cap].properties[k].value]);
                                                        } else if (options.contentAdditionalProperty[cap].properties[k].type != null && options.contentAdditionalProperty[cap].properties[k].type == "Custom") {

                                                            additionalControl.find(options.contentAdditionalProperty[cap].properties[k].field).attr(options.contentAdditionalProperty[cap].properties[k].property, item[options.contentAdditionalProperty[cap].properties[k].value]);
                                                        } else if (options.contentAdditionalProperty[cap].properties[k].type != null && options.contentAdditionalProperty[cap].properties[k].type == "hidden") {

                                                            additionalControl.append('<input type="hidden"  value="' + item[options.contentAdditionalProperty[cap].hiddenValue] + '"/>');
                                                            additionalControl.append('<span>' + item[options.contentAdditionalProperty[cap].name] + '</span>');
                                                        }
                                                        else if (options.contentAdditionalProperty[cap].properties[k].type != null && options.contentAdditionalProperty[cap].properties[k].type == "link") {
                                                            if (options.contentAdditionalProperty[cap].linkSelectedData != null && options.contentAdditionalProperty[cap].linkSelectedData != "") {
                                                                if (item[options.contentAdditionalProperty[cap].name] != "" && item[options.contentAdditionalProperty[cap].name] != null) {
                                                                    additionalControl.append('<a href= ' + item[options.contentAdditionalProperty[cap].name] + ' target="_blank">' + item[options.contentAdditionalProperty[cap].name] + '</a>');
                                                                }
                                                                else {
                                                                    additionalControl.append('<a href="#" target="_blank"></a>');
                                                                }

                                                            }
                                                            else {
                                                                additionalControl.append('<span>' + item[options.contentAdditionalProperty[cap].name] + '</span>');
                                                            }
                                                        }
                                                        else {
                                                            additionalControl.find(options.contentAdditionalProperty[cap].properties[k].field).val(item[options.contentAdditionalProperty[cap].properties[k].value]);
                                                        }
                                                    }
                                                }

                                                if (options.contentAdditionalProperty[cap].replaceText != null) {
                                                    for (var rt = 0; rt < options.contentAdditionalProperty[cap].replaceText.length; rt++) {
                                                        if (options.contentAdditionalProperty[cap].replaceText[rt].field == 'self') {
                                                            additionalControl.attr(options.contentAdditionalProperty[cap].replaceText[rt].property,
                                                                additionalControl.attr(options.contentAdditionalProperty[cap].replaceText[rt].property).replace(options.contentAdditionalProperty[cap].replaceText[rt].textField,
                                                                    item[options.contentAdditionalProperty[cap].replaceText[rt].value].replace(' ', "")));
                                                        }
                                                    }
                                                }
                                                if (options.contentAdditionalProperty[cap].appendStyle != null && options.contentAdditionalProperty[cap].appendStyle) {

                                                    if (options.contentAdditionalProperty[cap].styleDataSource && options.contentAdditionalProperty[cap].styleDataSource == "database") {
                                                        for (k = 0; k < options.contentAdditionalProperty[cap].properties.length; k++) {

                                                            additionalControl.css(options.contentAdditionalProperty[cap].properties[k].cssType, (item[options.contentAdditionalProperty[cap].properties[k].Value]));
                                                        }
                                                    } else {
                                                        for (k = 0; k < options.contentAdditionalProperty[cap].properties.length; k++) {

                                                            additionalControl.css(options.contentAdditionalProperty[cap].properties[k].text, options.contentAdditionalProperty[cap].properties[k].Value);
                                                        }
                                                    }


                                                }
                                            }
                                            if (hasMergeContent.hasOwnProperty(options.contentAdditionalProperty[cap].name) && hasMergeContent[options.contentAdditionalProperty[cap].name]) {
                                                $td.attr('rowspan', jsonMergeRowData[options.contentAdditionalProperty[cap].name].Offset);
                                            }

                                        }


                                        if (options.contentAdditionalProperty[cap].hasOwnProperty("action")) {
                                            options.contentAdditionalProperty[cap].action(item, additionalControl);
                                        }
                                    }

                                    $td.html(additionalControl);

                                }
                                else if (options.appendProperty != null && self.compareObjectValue(options.appendProperty, $(this).find('a').attr('field-name'))) {
                                    var additionalControlAppend = '';
                                    for (var cap = 0; cap < options.appendProperty.length; cap++) {
                                        if (options.appendProperty[cap].name == $(this).find('a').attr('field-name')) {
                                            if (options.appendProperty[cap].property.whenValue == item[options.appendProperty[cap].property.field]) {
                                                additionalControlAppend += options.appendProperty[cap].control;
                                            }

                                        }

                                    }
                                    $td.html(item[$(this).find('a').attr('field-name')] + additionalControlAppend);
                                }
                                else {
                                    $td.html(item[$(this).find('a').attr('field-name')]);
                                }
                            }
                            else if ($(this).find('a').length == 0 && ((options.preContentType != null && options.preContentType == 'Multiple'
                                && $(this).index() < options.preContent.length) || $(this).index() == 0)) {

                                if (options.preContent != null) {

                                    var preControl;

                                    var i = 0;
                                    var count = 0;

                                    if (options.preContentType != null && options.preContentType == 'Multiple') {
                                        i = $(this).index();
                                        count = $(this).index() + 1;
                                    } else {
                                        count = options.preContent.length;
                                    }

                                    while (i < count) {

                                        var control = options.preContent[i].control.clone();

                                        if (options.preContent[i].properties != null) {

                                            for (var pt = 0; pt < options.preContent[i].properties.length; pt++) {
                                                if (options.preContent[i].properties[pt].propertyField == "this") {
                                                    if (options.preContent[i].properties[pt].setWhen != null) {

                                                        if (options.preContent[i].properties[pt].setWhen.relation == "equal") {
                                                            if (control.attr(options.preContent[i].properties[pt].setWhen.property) == item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                control.attr(options.preContent[i].properties[pt].property, options.preContent[i].properties[pt].propertyValue);
                                                        } else {
                                                            if (control.attr(options.preContent[i].properties[pt].setWhen.property) != item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                control.attr(options.preContent[i].properties[pt].property, options.preContent[i].properties[pt].propertyValue);
                                                        }

                                                    } else {
                                                        control.attr(options.preContent[i].properties[pt].property, item[options.preContent[i].properties[pt].propertyValue]);
                                                    }
                                                } else {
                                                    if (options.preContent[i].properties[pt].setWhen != null) {

                                                        if (options.preContent[i].properties[pt].setWhen.relation == "equal") {
                                                            if (control.attr(options.preContent[i].properties[pt].setWhen.property) == item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                control.find(options.preContent[i].propertyField).attr(options.preContent[i].properties[pt].property,
                                                                    options.preContent[i].properties[pt].propertyValue);
                                                        } else {
                                                            if (control.attr(options.preContent[i].properties[pt].setWhen.property) != item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                control.find(options.preContent[i].propertyField).attr(options.preContent[i].properties[pt].property,
                                                                    options.preContent[i].properties[pt].propertyValue);
                                                        }

                                                    } else {
                                                        control.find(options.preContent[i].properties[pt].propertyField).attr(options.preContent[i].properties[pt].property,
                                                            item[options.preContent[i].properties[pt].propertyValue]);
                                                    }
                                                }
                                            }
                                        }

                                        if (options.preContent[i].additionalControl != null) {

                                            for (j = 0; j < options.preContent[i].additionalControl.length; j++) {

                                                var additionalControl = options.preContent[i].additionalControl[j].control;

                                                if (options.preContent[i].additionalControl[j].displayedWhen.relation == "equal") {
                                                    if (item[options.preContent[i].additionalControl[j].displayedWhen.header] == options.preContent[i].additionalControl[j].displayedWhen.value) {

                                                        if (options.preContent[i].additionalControl[j].disabledWhen != null) {

                                                            var pauseContinueDisabled = false;
                                                            for (p = 0; p < options.preContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                    if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                    if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                    var dNow = new Date(options.preContent[i].additionalControl[j].disabledWhen[p].value);
                                                                    var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.preContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                    if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                        pauseContinueDisabled = true;
                                                                    else
                                                                        pauseContinueDisabled = false;
                                                                }
                                                            }
                                                            additionalControl.prop('disabled', pauseContinueDisabled);
                                                        }

                                                        control.append(additionalControl);

                                                        if (options.preContent[i].additionalControl[j].formAction != null) {
                                                            control.attr('action', options.preContent[i].additionalControl[j].formAction);
                                                        }
                                                    }
                                                } else if (options.preContent[i].additionalControl[j].displayedWhen.relation == "not-equal") {
                                                    if (item[options.preContent[i].additionalControl[j].displayedWhen.header] != options.preContent[i].additionalControl[j].displayedWhen.value) {

                                                        if (options.preContent[i].additionalControl[j].disabledWhen != null) {
                                                            var pauseContinueDisabled = false;
                                                            for (p = 0; p < options.preContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                    if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                    if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                    var dNow = new Date(options.preContent[i].additionalControl[j].disabledWhen[p].value);
                                                                    var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.preContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                    if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                        pauseContinueDisabled = true;
                                                                    else
                                                                        pauseContinueDisabled = false;
                                                                }
                                                            }
                                                            additionalControl.prop('disabled', pauseContinueDisabled);
                                                        }

                                                        control.append(additionalControl);

                                                        if (options.preContent[i].additionalControl[j].formAction != null) {
                                                            control.attr('action', options.preContent[i].additionalControl[j].formAction);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (options.preContent[i].disabledWhen != null) {

                                            if (options.preContent[i].disabledWhen.relation == 'equal') {

                                                if ($.inArray(item[options.preContent[i].disabledWhen.header], options.preContent[i].disabledWhen.value) != -1) {
                                                    if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                        control.prop('disabled', true)
                                                    } else {
                                                        control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                    }
                                                } else {
                                                    if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                        control.prop('disabled', false)
                                                    } else {
                                                        control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                    }
                                                }
                                            } else {
                                                if ($.inArray(item[options.preContent[i].disabledWhen.header], options.preContent[i].disabledWhen.value) == -1) {
                                                    if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                        control.prop('disabled', true)
                                                    } else {
                                                        control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                    }
                                                } else {
                                                    if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                        control.prop('disabled', false)
                                                    } else {
                                                        control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                    }
                                                }
                                            }
                                        }

                                        if (options.preContentType != null && options.preContentType == 'Multiple') {
                                            preControl = control;
                                        }
                                        else {
                                            if (preControl == null)
                                                preControl = control;
                                            else {

                                                if (options.preContent[i].removeWhen == null)
                                                    preControl = preControl.add("<span> | </span>").add(control);
                                                else {
                                                    if (item[options.preContent[i].removeWhen.property] != options.preContent[i].removeWhen.value)
                                                        preControl = preControl.add("<span> | </span>").add(control);
                                                }
                                            }
                                        }

                                        i++;
                                    }

                                    if (preControl != null)
                                        $td.html(preControl.clone());
                                }
                            } else if ($(this).find('a').length == 0 && $(this).parent().find('th').length - 1 == $(this).index()) {

                                if (options.postContent != null) {

                                    var postControl;

                                    for (i = 0; i < options.postContent.length; i++) {

                                        var control = options.postContent[i].control.clone();

                                        if (options.postContent[i].properties != null) {
                                            for (var pt = 0; pt < options.postContent[i].properties.length; pt++) {

                                                if (options.postContent[i].properties[pt].propertyField == "this") {
                                                    if (options.postContent[i].properties[pt].setWhen != null) {

                                                        if (options.postContent[i].properties[pt].setWhen.relation == "equal") {
                                                            if (control.attr(options.postContent[i].properties[pt].setWhen.property) == item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                control.attr(options.postContent[i].properties[pt].property, options.postContent[i].properties[pt].propertyValue);
                                                        } else {
                                                            if (control.attr(options.postContent[i].properties[pt].setWhen.property) != item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                control.attr(options.postContent[i].properties[pt].property, options.postContent[i].properties[pt].propertyValue);
                                                        }

                                                    } else {
                                                        control.attr(options.postContent[i].properties[pt].property, item[options.postContent[i].properties[pt].propertyValue]);
                                                    }
                                                } else {
                                                    if (options.postContent[i].properties[pt].setWhen != null) {

                                                        if (options.postContent[i].properties[pt].setWhen.relation == "equal") {
                                                            if (control.attr(options.postContent[i].properties[pt].setWhen.property) == item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                control.find(options.postContent[i].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                    options.postContent[i].properties[pt].propertyValue);
                                                        } else {
                                                            if (control.attr(options.postContent[i].properties[pt].setWhen.property) != item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                control.find(options.postContent[i].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                    options.postContent[i].properties[pt].propertyValue);
                                                        }

                                                    } else {

                                                        if (options.postContent[i].properties[pt].propertyField == null) {
                                                            control.attr(options.postContent[i].properties[pt].property, item[options.postContent[i].properties[pt].propertyValue].replace(/ /g, '') + 'button');
                                                        }
                                                        else {
                                                            control.find(options.postContent[i].properties[pt].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                item[options.postContent[i].properties[pt].propertyValue]);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (options.postContent[i].additionalControl != null) {

                                            for (j = 0; j < options.postContent[i].additionalControl.length; j++) {

                                                var additionalControl = options.postContent[i].additionalControl[j].control;
                                                if (options.postContent[i].additionalControl[j].properties != null) {

                                                    for (var pt = 0; pt < options.postContent[i].additionalControl[j].properties.length; pt++) {

                                                        if (options.postContent[i].additionalControl[j].properties[pt].propertyField == "this") {
                                                            if (options.postContent[i].additionalControl[j].properties[pt].setWhen != null) {

                                                                if (options.postContent[i].additionalControl[j].properties[pt].setWhen.relation == "equal") {
                                                                    if (additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].setWhen.property) == item[options.postContent[i].additionalControl[j].properties[pt].setWhen.propertyValue])
                                                                        additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].property, options.postContent[i].additionalControl[j].properties[pt].propertyValue);
                                                                } else {
                                                                    if (additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].setWhen.property) != item[options.postContent[i].additionalControl[j].properties[pt].setWhen.propertyValue])
                                                                        additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].property, options.postContent[i].additionalControl[j].properties[pt].propertyValue);
                                                                }

                                                            } else {
                                                                additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].property, item[options.postContent[i].additionalControl[j].properties[pt].propertyValue]);
                                                            }
                                                        } else {
                                                            if (options.postContent[i].additionalControl[j].properties[pt].setWhen != null) {

                                                                if (options.postContent[i].additionalControl[j].properties[pt].setWhen.relation == "equal") {
                                                                    if (additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].setWhen.property) == item[options.postContent[i].additionalControl[j].properties[pt].setWhen.propertyValue])
                                                                        additionalControl.find(options.postContent[i].additionalControl[j].propertyField).attr(options.postContent[i].additionalControl[j].properties[pt].property,
                                                                            options.postContent[i].additionalControl[j].properties[pt].propertyValue);
                                                                } else {
                                                                    if (additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].setWhen.property) != item[options.postContent[i].additionalControl[j].properties[pt].setWhen.propertyValue])
                                                                        additionalControl.find(options.postContent[i].additionalControl[j].propertyField).attr(options.postContent[i].additionalControl[j].properties[pt].property,
                                                                            options.postContent[i].additionalControl[j].properties[pt].propertyValue);
                                                                }

                                                            } else {

                                                                if (options.postContent[i].additionalControl[j].properties[pt].propertyField == null) {
                                                                    additionalControl.attr(options.postContent[i].additionalControl[j].properties[pt].property, item[options.postContent[i].additionalControl[j].properties[pt].propertyValue].replace(/ /g, '') + 'button');
                                                                }
                                                                else {
                                                                    additionalControl.find(options.postContent[i].additionalControl[j].properties[pt].propertyField).attr(options.postContent[i].additionalControl[j].properties[pt].property,
                                                                        item[options.postContent[i].additionalControl[j].properties[pt].propertyValue]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }

                                                if (options.postContent[i].additionalControl[j].displayedWhen.relation == "equal") {
                                                    if (item[options.postContent[i].additionalControl[j].displayedWhen.header] == options.postContent[i].additionalControl[j].displayedWhen.value) {

                                                        if (options.postContent[i].additionalControl[j].disabledWhen != null) {

                                                            var pauseContinueDisabled = false;
                                                            for (p = 0; p < options.postContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                    if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                    if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                    var dNow = new Date(options.postContent[i].additionalControl[j].disabledWhen[p].value);
                                                                    var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.postContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                    if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                        pauseContinueDisabled = true;
                                                                    else
                                                                        pauseContinueDisabled = false;
                                                                }
                                                            }
                                                            additionalControl.prop('disabled', pauseContinueDisabled);
                                                        }

                                                        control.append(additionalControl);

                                                        if (options.postContent[i].additionalControl[j].formAction != null) {
                                                            control.attr('action', options.postContent[i].additionalControl[j].formAction);
                                                        }
                                                    }
                                                } else if (options.postContent[i].additionalControl[j].displayedWhen.relation == "not-equal") {
                                                    if (item[options.postContent[i].additionalControl[j].displayedWhen.header] != options.postContent[i].additionalControl[j].displayedWhen.value) {

                                                        if (options.postContent[i].additionalControl[j].disabledWhen != null) {
                                                            var pauseContinueDisabled = false;
                                                            for (p = 0; p < options.postContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                    if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                    if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                        pauseContinueDisabled = true;
                                                                    } else {
                                                                        pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                    var dNow = new Date(options.postContent[i].additionalControl[j].disabledWhen[p].value);
                                                                    var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.postContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                    if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                        pauseContinueDisabled = true;
                                                                    else
                                                                        pauseContinueDisabled = false;
                                                                }
                                                            }
                                                            additionalControl.prop('disabled', pauseContinueDisabled);
                                                        }

                                                        control.append(additionalControl);

                                                        if (options.postContent[i].additionalControl[j].formAction != null) {
                                                            control.attr('action', options.postContent[i].additionalControl[j].formAction);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (options.postContent[i].disabledWhen != null) {

                                            if (options.postContent[i].disabledWhen.relation == 'equal') {
                                                if ($.inArray(item[options.postContent[i].disabledWhen.header], options.postContent[i].disabledWhen.value) != -1) {
                                                    control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                } else {
                                                    control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                }
                                            } else {
                                                if ($.inArray(item[options.postContent[i].disabledWhen.header], options.postContent[i].disabledWhen.value) == -1) {
                                                    control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                } else {
                                                    control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                }
                                            }
                                        }

                                        if (options.postContent[i].append != null) {
                                            control.attr(options.postContent[i].append.property,
                                                control.attr(options.postContent[i].append.property)
                                                + item[options.postContent[i].append.value] + options.postContent[i].append.text);
                                        }


                                        if (postControl == null) {
                                            if ((options.postContent[i].removeWhen == null))
                                                postControl = control;//.add(control);
                                            else {

                                                if (options.postContent[i].removeWhen != null && $.inArray(item[options.postContent[i].removeWhen.property], options.postContent[i].removeWhen.value) == -1)
                                                    postControl = control;//add(control);
                                            }
                                        }
                                        else {
                                            var addControl = 1;
                                            if (options.postContent[i].removeWhen == null)
                                                addControl = 1;
                                            else {
                                                if ($.inArray(item[options.postContent[i].removeWhen.property], options.postContent[i].removeWhen.value) != -1) {
                                                    addControl = 0;
                                                }
                                            }
                                            if (addControl == 1) {
                                                postControl = postControl.add("<span> | </span>").add(control);
                                            } else {
                                                if (options.postContent[i].removeWhen.WrapperWidth == null)
                                                    options.postContent[i].removeWhen.WrapperWidth = "10px";
                                                postControl = postControl.add($('<div class="post-control-wrapper" style="width: ' + options.postContent[i].removeWhen.WrapperWidth + '"/>'));
                                            }
                                        }
                                    }

                                    if (postControl != null)
                                        $td.html(postControl.clone());

                                }
                            }

                            if (options.combineColumns != null) {

                                if ($($table).find("th a.merged-header").length > 0 && $(this).find('a').attr('field-name') == $($table).find("th a.merged-header").first().attr('field-name')) {
                                    startAppending = true;
                                }
                            }

                            if (startAppending) {
                                $combineTd.append($td.html());
                            }
                            if (options.combineColumns != null) {
                                if ($($table).find("th a.merged-header").length > 0 && $.inArray($(this).find('a').attr('field-name'), self.getArrayFromAttribute($($table).find("th a.merged-header").not($('table').find("th a.merged-header").first()), "field-name")) != -1) {
                                    $(this).addClass('hide');
                                }
                            }


                            if (!startAppending)
                                if ($(this).find('a').length == 0) {
                                    $tr.append($td);
                                } else if (!addTd.hasOwnProperty($(this).find('a').attr('field-name'))) {
                                    $tr.append($td);
                                } else if (addTd.hasOwnProperty($(this).find('a').attr('field-name')) && addTd[$(this).find('a').attr('field-name')]) {
                                    $tr.append($td);
                                }

                            if (options.combineColumns != null) {
                                if ($($table).find("th a.merged-header").length > 0 && $(this).find('a').attr('field-name') == $($table).find("th a.merged-header").last().attr('field-name')) {
                                    startAppending = false;
                                    /*if (options.combineColumns.FixedSize != null) {
                                     $.each(options.combineColumns.FixedSize, function (i, data) {
                                     if (data.Width ) {
                                     $combineTd.css('width', data.Width);
                                     }

                                     if (data.MaxWidth)
                                     $combineTd.css('max-width', data.MaxWidth);

                                     if (data.MinWidth)
                                     $combineTd.css('min-width', data.MinWidth);
                                     });

                                     }*/
                                    $tr.append($combineTd);
                                }
                            }


                        });

                        if (options.rowClick != null && options.rowClick.rowClickAble) {
                            if (options.rowClick.excludeColumn != null) {

                                var tdToExclue = 'td:nth(' + options.rowClick.excludeColumn + ')';

                                $tr.find('td').not(tdToExclue).bind('click', function () {
                                    options.rowClick.rowClickFunction(this);
                                });
                            } else {
                                $tr.bind('click', function () {
                                    options.rowClick.rowClickFunction(this);
                                });
                            }
                        }

                        $table.find('tbody').append($tr);
                    });
                },
                getArrayFromAttribute: function (selector, attributeName) {

                    var array = [];

                    selector.each(function () {
                        array.push($(this).attr(attributeName));
                    });

                    return array;
                },
                createPaging: function (rowCount, pageNumber, pageSize) {

                    pageUl = $('<ul class="pagination pull-right"/>');

                    var pageRange;
                    var pagesToShow;
                    pagesToShow = 5;
                    var prvPages;
                    var postPages;
                    if (pagesToShow % 2 == 0) {
                        prvPages = (pagesToShow / 2) - 1;
                        postPages = (pagesToShow / 2);
                    }
                    else {
                        prvPages = parseInt(pagesToShow / 2);
                        postPages = prvPages;
                    }

                    if ((rowCount / options.pageSize) > 1) {
                        pageRange = Math.ceil(rowCount / options.pageSize)
                    } else {
                        pageRange = parseInt(rowCount / options.pageSize);
                    }

                    var pageNumberShowLower;
                    var pageNumberShowUpper;
                    var showFirstPage = false;
                    var showLastPage = false;

                    if (pageRange > pagesToShow) {
                        if (pageNumber < pagesToShow) {
                            pageNumberShowLower = 1;
                            pageNumberShowUpper = pagesToShow;
                            showLastPage = true;
                        }
                        else {
                            pageNumberShowLower = parseInt(pageNumber) - parseInt(prvPages);
                            pageNumberShowUpper = parseInt(pageNumber) + parseInt(postPages);
                            showFirstPage = true;
                            showLastPage = true;
                        }
                    }
                    else {
                        pageNumberShowLower = 1;
                        pageNumberShowUpper = pageRange;
                    }

                    if (pageNumberShowUpper >= pageRange) {
                        pageNumberShowUpper = pageRange;
                        showLastPage = false;
                    }
                    if (pageNumberShowLower - 1 == 1) {
                        pageNumberShowLower = 1;
                        pageNumberShowUpper = pagesToShow + 1;
                        showFirstPage = false;
                    }
                    if (pageNumberShowUpper + 1 == pageRange) {
                        pageNumberShowUpper = pageRange;
                        showLastPage = false;
                    }

                    var $pageLink;
                    var $pageLi;


                    for (var i = pageNumberShowLower; i <= pageNumberShowUpper; i++) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', i);
                        $pageLink.addClass('page-button');
                        $pageLink.text(i);
                        if (i == pageNumber)
                            $pageLi.addClass('active');

                        $pageLi.append($pageLink);

                        pageUl.append($pageLi);

                        if (i == pageRange)
                            break;
                    }

                    if (showLastPage == true) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a class='dots'/>");
                        $pageLink.text('...');
                        $pageLi.append($pageLink);
                        pageUl.append($pageLi);

                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', pageRange);
                        $pageLink.addClass('page-button')
                        $pageLink.text(pageRange);
                        $pageLi.append($pageLink);
                        pageUl.append($pageLi);
                    }

                    if (showFirstPage == true) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.text('...');
                        $pageLi.prepend($pageLink);
                        pageUl.prepend($pageLi);

                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', 1);
                        $pageLink.addClass('page-button');
                        $pageLink.text(1);
                        $pageLi.prepend($pageLink);
                        pageUl.prepend($pageLi);
                    }

                    if (rowCount > 1) {
                        var $previousLi = $('<li/>');
                        var $previousPageLink = $("<a/>").text('Prev').addClass('previous');

                        if (pageNumber == 1) {
                            $previousLi.addClass('disabled');
                        }

                        $previousLi.append($previousPageLink);
                        pageUl.prepend($previousLi);
                    }

                    if (rowCount > 1) {
                        var $nextLi = $('<li/>');

                        var $nextPageLink = $("<a/>").text('Next').addClass('next');

                        if (pageNumber == pageNumberShowUpper) {
                            $nextLi.addClass('disabled');
                        }

                        $nextLi.append($nextPageLink);
                        pageUl.append($nextLi);
                    }

                    if (rowCount == 0) {
                        if (options.NoRecordsFoundCallBack != null) {
                            options.NoRecordsFoundCallBack();
                        }
                        var $noRecordTr = $('<tr/>');

                        var $noRecordTd = $('<td/>').attr('colspan', $table.find('th').length);
                        $noRecordTd.wrapInner('<div class="pull-left">' + $NoRecordsFound + '</div>');
                        $noRecordTr.append($noRecordTd);
                        $table.append($noRecordTr);

                    } else if (rowCount > options.pageSize) {
                        $table.after(pageUl);


                        pageUl.find('a').not('.previous').not('.next').not('.dots').on("click", function () {
                            self.changePage(this, pageSize, null, null);
                        });

                        pageUl.find('a.previous').on("click", function () {
                            self.changePage(this, pageSize, 'previous', pageNumber);
                        });

                        pageUl.find('a.next').on("click", function () {
                            self.changePage(this, pageSize, 'next', pageNumber);
                        });

                    }

                    if (options.afterPageCreated != null) {

                        options.afterPageCreated();
                    }
                },
                concatJson: function extend(a, b) {
                    for (var key in b)
                        if (b.hasOwnProperty(key))
                            a[key] = b[key];
                    return a;
                },
                changePage: function (thisObj, pageSize, pagerType, pageNumber) {

                    if (pagerType == null) {
                        var sortExpression = options.defaultSortExpression;
                        var sortOrder = options.defaultSortOrder;

                        if ($table.find(options.tableHeading + '[sort-expression=asc]').length > 0) {
                            sortExpression = $table.find(options.tableHeading + '[sort-expression=asc]').attr('field-name');
                            sortOrder = 'asc';
                        }
                        else if ($table.find(options.tableHeading + '[sort-expression=desc]').length > 0) {
                            sortExpression = $table.find(options.tableHeading + '[sort-expression=desc]').attr('field-name');
                            sortOrder = 'desc';
                        }

                        var offset = 0;

                        if ($('.active').length > 0) {
                            offset = ($(thisObj).attr('data-p') - 1) * pageSize;
                            pageNumber = $(thisObj).attr('data-p');
                        }
                        self.createTable(offset, pageSize, sortExpression, sortOrder, pageNumber);
                    } else {

                        if (!$(thisObj).parent('li').hasClass('disabled')) {

                            var pageToTrigger = 1;

                            switch (pagerType) {
                                case 'previous':
                                    pageToTrigger = parseInt(pageNumber) - 1;
                                    break;
                                case 'next':
                                    pageToTrigger = parseInt(pageNumber) + 1;
                                    break;
                            }

                            pageUl.find('a[data-p="' + pageToTrigger + '"]').trigger('click');
                        }
                    }
                },
                sorting: function (thisObj, pageSize, e) {

                    if (!($(e.target).is("button-container") || $(e.target).is("i") || $(e.target).parents(".multi-select-container").length > 0 || $(e.target).is("button") || $(thisObj).hasClass("sorting-false") )) {

                        if (!options.advanceSorting) {
                            $.each($(thisObj).closest("table").find("thead tr th"), function () {
                                if ($(this) != $(thisObj)) {
                                    $(this).removeClass('sorting-asc');
                                    $(this).removeClass('sorting-desc');
                                    if (!$(this).hasClass("sorting-false")) {
                                        $(this).addClass('sorting');
                                    }
                                }
                            });
                        }

                        var $sortableAnchor = $(thisObj).find('a');


                        var sortOrder;
                        /*
                         if ($sortableAnchor.attr('sort-expression') == 'desc') {
                         $sortableAnchor.attr('sort-expression', 'asc');
                         sortOrder = 'asc';
                         }*/

                        var defaultSort = "";


                        if ($sortableAnchor.attr('sort-expression') != null) {
                            defaultSort = $sortableAnchor.attr('sort-expression');
                        }


                        if (sortingCycle.indexOf(defaultSort) % sortingCycle.length == sortingCycle.length - 1) {
                            sortOrder = sortingCycle[0];
                        } else {
                            sortOrder = sortingCycle[sortingCycle.indexOf(defaultSort) + 1]
                        }

                        if (sortOrder != "")
                            $sortableAnchor.attr('sort-expression', sortOrder);
                        else
                            $sortableAnchor.removeAttr('sort-expression');

                        switch (sortOrder) {
                            case 'asc':
                                $sortableAnchor.parent('th').removeClass('sorting');
                                $sortableAnchor.parent('th').removeClass('sorting-desc');
                                $sortableAnchor.parent('th').addClass('sorting-asc');
                                break;
                            case 'desc':
                                $sortableAnchor.parent('th').removeClass('sorting');
                                $sortableAnchor.parent('th').removeClass('sorting-asc');
                                $sortableAnchor.parent('th').addClass('sorting-desc');
                                break;
                            default :
                                $sortableAnchor.parent('th').removeClass('sorting-asc');
                                $sortableAnchor.parent('th').removeClass('sorting-desc');
                                $sortableAnchor.parent('th').addClass('sorting');
                        }

                        var offset = 0;
                        var pageNumber = 1;

                        if (pageUl.find('.active').length > 0) {
                            offset = (pageUl.find('.active').find('a').attr('data-p') - 1) * pageSize;
                            pageNumber = pageUl.find('.active').find('a').attr('data-p');
                        }

                        var sortingArray = [];

                        $table.find('th a').each(function () {
                            if ($(this).attr('sort-expression') != undefined) {
                                var sortingString = $(this).attr('field-name') + " " + $(this).attr('sort-expression');
                                sortingArray.push(sortingString);
                            }
                        });

                        advanceSorting = sortingArray.join(",");

                        self.createTable(offset, pageSize, $sortableAnchor.attr('field-name'), sortOrder, pageNumber);

                    }

                }
            };

            self.initialize();

        });

    };
})(jQuery);
