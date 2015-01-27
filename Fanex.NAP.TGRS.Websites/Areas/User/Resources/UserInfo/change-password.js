/* File Created: April 3, 2014 */
/*jshint strict: false*/
/* global Namespace, CryptoJS, common, validator, passedData */
////'use strict';

$(document).ready(function () {
    var changePassword = new Fanex.TGRS.ChangePassword();

    changePassword.Initialize();
});

Namespace.Register("Fanex.TGRS.ChangePassword");
Fanex.TGRS.ChangePassword = function () {
    var $this = this;
    var domElements = {
        divMessage: null,
        divForm: null,
        hdnToken: null,
        txtOldPassword: null,
        hdnOldPassword: null,
        txtNewPassword: null,
        hdnNewPassword: null,
        txtConfirmPassword: null,
        hdnConfirmPassword: null,
        btnSave: null,
        btnCancel: null
    };

    var cacheDOM = function () {
        domElements.divForm = $('#divChangePassword');
        domElements.divMessage = $('#divErrorSuccessMsg');
        domElements.hdnToken = $('#hdnToken');
        domElements.txtOldPassword = $('#txtOldPassword');
        domElements.hdnOldPassword = $('#hdnOldPassword');
        domElements.txtNewPassword = $('#txtNewPassword');
        domElements.hdnNewPassword = $('#hdnNewPassword');
        domElements.txtConfirmPassword = $('#txtConfirmPassword');
        domElements.hdnConfirmPassword = $('#hdnConfirmPassword');
        domElements.btnSave = $('#btnSave');
        domElements.btnCancel = $('#btnCancel');
    };

    var handleEvents = function () {
        if (passedData.IsSuccess) {
            common.ShowInlineSuccessMsg(domElements.divMessage, passedData.ChangedPasswordSuccessfully);
        } else if (passedData.ErrorMessage && passedData.ErrorMessage.length > 0) {
            common.ShowInlineErrorMsg(domElements.divMessage, passedData.ErrorMessage);
        }

        domElements.btnSave.click(function () {
            var encryptPass = '';
            var token = domElements.hdnToken.val();

            if (!validator.ValidateForm(domElements.divForm, 'w')) {
                return false;
            } else if (!validateMatchedPasswords()) {
                return false;
            }

            encryptPass = CryptoJS.CfsEnCode(domElements.txtOldPassword.val());
            domElements.hdnOldPassword.val(CryptoJS.SHA256(encryptPass + token));
            console.log(encryptPass);
            encryptPass = CryptoJS.CfsEnCode(domElements.txtNewPassword.val());
            domElements.hdnNewPassword.val(encryptPass);

            encryptPass = CryptoJS.CfsEnCode(domElements.txtConfirmPassword.val());
            domElements.hdnConfirmPassword.val(encryptPass);
        });

        domElements.btnCancel.click(function () {
            common.NavigateToRoot('', 0);

            return false;
        });
    };

    var validateMatchedPasswords = function () {
        var errorMsg = domElements.txtConfirmPassword.attr('data-val-not-match');
        console.log(domElements.txtNewPassword);
        if (domElements.txtNewPassword.val() !== domElements.txtConfirmPassword.val()) {
            validator.ShowError(domElements.txtConfirmPassword, errorMsg, 'w');

            return false;
        } else {
            return true;
        }
    };

    $this.Initialize = function () {
        cacheDOM();
        handleEvents();
    };
};