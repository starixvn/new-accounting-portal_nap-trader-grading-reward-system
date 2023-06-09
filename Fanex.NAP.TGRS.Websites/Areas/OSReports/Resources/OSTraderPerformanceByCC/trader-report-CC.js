/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(function () {
    traderCCReports.Initialize();
});

var traderCCReports = (function ($) {
    var traderCCReports = {};

    var domElements = {
        divFilter: null,
        divDateRange: null,
        btnSearch: null,
        txtTraderName: null,
        ddlSport: null,
        ddlCustomerClass: null,
        divGrid: null,
        ddlPeriodType: null,
        divTraderPerformanceCCContainer: null,
        divTraderPerformanceCCGrid: null,
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divFilter = $('#divReportFilterForm');
        domElements.ddlCustomerClass = domElements.divFilter.find('#ddlCustomerClass');   
        domElements.ddlSport = domElements.divFilter.find('#ddlSport');  
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.txtTraderName = $('#txtTraderName');
        domElements.divGrid = $("#resultContainer");

        domElements.divTraderPerformanceCCContainer = $('#divTraderPerformanceCCContainer');
        domElements.divTraderPerformanceCCGrid = $('#divTraderPerformanceCCGrid');
    };

    traderCCReports.Initialize = function () {
        cacheDOMElements();

        loadFilter()

        registerEvent();
    };

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });
    };

    var loadFilter = function () {
        domElements.ddlSport.multiselect({
            selectedList: 1,
            minWidth: 230,
            height: 150,
            multiple: false
        }).multiselectfilter({ width: 160 });

        domElements.ddlCustomerClass.multiselect({
            menuWidth: 240,
            menuHeight: 260,
            selectedText: "# of # selected",
            noneSelectedText: "Select options",
            enableClickableOptGroups: true,
            includeSelectAllOption: true,
            groupsCollapsable: true,
            optGroupChecked: true
        }).multiselectfilter({
            width: 190,
            placeholder: '',
            label: '',
            selectAll: true
        });

        initDatePicker();

        domElements.ddlPeriodType = $('#ddlPeriodType');
        //Date picker
        domElements.ddlPeriodType.val(1);
    }

    var registerEvent = function () {
        domElements.btnSearch.click(function () {
            var criteria = {
                TraderName: domElements.txtTraderName.val().trim(),
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
                SportId: domElements.ddlSport.val(),
                CustomerClass: domElements.ddlCustomerClass.val().toString()
            };
            common.DisableInput();
            TraderReportCCService.GetTraderPerformanceCC(criteria, function (data) {
                cachedData = data;
                showTraderPerformanceReport();
                renderTraderGrid(data);
            });
        });        
    };


    function customSort(val1, val2, direction) {
        var parsedCol1Value = val1.toLowerCase();
        var parsedCol2Value = val2.toLowerCase();

        if (direction === 'asc') {
            return parsedCol1Value > parsedCol2Value ? 1 : -1;
        }
        else {
            return parsedCol1Value < parsedCol2Value ? 1 : -1;
        }
    }

    function renderTraderGrid(data, traderName) {
        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colClass', Value: item.CustomerClass },
                    { Name: 'colRealMargin', Value: item.MarginReal },
                    { Name: 'colRealTurnover', Value: item.TurnoverReal },
                    { Name: 'colRealWinloss', Value: item.WinLossReal },
                    { Name: 'colVirtualMargin', Value: item.Margin },
                    { Name: 'colVirtualTurnover', Value: item.Turnover },
                    { Name: 'colVirtualWinloss', Value: item.WinLoss },
                    { Name: 'colBetCount', Value: item.BetCount }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true, SortDirection: 'asc', CustomSortFunction: customSort },
                { HeaderText: 'Customer Class ', Width: 120, Name: 'colClass', HeaderAlign: 'center', CellAlign: 'left', Sort: true, CustomSortFunction: customSort},
                { HeaderText: 'Margin', Width: 100, Name: 'colRealMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Turnover', Width: 100, Name: 'colRealTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Winloss', Width: 100, Name: 'colRealWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Margin', Width: 100, Name: 'colVirtualMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Turnover', Width: 100, Name: 'colVirtualTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Winloss', Width: 100, Name: 'colVirtualWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Bet Count', Width: 100, Name: 'colBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat, Sort: true }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 220,
            showTitle: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        domElements.divTraderPerformanceCCGrid.fanexGrid(options);
    }

    function showTraderPerformanceReport() {
        showHideReport("#divTraderPerformanceCCContainer");
    };

    function showHideReport(report) {
        var container =
            [
                "#divTraderPerformanceCCContainer"
            ];

        var $container = container.map(a => $(a));

        $container.filter($a => !$a.is(report)).forEach($c => $c.addClass("display-none"));

        $container.find($a => $a.is(report)).removeClass("display-none");
    }

    return traderCCReports;
})(jQuery);