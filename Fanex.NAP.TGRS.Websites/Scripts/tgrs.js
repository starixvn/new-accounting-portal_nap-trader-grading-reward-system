/* File Created: April 29, 2014 */
/* global Namespace */
'use strict';

Namespace.Register("Fanex.TGRS.Common");
Fanex.TGRS.Common = function () {
    var $this = this;
    var messages = {
        NotFoundError: null,
        InternalError: null,
        AccessDeniedError: null
    };
    var domElements = {
        divMsgBox: null,
        divPopup: null
    };
    var cachedValues = {
        RootURL: ''
    };

    $this.Formats = {
        DateFormat: 'mm/dd/yy',
        MomentDateFormat: 'MM/DD/YYYY',
        IntegerFormat: '0,0',
        DecimalFormat: '0,0.00',
        MonthYearDateFormat: 'MM-yy',
        MonthFormat: 'MMM dd, yyyy',
        ShortDateFormat: 'MM/dd/yyyy'
    };

    $this.Constants = {
        PagerRanges: [50, 100, 200, 300, 500],
        PageSize: 50
    };

    $this.HandleAjaxError = function (xhr) {
        var message = messages.InternalError;

        if (xhr.status === 403) {
            message = messages.AccessDeniedError;
        } else if (xhr.status === 404) {
            message = messages.NotFoundError;
        }

        $this.ShowErrorMessage(message);
    };

    $this.ShowErrorMessage = function (message) {
        domElements.divMsgBox.showErr(message, { sticky: true, position: ['top: 40', 'center'] });
    };

    $this.ShowInfoMessage = function (message) {
        domElements.divMsgBox.showInfo(message, { duration: 3000, position: ['top: 40', 'center'] });
    };

    $this.ShowConfirmMessage = function (message, callbackFunc) {
        var options = {
            modal: true,
            closeBtn: false,
            header: true,
            css: 'custom-confirm'
        };

        callbackFunc = callbackFunc || function () { };
        domElements.divMsgBox.confirm(message, callbackFunc, options);
    };

    $this.CloseMsgBox = function () {
        domElements.divMsgBox.close();
    };

    // Show inline error message in the case of form or popup.
    $this.ShowInlineErrorMsg = function ($obj, message) {
        $obj.html(message);
        $obj.removeClass('success').removeClass('info').addClass('error').slideDown();
    };

    // Show inline success message in the case of form or popup.
    $this.ShowInlineSuccessMsg = function ($obj, message, autoHide, callbackFunc) {
        autoHide = autoHide === undefined ? true : autoHide;
        $obj.html(message);
        $obj.removeClass('error').removeClass('info').addClass('success').slideDown();

        if (autoHide) {
            setTimeout(function () {
                $this.HideInlineMsg($obj, callbackFunc);
            }, 3000);
        } else if (callbackFunc) {
            callbackFunc();
        }
    };

    // Show inline infomation message in the case of form or popup.
    $this.ShowInlineInfoMsg = function ($obj, message, autoHide, callbackFunc) {
        autoHide = autoHide === undefined ? true : autoHide;
        $obj.html(message);
        $obj.removeClass('error').removeClass('success').addClass('info').slideDown();

        if (autoHide) {
            setTimeout(function () {
                $this.HideInlineMsg($obj, callbackFunc);
            }, 3000);
        } else if (callbackFunc) {
            callbackFunc();
        }
    };

    // Hide inline message.
    $this.HideInlineMsg = function ($obj, callbackFunc) {
        callbackFunc = callbackFunc || function () { };
        $obj.removeClass('error').removeClass('info').slideUp(callbackFunc);
        $obj.html('');
    };

    $this.Modal = function (title, html, option) {
        domElements.divPopup.html(html).dialog({
            width: 'auto',
            modal: true,
            position: ['center', 160],
            title: title
        });

        if (option) {
            domElements.divPopup.dialog('option', option);
        }
    };

    $this.Popup = function (title, html, option) {
        domElements.divPopup.html(html).dialog({
            width: 'auto',
            modal: false,
            position: ['center', 160],
            title: title
        });

        if (option) {
            domElements.divPopup.dialog('option', option);
        }
    };

    $this.IsOpenPopup = function () {
        return domElements.divPopup.html().length > 0 && domElements.divPopup.dialog('isOpen');
    };

    $this.ClosePopup = function () {
        domElements.divPopup.dialog('close');
    };

    $this.DisableInput = function () {
        try { $.blockUI({ message: '' }); } catch (e) { }
    };

    $this.EnableInput = function () {
        try { $.unblockUI(); } catch (e) { }
    };

    $this.ResolveRootUrl = function (relativeUrl) {
        return cachedValues.RootURL + relativeUrl;
    };

    $this.NavigateToRoot = function (url) {
        window.location.replace($this.ResolveRootUrl(url));
    };

    $this.HtmlEncode = function (value) {
        return $('<div/>').text(value).html();
    };

    $this.HtmlDecode = function (value) {
        return $('<div/>').html(value).text();
    };

    $this.DownloadFile = function (url, parameters) {
        if (url && parameters) {
            var downloadUrl = url + '?';
            var iframe = $('body iframe');

            parameters = typeof parameters === 'string' ? parameters : $.param(parameters);
            downloadUrl += parameters;

            if (iframe.length === 0) {
                iframe = $('<iframe width="0" height="0" class="display-none"></iframe>');
                iframe.appendTo('body');
            }

            iframe.attr('src', downloadUrl);
        }
    };

    $this.Initialize = function () {
        domElements.divPopup = $('#divPopup');
        domElements.divMsgBox = $.msgbox({
            message: '',
            type: 'err',
            modal: false,
            position: ['top:130', 'center'],
            theme: '',
            zIndex: 9999,
            useAnimation: false
        });

        messages.AccessDeniedError = $('#AccessDeniedError').val();
        messages.InternalError = $('#InternalError').val();
        messages.NotFoundError = $('#NotFoundError').val();

        cachedValues.RootURL = $('#RootURL').val();

        domElements.divPopup.on('dialogclose', function () {
            $this.CloseMsgBox();
        });
    };
};

var common = new Fanex.TGRS.Common();

$(document).ready(function () {
    common.Initialize();
});
