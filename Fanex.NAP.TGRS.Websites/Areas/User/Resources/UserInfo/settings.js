/* File Created: May 12, 2014 */
/*jshint strict: false*/
/* global Namespace, common, eSchool, labels, messages, scoreCalculationPeriodInfo */
////'use strict';

$(document).ready(function () {
    var SystemConfiguration = new eSchool.SystemConfiguration();
    SystemConfiguration.Initialize();
});

Namespace.Register("eSchool.SystemConfiguration");
eSchool.SystemConfiguration = function () {
    //{ variable-declare
    var $this = this;

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var urls = {
        UpdateDefaultBettype: common.ResolveRootUrl('UserInfo/UpdateDefaultBettype'),
        UpdateScoreCalculationPeriod: common.ResolveRootUrl('SystemConfiguration/UpdateScoreCalculationPeriod')
    };

    var defaultBettypes = {};

    var domElements = {
        ddlBetType: null,
        btnBettypeFilterSubmit: null,
        divBettypeFilter: null,
        beginSelectDateElement: null,
        firstSelectDateElement: null,
        secondSelectDateElement: null,
        endSelectDateElement: null,
        beginSelectMonthElement: null,
        firstSelectMonthElement: null,
        secondSelectMonthElement: null,
        endSelectMonthElement: null,
        firstPeriodTime: null,
        secondPeriodTime: null,
        scoreCalculationPeriodSubmit: null
    };
    //}

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.ddlBetType = $('#ddlBetType');
        domElements.btnBettypeFilterSubmit = $('#btnBettypeFilterSubmit');
        domElements.divBettypeFilter = $('#divBettypeFilter');
        domElements.firstSelectDateElement = $('#firstSelectDateOption');
        domElements.firstSelectMonthElement = $('#firstSelectMonthOption');
        domElements.secondSelectDateElement = $('#secondSelectDateOption');
        domElements.secondSelectMonthElement = $('#secondSelectMonthOption');
        domElements.beginSelectDateElement = $('#beginSelectDateOption');
        domElements.beginSelectMonthElement = $('#beginSelectMonthOption');
        domElements.endSelectDateElement = $('#endSelectDateOption');
        domElements.endSelectMonthElement = $('#endSelectMonthOption');
        domElements.scoreCalculationPeriodSubmit = $('#btnScoreCalculateSubmit');
    };
    //}

    //{ module-init
    $this.Initialize = function () {
        cacheDomElements();
        handlePageEvents();
    };
    //}

    //{ page-events & make-form.
    var handlePageEvents = function () {
        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            autoOpen: true,
            groupsCollapsable: true,
            optGroupChecked: true,
            beforeclose: function () {
                return false;
            },
            create: function () {
                var defaultBt = $("[data-default='True']", domElements.ddlBetType).map((idx, elem) => $(elem).val()).get();
                selectDefaultBettypes(domElements.ddlBetType, defaultBt);
            }
        });

        //hide multiselect header
        domElements.divBettypeFilter.find('.ui-multiselect').addClass('hide');
        var multiSelectMenu = $('.ui-multiselect-menu');
        var newtop = multiSelectMenu.position().top - 28;
        multiSelectMenu.css({ top: newtop });

        domElements.btnBettypeFilterSubmit.click(function () {
            ajaxUpdateDefaultBettype();
        });
    };
    //}

    //{ ajax functions

    //update SystemConfiguration
    var ajaxUpdateDefaultBettype = function () {
        var selectedBetTypes = domElements.ddlBetType.val();
        var bettypes;
        if (selectedBetTypes) {
            bettypes = selectedBetTypes.join(',');
        }
        else {
            bettypes = '';
        }
        var updateParameter = {
            IsDefaultBettypes: bettypes
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateDefaultBettype,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ criteria: updateParameter }),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInfoMessage(messages.UpdateBettypeSuccessfully);
                } else {
                    common.ShowErrorMessage(result.ErrorMessage);
                    return false;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };
    //}

    //{ helper functions

    var selectDefaultBettypes = function (selectElemment, selectData) {
        selectElemment.val(selectData);
        selectElemment.multiselect('refresh');
    };
};