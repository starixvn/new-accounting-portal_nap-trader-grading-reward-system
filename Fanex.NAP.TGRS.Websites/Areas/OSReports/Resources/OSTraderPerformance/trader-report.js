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
        txtTraderName: null,
        divGrid: null
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.txtTraderName = $('#txtTraderName');
        domElements.divGrid = $("#resultContainer");
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

    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.click(function () {
            var criteria = {
                TraderName: domElements.txtTraderName.val().trim(),
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo()
            };
            common.DisableInput();
            TraderReportService.GetTraderPerformance(criteria, function (data) {
                cachedData = data;
                renderTraderGrid(data);
            });
        });


        domElements.divGrid.on('click', ".sport-link", function () {
            var $this = $(this);

            var criteria = {
                TraderId: $this.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo()
            }

            common.DisableInput();

            TraderReportService.GetSportsPerformance(criteria, function (data) {
                renderSportsGrid($this.attr("data-trader-name"), data);
            });
        });

        domElements.divGrid.on('click', '#trader-link', function () {
            renderTraderGrid(cachedData);
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

    function renderTraderGrid(data) {
        var sportLink = "<span class='sport-link link' data-trader-id='{1}' data-trader-name='{2}'>{0}</span>";

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colTeam', Value: item.TeamName },
                    { Name: 'colGrade', Value: item.GradeName },
                    { Name: 'colPoint', Value: item.TotalPoint },
                    { Name: 'colPointDeduction', Value: item.PointDeduction },
                    { Name: 'colMargin', Value: item.Margin },
                    { Name: 'colTurnover', Value: item.Turnover },
                    { Name: 'colWinloss', Value: item.WinLoss },
                    { Name: 'colSport', Value: sportLink.format(item.SportCount, item.TraderId, item.TraderName) },
                    { Name: 'colEvent', Value: item.EventProductCount }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true, SortDirection: 'asc', CustomSortFunction: customSort },
                { HeaderText: 'Team ', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Grade', Width: 100, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'P.Deduction', Width: 100, Name: 'colPointDeduction', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Sports', Width: 100, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
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
        domElements.divGrid.removeClass("hide");
        $(".freegrid", domElements.divGrid).fanexGrid(options);
    }

    function renderSportsGrid(traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'colPoint', Value: item.TotalPoint },
                    { Name: 'colMargin', Value: item.Margin },
                    { Name: 'colTurnover', Value: item.Turnover },
                    { Name: 'colWinloss', Value: item.WinLoss },
                    { Name: 'colEvent', Value: item.EventProductCount }
                ]
            }
        };

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Sport', Width: 100, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 220,
            showTitle: true,
            titleInfo: {
                text: fallbackLink.format(labels.TraderPerformance, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        $(".freegrid", domElements.divGrid).fanexGrid(options);
    }

    traderReports.Initialize = function () {
        cacheDOMElements();

        initPageFields();
    };

    return traderReports;
})(jQuery);