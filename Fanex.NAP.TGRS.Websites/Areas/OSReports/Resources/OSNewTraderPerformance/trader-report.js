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
        ddlSport: null,
        divGrid: null,
        ddlPeriodType: null,
        divSportPerformanceContainer: null,
        divRegionPerformanceContainer: null,
        divSportPerformanceGrid: null,
        divRegionPerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.txtTraderName = $('#txtTraderName');
        domElements.divGrid = $("#resultContainer");
        domElements.divSportPerformanceContainer = $('#divSportPerformanceContainer');
        domElements.divRegionPerformanceContainer = $('#divRegionPerformanceContainer');
        domElements.divSportPerformanceGrid = $('#divSportPerformanceGrid');
        domElements.divRegionPerformanceGrid = $('#divRegionPerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.ddlSport = $('#ddlSport');
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
        initDatePicker();

        domElements.ddlPeriodType = $('#ddlPeriodType');
        //Date picker
        domElements.ddlPeriodType.val(1);
        //btnSearch
        domElements.btnSearch.click(function () {
            var criteria = {
                ReportType: domElements.ddlPeriodType.val(),
                TraderName: domElements.txtTraderName.val().trim(),
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
                SportId: domElements.ddlSport.val()
            };
            common.DisableInput();
            TraderReportService.GetTraderPerformance(criteria, function (data) {
                cachedData = data;
                showTraderPerformanceReport();
                renderTraderGrid(data);
            });
        });


        domElements.divTraderPerformanceGrid.on('click', ".sport-link", function () {
            var $this = $(this);

            var criteria = {
                ReportType: domElements.ddlPeriodType.val(),
                TraderId: $this.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
                SportId: domElements.ddlSport.val()
            }

            common.DisableInput();

            TraderReportService.GetSportsPerformance(criteria, function (data) {
                showSportPerformanceReport();
                renderSportsGrid($this.attr("data-trader-name"), data);
            });
        });

        domElements.divTraderPerformanceGrid.on('click', ".region-link", function () {
            var $this = $(this);

            var criteria = {
                ReportType: domElements.ddlPeriodType.val(),
                TraderId: $this.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
                SportId: domElements.ddlSport.val()
            }

            common.DisableInput();

            TraderReportService.GetRegionsPerformance(criteria, function (data) {
                showRegionPerformanceReport();
                renderRegionsGrid($this.attr("data-trader-name"), data);
            });
        });

        domElements.divSportPerformanceContainer.on('click', '#trader-link', function () {
            showTraderPerformanceReport();
        });

        domElements.divRegionPerformanceContainer.on('click', '#trader-link', function () {
            showTraderPerformanceReport();
        });

        TraderReportService.GetAllSports().then(function () {
            var sports = TraderReportService.Sports;

            TraderReportService.updateSportDropdown(sports, domElements.ddlSport, labels.AllSports, 0);

            domElements.ddlSport.multiselect({
                selectedList: 1,
                minWidth: 263,
                height: 200,
                multiple: false
            }).multiselectfilter({ width: 198 });
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
        var sportLink = "<span class='sport-link link' data-trader-id='{1}' data-trader-name='{2}' data-sport-id={3}>{0}</span>";
        var regionLink = "<span class='region-link link' data-trader-id='{1}' data-trader-name='{2}' data-sport-id={3}>{0}</span>";

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNo', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colTeam', Value: item.TeamName },
                    { Name: 'colGrade', Value: item.GradeName },
                    { Name: 'colPoint', Value: common.GetNumWithLabel(item.TotalPoint, labels.NA) },
                    { Name: 'colPointDeduction', Value: common.GetNumWithLabel(item.PointDeduction, labels.NA) },

                    { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                    { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA)},
                    { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                    { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                    { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                    { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                    { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                    { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                    { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                    { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                    { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                    { Name: 'colSport', Value: sportLink.format(item.SportCount, item.TraderId, item.TraderName, item.SportId) },
                    { Name: 'colRegion', Value: regionLink.format(item.RegionCount, item.TraderId, item.TraderName, item.SportId) },
                    { Name: 'colEvent', Value: item.EventProductCount },
                    { Name: 'ColBetCount', Value: item.BetCount }
                ]
            }
        }

        var options = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: '#', Name: 'colNo', MergeRowNumber: 2 },
                               { HeaderText: 'Trader', Name: 'colTraderName', MergeRowNumber: 2 },
                               { HeaderText: 'Team', Name: 'colTeam', MergeRowNumber: 2 },
                               { HeaderText: 'Grade', Name: 'colGrade', MergeRowNumber: 2 },
                               { HeaderText: 'V.Total Point', Name: 'colPoint', MergeRowNumber: 2 },
                               { HeaderText: 'P.Deduction', Name: 'colPointDeduction', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colTurnoverJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colTurnoverLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Sports', Name: 'colSport', MergeRowNumber: 2 },
                               { HeaderText: 'Regions', Name: 'colRegion', MergeRowNumber: 2 },
                               { HeaderText: 'Event Products', Name: 'colEvent', MergeRowNumber: 2 },
                               { HeaderText: 'Bet Count', Name: 'ColBetCount', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNo', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true, SortDirection: 'asc', CustomSortFunction: customSort },
                { HeaderText: 'Team', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Grade', Width: 55, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V.Total Point', Width: 75, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'P.Deduction', Width: 75, Name: 'colPointDeduction', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },

                { HeaderText: 'Sports', Width: 65, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Regions', Width: 65, Name: 'colRegion', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Event Products', Width: 90, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Bet Count', Width: 90, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat }
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

        domElements.divTraderPerformanceGrid.fanexGrid(options);
    }

    function renderSportsGrid(traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNo', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'colPoint', Value: common.GetNumWithLabel(item.TotalPoint, labels.NA) },

                    { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                    { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                    { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                    { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                    { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                    { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                    { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                    { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                    { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                    { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                    { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                    { Name: 'colEvent', Value: item.EventProductCount },
                    { Name: 'ColBetCount', Value: item.BetCount }
                ]
            }
        };

        var options = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: '#', Name: 'colNo', MergeRowNumber: 2 },
                               { HeaderText: 'Sport', Name: 'colSport', MergeRowNumber: 2 },
                               { HeaderText: 'V.Total Point', Name: 'colPoint', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colTurnoverJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colTurnoverLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Event Products', Name: 'colEvent', MergeRowNumber: 2 },
                               { HeaderText: 'Bet Count', Name: 'ColBetCount', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNo', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Sport', Width: 150, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', SortDirection: 'desc', Sort: true },

                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Bet Count', Width: 100, Name: 'colBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat }
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

        domElements.divSportPerformanceGrid.fanexGrid(options);
    }

    function renderRegionsGrid(traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNo', Value: idx + 1 },
                    { Name: 'colRegion', Value: item.RegionName === null ? "Unknown" : item.RegionName },

                    { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                    { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                    { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                    { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                    { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                    { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                    { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                    { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                    { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                    { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                    { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                    { Name: 'colEvent', Value: item.EventProductCount },
                    { Name: 'ColBetCount', Value: item.BetCount }
                ]
            }
        };

        var options = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: '#', Name: 'colNo', MergeRowNumber: 2 },
                               { HeaderText: 'Region', Name: 'colRegion', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colTurnoverJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colTurnoverLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Event Products', Name: 'colEvent', MergeRowNumber: 2 },
                               { HeaderText: 'Bet Count', Name: 'ColBetCount', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNo', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Region', Width: 200, Name: 'colRegion', HeaderAlign: 'center', CellAlign: 'left', Sort: true },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 140, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 120, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', SortDirection: 'desc', Sort: true },

                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Bet Count', Width: 100, Name: 'colBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat }
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

        domElements.divRegionPerformanceGrid.fanexGrid(options);
    }

    traderReports.Initialize = function () {
        cacheDOMElements();

        initPageFields();
    };

    function showSportPerformanceReport() {
        domElements.divSportPerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
    };

    function showTraderPerformanceReport() {
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
    };

    function showRegionPerformanceReport() {
        domElements.divRegionPerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divSportPerformanceContainer.addClass('display-none');
    };

    return traderReports;
})(jQuery);