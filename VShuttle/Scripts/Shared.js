function ShowInputImage(input, id, height, width, callback) {
    if (typeof(width) == "undefined") {
        width = 150;
    }
    if (typeof(height) == "undefined") {
        height = 150;
    }
    if (typeof(id) == "undefined") {
        console.log("id must be defined!");
    }
    if (input.files && input.files[0]) {
        if ((input.files[0].size / 1024) < 5120) {
            if (jQuery.inArray(input.files[0].type, ["image/png", "image/jpeg", "image/jpg", "image/gif"]) >= 0) {
                $("#ProfilePicErrorUpload").addClass("hide");
                var reader = new FileReader();

                reader.onload = function(e) {
                    $("#" + id)
                        .attr("src", e.target.result)
                        .width(width)
                        .height(height);
                };

                reader.readAsDataURL(input.files[0]);

                return true;
            } else {
                $("#message-dialog-ProfilePicErrorUpload").html("File Format not supported. Please upload png/jpg/jpeg/gif file.");
                $("#ProfilePicErrorUpload").removeClass("hide");
                return false;
            }
        } else {
            $("#message-dialog-ProfilePicErrorUpload").html("Cannot upload image greater than 5MB.");
            $("#ProfilePicErrorUpload").removeClass("hide");
            return false;
        }
    }
    if (typeof(callback) != "undefined") {
        eval(callback);
    }
}

function showAddNewForm(title, url, width, height, data) {
    var formDiv = $("<div></div>");

    if (data === "undefined") {
        data = null;
    }
    window.newFormDialog = formDiv.dialog({
        width: width,
        height: height,
        title: title,
        modal: true,
        close: function() {
            removeDialog(this);
        },
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span><span class=\"ui-button-text\"></span>");
        }
    });

    $.ajax({
        type: "get",
        url: url,
        data: { param: data },
        success: function(response) {
            formDiv.html(response);
        }
    });
}

//sum1
function deleteRecord(thisObj, loadingMessageId, url, confirmationMessage, successCallBack) {
    debugger;
    //var id = $(thisObj).closest("tr").attr("id");
    var id = $(thisObj).closest("tr").find("td").html();

    var callBackMethod = "deleteRecordAfterConfirmation(" + id + ",'" + loadingMessageId + "','" + url + "','" + successCallBack + "')";

    Confirmation(callBackMethod, confirmationMessage);

    return false;
}

function deleteRecordAfterConfirmation(id, loadingMessageId, url, successCallBack) {

    if ($("div.alert").length > 0)
        $("div.alert").remove();

    $.ajax({
        type: "post",
        url: url,
        data: JSON.stringify({ 'id': id }),
        beforeSend: function() {
            $("#" + loadingMessageId).removeAttr("class");
            $("#" + loadingMessageId).addClass("delete-loading");
            $("#" + loadingMessageId).css("display", "block");
        },
        complete: function() {
            $("#" + loadingMessageId).css("display", "none");
        },
        success: function(response) {
            eval(successCallBack);

            if (response.Result == "Success") {
                showSuccessMessage("message", response.Message);
            } else if (response.Result == "Failed") {
                showFailureMessage("message", response.Message);
            }

        },
        error: function() {
            showFailureMessage("message", "Error Occured");
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
}

//sum1

function showEditForm(thisObj, title, url, width, height, data) {
    if ($(thisObj).closest("tr").length) {

        //var id = $(thisObj).closest("tr").attr("id");
        var id = $(thisObj).closest("tr").find("td").html();
    } else {
        var id = $(thisObj).closest("div[data-id]").attr("data-id");
    }
    var formDiv = $("<div/>");
    formDiv.dialog({
        width: width,
        height: height,
        modal: true,
        title: title,
        position: 10,
        close: function() {
            removeDialog(this);
        },
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span><span class=\"ui-button-text\"></span>");
        },
        dialogClass: "dlgfixed"
    });

    $.ajax({
        type: "get",
        url: url,
        data: { 'ID': id, 'param': data },
        success: function(response) {
            formDiv.html(response);
        }
    });
}


function showSuccessMessage(messageDivId, message) {

    messageDivId = "message";

    var $successDiv = $("<div class=\"alert alert-success\"></div>");

    var $successGlyphicon = $("</div>");

    $successDiv.append($successGlyphicon);
    $successDiv.append(message);

    $("#" + messageDivId).html($successDiv);

    $("#" + messageDivId).fadeIn("slow", function() {
        $("#" + messageDivId).animate({ opacity: 1 }, 1000, function() {

        });
    });
}

function showFailureMessage(messageDivId, message) {
    messageDivId = "message";

    var $errorDiv = $("<div class=\"alert alert-error\"></div>");

    var $errorGlyphicon = $("</div>");

    $errorDiv.append($errorGlyphicon);
    $errorDiv.append(message);

    $("#" + messageDivId).html($errorDiv);

    $("#" + messageDivId).fadeIn("slow", function() {
        $("#" + messageDivId).animate({ opacity: 1 }, 1000, function() {

        });
    });
}

function showPopUp(thisObj, title, url, width, height) {
    var datetime = $(thisObj).closest("tr").attr("id");

    var parameter = { 'DateTime': datetime };

    if ($(thisObj).closest("tr").attr("Interval") != null) {
        parameter = extendJson(parameter, { 'Interval': $(thisObj).closest("tr").attr("Interval") });
    }

    var formDiv = $("<div/>");
    window.newFormDialog = formDiv.dialog({
        width: width,
        height: height,
        title: title,
        close: function() {
            removeDialog(this);
        },
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span><span class=\"ui-button-text\">close</span>");
        },
        dialogClass: "dlgfixed"
    });

    $(".dlgfixed").center(false);

    $.ajax({
        type: "get",
        url: url,
        data: parameter,
        success: function(response) {
            formDiv.html(response);
        }
    });
}


function newFormSave(thisObj, url, title, width, height) {
    var formId = $(thisObj).attr("id");
    $("#" + formId).validationEngine();
    var alertDiv = $("<div/>");
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "",
        data: $("#" + formId).serialize(),
        beforeSend: function() {
            $(alertDiv).html("please wait");
        },
        success: function(data) {
            $(alertDiv).html(data.message);
        }
    });
    var noticeDialog = alertDiv.dialog({
        width: width,
        height: height,
        title: title,
        buttons: {
            "Ok": function() {
                noticeDialog.dialog("close");
                newFormDialog.dialog("close");
                location.reload();
            }
        },
        close: function() {
            removeDialog(this);
        },
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span><span class=\"ui-button-text\">close</span>");
        },
        dialogClass: "dlgfixed"
    });
}

function removeDialog(thisObj) {
    $(thisObj).find("input").each(function() {
        $(this).trigger("removeErrorMessage");
    });

    $(thisObj).dialog("destroy").remove();
}

function closeDialog(thisObj) {
    $(thisObj).find("input").each(function() {
        $(this).trigger("removeErrorMessage");
    });

    $(thisObj).closest(".ui-dialog-content").dialog("close");

}


function AjaxConfirmation(methodCallBack, title, confirmMsg, OkLabel, CancelLabel) {

    if (OkLabel == null)
        OkLabel = "Yes";

    if (CancelLabel == null)
        CancelLabel = "No";

    var $confirmationDialogDiv = $("<div id='dialog-confirm' title='Confirm'><p>" + confirmMsg + "</p></div>");

    $confirmationDialogDiv.dialog({
        title: title,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span><span class=\"ui-button-text\">close</span>");
        },
        buttons: [
            {
                text: OkLabel,
                click: function() {
                    $(this).dialog("close");
                    eval(methodCallBack);
                    $("#dialog-confirm").remove();
                }
            },
            {
                text: CancelLabel,
                click: function() {
                    $(this).dialog("close");
                    $("#dialog-confirm").remove();
                }
            }
        ]
    }).parent().find(".ui-dialog-titlebar-close").click(function() {
        $("#dialog-confirm").remove();
    });
}

var confirmed = false;

function Confirmation(methodCallBack, confirmMsg) {
    var $confirmationDialogDiv = $("<div id='dialog-confirm' title='Confirm'><p>" + confirmMsg + "</p></div>");

    $confirmationDialogDiv.dialog({
        resizable: false,
        height: 150,
        modal: true,
        open: function() {
            var closeBtn = $(".ui-dialog-titlebar-close");
            closeBtn.append("<span class=\"ui-button-icon-primary ui-icon ui-icon-closethick\"></span>");
        },
        buttons: {
            'Yes': function() {
                $(this).dialog("close");
                eval(methodCallBack);
            },
            'No': function() {
                $(this).dialog("close");
                $("#dialog-confirm").remove();
            }
        }
    }).parent().find(".ui-dialog-titlebar-close").click(function() {
        $("#dialog-confirm").remove();
    });
}


Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.minusDays = function(days) {
    this.setDate(this.getDate() - days);
    return this;
};

Date.prototype.YmdFormat = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};


function DisplayPercentBar(tableId, columnIndex, maxWidth) {
    $("#" + tableId + " tbody tr td:nth-child(" + columnIndex + ")").each(function() {
        var cell = $(this);
        var actualContent = cell.text();

        if (actualContent == "")
            actualContent = "0.00";

        var percent = parseFloat(actualContent.replace("%", "").trim());
        var width = 1;
        if (!isNaN(percent) && percent > 0) {
            var temp = percent;
            if (temp == 0.00)
                width = 1;
            else
                width = (Math.round(maxWidth * temp) / 100).toFixed(1);
        }
        // cell.html("<div style='display: inline-block;width:" + width + "px;background-color:#3fbb32;height:10px;'>" + actualContent + "</div>");
        var element = $("#AnimationBar").clone();
        cell.html(element);
        element.animate({ "width": width }, 1000);
        element.after("<span>  " + actualContent + "%</span>");
    });
}

function extendJson(a, b) {
    for (var key in b)
        if (b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

function changeDialogHeight($element) {
    var uiDialog = $element.closest(".ui-dialog");
    uiDialog.css({
        'height': uiDialog.find(".ui-dialog-content").height() + 42,
        'top': "0",
        'left': "0",
        'right': "0",
        'bottom': "0",
        'margin': "auto"
    });
}

function Warning(title, message) {
    var $WarningDialogDiv = $("<div id='dialog-confirm' title='Warning'><p>" + message + "</p></div>");
    $WarningDialogDiv.dialog({
        title: title,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    });
}


function onlyNumbers(evt) {
    var e = evt;
    var browserVal = navigator.userAgent.toLowerCase();
    var isFirefox = browserVal.indexOf("firefox") > -1;
    var charCode;
    if (isFirefox)
        charCode = e.which;
    else
        charCode = e.which || e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}