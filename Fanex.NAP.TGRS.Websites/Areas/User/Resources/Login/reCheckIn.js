/* File Created: April 1, 2014 */
/*jshint strict: false*/
/* global Namespace */
////'use strict';

$(document).ready(function () {
    var reCheckIn = new Fanex.TGRS.ReCheckIn();

    reCheckIn.Initialize();
});

Namespace.Register("Fanex.TGRS.ReCheckIn");
Fanex.TGRS.ReCheckIn = function () {
    var $this = this;

    var domElements = {
        AllowReCheckIn: false,
        divPopupExpiredSession: null,
        divPopup: null,
        RootURL: '',
        ReCheckInterval: null
    };

    var popupElements = {
        divPopupExpiredSession: null,
        btnOk: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    var cacheDOMElements = function () {
        domElements.divPopupExpiredSession = $('#divPopupExpiredSession').clone();
        domElements.divPopup = $('#divPopup');

    };

    var cachePopupElements = function () {
        popupElements.divPopupExpiredSession = $("#divPopupExpiredSession", domElements.divPopup);
        popupElements.btnOk = $('#btnOk', domElements.divPopup);
    };

    var initializeData = function () {
        domElements.RootURL = location.protocol + '//' + location.host + $('#RootURL').val();
        domElements.ReCheckInterval = 60000 //1mins
        domElements.AllowReCheckIn = $('#AllowReCheckIn').val() === 'True';
        cacheDOMElements();
    };

    var reCheckIn = function () {
        $.ajax({
            url: domElements.RootURL + 'User/Login/RecheckLogin',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (result.IsKickedOut == "1") {
                    createExpiredForm();
                }
                else if (result.IsKickedOut == "-1") {
                    window.location.href = cachedElements.RootURL + 'User/Common/Offline';
                }
            }
        });
    };

    var createExpiredForm = function () {
        domElements.divPopupExpiredSession.removeAttr('hidden');

        var form = domElements.divPopupExpiredSession.clone();

        //common.CloseMsgBox();
        //common.Modal("", form);

        domElements.divPopup.html(form).dialog({
            width: 'auto',
            modal: true,
            position: ['center', 160],
            title: ""
        });

        domElements.divPopup.dialog("widget").find(".ui-dialog-titlebar-close").hide();

        cachePopupElements();

        bindExpiredSessionPopupEvent();
    };

    var bindExpiredSessionPopupEvent = function () {
        popupElements.btnOk.click(function () {
            window.location.href = domElements.RootURL + 'User/Login/LogOut';
        });
    };

    $this.Initialize = function () {
        initializeData();

        if (domElements.AllowReCheckIn) {
            reCheckIn();
            setInterval(reCheckIn, domElements.ReCheckInterval);
        }
    };
};