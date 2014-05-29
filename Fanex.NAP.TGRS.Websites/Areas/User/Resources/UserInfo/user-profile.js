/* File Created: April 3, 2014 */
/* global Namespace, common, validator, passedData */
'use strict';

$(document).ready(function () {
    var userProfile = new Fanex.TGRS.UserProfile();

    userProfile.Initialize();
});

Namespace.Register("Fanex.TGRS.UserProfile");
Fanex.TGRS.UserProfile = function () {
    var $this = this;
    var domElements = {
        divMessage: null,
        divValidationSummary: null,
        divForm: null,
        btnSubmit: null,
        btnCancel: null
    };

    var cacheDOM = function () {
        domElements.divForm = $('#divUserProfile');
        domElements.divMessage = $('#divErrorSuccessMsg');
        domElements.divValidationSummary = $('#divValidationSummary');
        domElements.btnSubmit = $('#btnSubmit');
        domElements.btnCancel = $('#btnCancel');
    };

    var handleEvents = function () {
        if (passedData.IsSuccess) {
            common.ShowInlineSuccessMsg(domElements.divMessage, passedData.ChangedSuccessfully);
        } else if (domElements.divValidationSummary.find('li:first').text() !== '') {
            common.ShowInlineErrorMsg(domElements.divMessage, domElements.divValidationSummary.html());
        }

        domElements.btnSubmit.click(function () {
            if (!validator.ValidateForm(domElements.divForm, 'w')) {
                return false;
            }
        });

        domElements.btnCancel.click(function () {
            common.NavigateToRoot('', 0);

            return false;
        });
    };

    $this.Initialize = function () {
        cacheDOM();
        handleEvents();
    };
};