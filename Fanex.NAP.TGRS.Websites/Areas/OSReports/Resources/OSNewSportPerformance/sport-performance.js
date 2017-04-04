/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, sportPerformanceService */
////'use strict';

$(document).ready(function () {
    sportPerformance.Initialize();
});

var sportPerformance = (function ($) {
    var sportPerformance = {};
    sportPerformance.SportPerformance = sportPerformanceService.SportPerformance;
    sportPerformance.LeaguePerformance = sportPerformanceService.LeaguePerformance;
    sportPerformance.BettypePerformance = sportPerformanceService.BettypePerformance;
    sportPerformance.Sports = sportPerformanceService.Sports;

    var timeout = null;

    var defaultSelectVal = -1;

    var domElements = {
        ddlPeriodType: null,
        divSportPerformanceFilter: null,
        divDateRange: null,
        ddlSport: null,
        btnGenerate: null,
        divSportPerformanceContainer: null,
        divSportPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divBettypePerformanceContainer: null,
        divBettypePerformanceGrid: null,
        divRegionPerformanceContainer: null,
        divRegionPerformanceGrid: null
    };

    sportPerformance.GetSportPerformance = function () {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: domElements.ddlSport.val()
        };

        sportPerformanceService.GetSportPerformance(criteria).then(function () {
            sportPerformance.SportPerformance = sportPerformanceService.SportPerformance;
            showSportPerformanceReport();
            renderSportPerformanceGrid(sportPerformance.SportPerformance);
        });
    };

    sportPerformance.GetLeaguePerformance = function (sportId, sportName) {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: sportId
        };

        sportPerformanceService.GetLeaguePerformance(criteria).then(function () {
            sportPerformance.LeaguePerformance = sportPerformanceService.LeaguePerformance;
            showLeaguePerformanceReport();
            renderLeaguePerformanceGrid(sportPerformance.LeaguePerformance, sportId, sportName);
        });
    };

    sportPerformance.GetRegionPerformance = function (sportId, sportName) {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: sportId
        };

        sportPerformanceService.GetRegionPerformance(criteria).then(function () {
            sportPerformance.RegionPerformance = sportPerformanceService.RegionPerformance;
            showRegionPerformanceReport();
            renderRegionPerformanceGrid(sportPerformance.RegionPerformance, sportId, sportName);
        });
    };

    sportPerformance.GetBettypePerformance = function (sportId, sportName, leagueId, leagueName) {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: sportId,
            LeagueId: leagueId
        };

        sportPerformanceService.GetBettypePerformance(criteria).then(function () {
            sportPerformance.BettypePerformance = sportPerformanceService.BettypePerformance;
            showBettypePerformanceReport();
            renderBettypePerformanceGrid(sportPerformance.BettypePerformance, sportName, leagueName);
        });
    };

    sportPerformance.GetAllSports = function () {
        sportPerformanceService.GetAllSports().then(function () {
            sportPerformance.Sports = sportPerformanceService.Sports;

            sportPerformanceService.updateSportDropdown(sportPerformance.Sports, domElements.ddlSport, labels.AllSports, 0);

            domElements.ddlSport.multiselect({
                selectedList: 1,
                minWidth: 263,
                height: 200,
                multiple: false
            }).multiselectfilter({ width: 198 });
        });
    };

    sportPerformance.Initialize = function () {
        //init DOM elements
        domElements.divSportPerformanceFilter = $('#divSportPerformanceFilter');
        domElements.divDateRange = domElements.divSportPerformanceFilter.find('#divDateRange');
        domElements.ddlSport = domElements.divSportPerformanceFilter.find('#ddlSport');
        domElements.btnGenerate = domElements.divSportPerformanceFilter.find('#btnGenerate');
        domElements.divSportPerformanceContainer = $('#divSportPerformanceContainer');
        domElements.divSportPerformanceGrid = $('#divSportPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divBettypePerformanceContainer = $('#divBettypePerformanceContainer');
        domElements.divBettypePerformanceGrid = $('#divBettypePerformanceGrid');
        domElements.divRegionPerformanceContainer = $('#divRegionPerformanceContainer');
        domElements.divRegionPerformanceGrid = $('#divRegionPerformanceGrid');

        //init canlendar
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

        domElements.ddlPeriodType = $('#ddlPeriodType');

        //get sports
        sportPerformance.GetAllSports();

        //events
        domElements.btnGenerate.click(function () {
            sportPerformance.GetSportPerformance();
        });
    };

    // Render sport performance grid.
    function renderSportPerformanceGrid(data) {
        var noOfLeaguesFormat = '<span class="league-link link" data-sport-id="{0}" title="{1}">{2}</span>';
        var noOfRegionsFormat = '<span class="region-link link" data-sport-id="{0}" title="{1}">{2}</span>';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                               { HeaderText: labels.Sport, Name: 'ColSport', MergeRowNumber: 2 },
                               { HeaderText: labels.NoOfLeagues, Name: 'ColNoOfLeagues', MergeRowNumber: 2 },
                               { HeaderText: "Region", Name: 'ColNoOfRegions', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Average V.Turnover', Name: 'ColAverageTurnover', MergeRowNumber: 2 },
                               { HeaderText: 'Point Margin', Name: 'ColPointMargin', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Sport, Width: 200, Name: 'ColSport', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: "Region", Width: 100, Name: 'ColNoOfRegions', HeaderAlign: 'center', CellAlign: 'right' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },

                      {
                          HeaderText: 'Average V.Turnover', Width: 140, Name: 'ColAverageTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: 'Point Margin', Width: 100, Name: 'ColPointMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 220,
            showTitle: true,
            showNumberColumn: true,
            titleInfo: {
                //showExcelButton: true,
                //exportExcelFunction: function () {
                //    exportSportPerformance();
                //}
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleSportPerformanceGridEvents();

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleSportPerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];

        if (data !== null) {
            $.each(data, function (index, item) {
                var noOfLeagues = noOfLeaguesFormat.format(
                                    item.SportId,
                                    labels.SportPerformance,
                                    numeral(item.NoOfLeague).format(common.Formats.IntegerFormat));
                var noOfRegions = noOfRegionsFormat.format(
                                    item.SportId,
                                    labels.SportPerformance,
                                    numeral(item.RegionCount).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColSport', Value: item.SportName, CssClass: 'sport-name' },
                              { Name: 'ColNoOfLeagues', Value: noOfLeagues },
                              { Name: 'ColNoOfRegions', Value: noOfRegions },

                              { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                              { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                              { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                              { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                              { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                              { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                              { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                              { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                              { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                              { Name: 'ColAverageTurnover', Value: common.GetNumWithLabel(item.AverageVTurnover, labels.NA) },
                              { Name: 'ColPointMargin', Value: common.GetNumWithLabel(item.PointMargin, labels.NA) }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divSportPerformanceGrid.fanexGrid(gridOptions);
        handleSportPerformanceGridEvents();
    };

    function showSportPerformanceReport() {
        domElements.divSportPerformanceContainer.removeClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBettypePerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
    };

    function handleSportPerformanceGridEvents() {
        domElements.divSportPerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var $sportName = $link.closest('tr').find('div.sport-name');
            var sportId = $link.attr('data-sport-id');
            var sportName = $sportName.attr('title');

            sportName = sportName || $sportName.text();

            sportPerformance.GetLeaguePerformance(sportId, sportName);
        });

        domElements.divSportPerformanceGrid.find('span.region-link').click(function () {
            var $link = $(this);
            var $sportName = $link.closest('tr').find('div.sport-name');
            var sportId = $link.attr('data-sport-id');
            var sportName = $sportName.attr('title');

            sportName = sportName || $sportName.text();

            sportPerformance.GetRegionPerformance(sportId, sportName);
        });
    };

    // Render league performance grid.
    function renderLeaguePerformanceGrid(data, sportId, sportName) {
        var titleFormat = '<span id="spanSportLink" class="breadcrumb-link">{0}</span>' +
                         '<span title="{1}"> >> {2}</span>';
        var noOfBettypesFormat = '<span class="bettype-link link" data-league-id="{0}" title="{1}">{2}</span>';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                               { HeaderText: labels.League, Name: 'ColLeague', MergeRowNumber: 2 },
                               { HeaderText: labels.NoOfBettypes, Name: 'ColNoOfBettypes', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Average V.Turnover', Name: 'ColAverageTurnover', MergeRowNumber: 2 },
                               { HeaderText: 'Point Margin', Name: 'ColPointMargin', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfBettypes, Width: 100, Name: 'ColNoOfBettypes', HeaderAlign: 'center', CellAlign: 'right' },
                      
                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },

                      {
                          HeaderText: 'Average V.Turnover', Width: 145, Name: 'ColAverageTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: 'Point Margin', Width: 100, Name: 'ColPointMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 220,
            showTitle: true,
            showNumberColumn: true,
            titleInfo: {
                text: titleFormat.format(labels.SportPerformance, sportName, sportName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents(sportId, sportName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleLeaguePerformanceGridEvents(sportId, sportName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];

        if (data !== null) {
            $.each(data, function (index, item) {
                var noOfBettypes = noOfBettypesFormat.format(
                                    item.LeagueId,
                                    labels.BetTypePerformance,
                                    numeral(item.NoOfBettype).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                              { Name: 'ColNoOfBettypes', Value: noOfBettypes },
                              
                              { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                              { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                              { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                              { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                              { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                              { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                              { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                              { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                              { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                              { Name: 'ColAverageTurnover', Value: common.GetNumWithLabel(item.AverageVTurnover, labels.NA) },
                              { Name: 'ColPointMargin', Value: common.GetNumWithLabel(item.PointMargin, labels.NA) }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(sportId, sportName);
    };

    function showLeaguePerformanceReport() {
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divBettypePerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
    };

    function handleLeaguePerformanceGridEvents(sportId, sportName) {
        domElements.divLeaguePerformanceContainer.find('#spanSportLink').click(function () {
            showSportPerformanceReport();
        });

        domElements.divLeaguePerformanceGrid.find('span.bettype-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            sportPerformance.GetBettypePerformance(sportId, sportName, leagueId, leagueName);
        });
    };

    // Render region performance grid.
    function renderRegionPerformanceGrid(data, sportId, sportName) {
        var titleFormat = '<span id="spanSportLink" class="breadcrumb-link">{0}</span>' +
                         '<span title="{1}"> >> {2}</span>';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                               { HeaderText: 'Region', Name: 'ColRegion', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Event Products', Name: 'ColEvent', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: 'Region', Width: 300, Name: 'ColRegion', HeaderAlign: 'center', CellAlign: 'left' },
                     
                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },

                      {
                          HeaderText: 'Event Products', Width: 120, Name: 'ColEvent', HeaderAlign: 'center', CellAlign: 'right',
                          Sort: true
                      }],
            gridExpandHeight: 220,
            showTitle: true,
            showNumberColumn: true,
            titleInfo: {
                text: titleFormat.format(labels.SportPerformance, sportName, sportName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleRegionPerformanceGridEvents(sportId, sportName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleRegionPerformanceGridEvents(sportId, sportName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];

        if (data !== null) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColRegion', Value: item.RegionName != null ? item.RegionName : "Unknown" },
                              
                              { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                              { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                              { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                              { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                              { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                              { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                              { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                              { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                              { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                              { Name: 'ColEvent', Value: item.EventProductCount }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divRegionPerformanceGrid.fanexGrid(gridOptions);
        handleRegionPerformanceGridEvents(sportId, sportName);
    };

    function showRegionPerformanceReport() {
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.removeClass('display-none');
        domElements.divBettypePerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
    };

    function handleRegionPerformanceGridEvents(sportId, sportName) {
        domElements.divRegionPerformanceContainer.find('#spanSportLink').click(function () {
            showSportPerformanceReport();
        });
    };

    // Render bettype performance grid.
    function renderBettypePerformanceGrid(data, sportName, leagueName) {
        var titleFormat = '<span id="spanSportLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        var titleLength = 8 + labels.SportPerformance.length + leagueName.length + sportName.length;

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                               { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                               { HeaderText: 'Product', Name: 'ColBettype', MergeRowNumber: 2 },

                               { HeaderText: "Juice", Name: "colJuice", MergeColNumber: 4 },
                               { HeaderText: "Leftover", Name: "colLeftover", MergeColNumber: 4 },
                               { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 },

                               { HeaderText: 'Average V.Turnover', Name: 'ColAverageTurnover', MergeRowNumber: 2 },
                               { HeaderText: 'Point Margin', Name: 'ColPointMargin', MergeRowNumber: 2 }
                        ]
                    }
            ],
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: 'Product', Width: 300, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left' },
                      
                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                      { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                      { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },

                      {
                          HeaderText: 'Average V.Turnover', Width: 150, Name: 'ColAverageTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: 'Point Margin', Width: 100, Name: 'ColPointMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 220,
            showTitle: true,
            showNumberColumn: true,
            titleInfo: {
                text: titleFormat.format(labels.SportPerformance, sportName, leagueName, shortenName(200, titleLength, leagueName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypePerformanceGridEvents();

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypePerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];

        if (data !== null) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColBettype', Value: item.BettypeName },
                             
                              { Name: 'colJuice', Value: common.GetNumWithLabel(item.JuiceWinLoss, labels.NA) },
                              { Name: 'colTurnoverJuice', Value: common.GetNumWithLabel(item.JuiceTurnover, labels.NA) },
                              { Name: 'colMarginJuice', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'colMarginJuiceTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },

                              { Name: 'colLeftover', Value: common.GetNumWithLabel(item.LeftoverWinLoss, labels.NA) },
                              { Name: 'colTurnoverLeftover', Value: common.GetNumWithLabel(item.LeftoverTurnover, labels.NA) },
                              { Name: 'colMarginLeftover', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'colMarginLeftoverTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },

                              { Name: 'colWinloss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) },
                              { Name: 'colTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                              { Name: 'colMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },

                              { Name: 'ColAverageTurnover', Value: common.GetNumWithLabel(item.AverageVTurnover, labels.NA) },
                              { Name: 'ColPointMargin', Value: common.GetNumWithLabel(item.PointMargin, labels.NA) }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divBettypePerformanceGrid.fanexGrid(gridOptions);
        handleBettypePerformanceGridEvents();
    };

    function showBettypePerformanceReport() {
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divRegionPerformanceContainer.addClass('display-none');
        domElements.divBettypePerformanceContainer.removeClass('display-none');
    };

    function handleBettypePerformanceGridEvents() {
        domElements.divBettypePerformanceContainer.find('#spanSportLink').click(function () {
            showSportPerformanceReport();
        });

        domElements.divBettypePerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    return sportPerformance;
})(jQuery);