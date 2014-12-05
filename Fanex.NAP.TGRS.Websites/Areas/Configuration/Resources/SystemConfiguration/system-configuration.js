/* File Created: May 12, 2014 */
/* global Namespace, common, eSchool, labels, messages */
'use strict';

$(document).ready(function () {
    var SystemConfiguration = new eSchool.SystemConfiguration();
    SystemConfiguration.Initialize();
});

Namespace.Register("eSchool.SystemConfiguration");
eSchool.SystemConfiguration = function () {
    //{ variable-declare
    var $this = this;

    var urls = {
        UpdateDefaultBettype: common.ResolveRootUrl('SystemConfiguration/UpdateDefaultBettype'),
        GetDefaultBettypes: common.ResolveRootUrl('PerformanceDetail/GetDefaultBettypes')
    };

    var defaultBettypes = {};

    var domElements = {
        ddlBetType: null,
        btnBettypeFilterSubmit: null,
        divBettypeFilter: null
    };
    //}

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.ddlBetType = $('#ddlBetType');
        domElements.btnBettypeFilterSubmit = $('#btnBettypeFilterSubmit');
        domElements.divBettypeFilter = $('#divBettypeFilter');
    };

    //}

    //{ module-init
    $this.Initialize = function () {
        cacheDomElements();
        ajaxGetDefaultBettypes();
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
            beforeclose: function () {
                return false;
            },
            create: function () {
                selectDefaultBettypes(domElements.ddlBetType, defaultBettypes);
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
    var ajaxGetDefaultBettypes = function () {
        common.DisableInput();
        var ajaxResult = false;
        $.ajax({
            type: 'POST',
            url: urls.GetDefaultBettypes,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.DefaultBettypes) {
                    defaultBettypes = result.DefaultBettypes,
                    ajaxResult = true;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
                ajaxResult = false;
            },
            complete: function () {
                common.EnableInput();
            }
        });
        return ajaxResult;
    };

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
            BetTypes: bettypes
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

    //{ element-render

    //}
};