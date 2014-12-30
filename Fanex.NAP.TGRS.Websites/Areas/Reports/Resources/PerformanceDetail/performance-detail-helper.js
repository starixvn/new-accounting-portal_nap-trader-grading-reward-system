/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, common */

////'use strict';

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.Helper');
Fanex.NAP.TGRS.PerformanceDetail.Helper = function () {
    var $this = this;
    var defaultBettypes = {};
    var urls = {
        GetDefaultBettypes: common.ResolveRootUrl('PerformanceDetail/GetDefaultBettypes')
    };

    var intializeFilterData = function () {
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

    var selectDefaultBettypes = function (selectElemment, selectData) {
        selectElemment.val(selectData);
        selectElemment.multiselect('refresh');
    };

    $this.SelectDefaultBettypes = function (selectElemment, selectData) {
        selectDefaultBettypes(selectElemment, selectData);
    };
    $this.IntializeFilterData = function () {
        intializeFilterData();
    };
    $this.GetDefaultBettypes = function () {
        return defaultBettypes;
    };

};