/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(function () {
    traderReports.Initialize();
});

var traderReports = (function ($) {
    var traderReports = {}

    var domElements = {
        divDateRange: null,
        btnSearch: null,
        txtTraderName: null
    };
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.txtTraderName = $('#txtTraderName');
    };

    $('#chkMonth').on('change', function () {
        var monthType = 2;
        getChartData(monthType);
    });
    $('#chkDay').on('change', function () {
        var dayType = 1;
        getChartData(dayType);
    });

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_3'
        });
    };

    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.click(function () {
            var criteria = {
                TraderName: domElements.txtTraderName.val(),
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.toDate()
            };
        });
    };

    traderReports.Initialize = function () {
        cacheDOMElements();

        initPageFields();

        //$("#txtUserName").keyup(function (e) {
        //    if (e.keyCode == 13) {
        //        $('#btnSearch').trigger("click");
        //    }
        //});

        //Load report for first time
        //$('#btnSearch').trigger("click");
    };

    return traderReports;
})(jQuery);
