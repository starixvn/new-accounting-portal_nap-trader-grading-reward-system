/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(function () {
    traderReports.Initialize();
});

var traderReports = (function ($) {
    var traderReports = {};

    traderReports.LeaguePerformance = TraderReportService.LeaguePerformance;
    traderReports.BettypePerformance = TraderReportService.BettypePerformance;

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
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divBettypePerformanceContainer: null,
        divBettypePerformanceGrid: null
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
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divBettypePerformanceContainer = $('#divBettypePerformanceContainer');
        domElements.divBettypePerformanceGrid = $('#divBettypePerformanceGrid');
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
                renderSportsGrid($this.attr("data-trader-id"), $this.attr("data-trader-name"), data);
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

        $(document).on("click", ".match-link", function () {
            var target = $(this);

            var criteria =
                {
                    TraderId: target.attr("data-trader-id"),
                    FromDate: domElements.divDateRange.getFrom(),
                    ToDate: domElements.divDateRange.getTo(),
                    SportId: target.attr("data-sport-id"),
                    LeagueId: target.attr("data-league-id")
                };

            var url = common.ResolveRootUrl("OSTraderPerformance/GetMatchPerformance");

            common.DisableInput();

            var titles =
                [
                    { class: "trader-fallback-link", value: "Trader Performance" },
                    { class: "sport-fallback-link", value: target.attr("data-trader-name") },
                    { class: "league-fallback-link", value: target.attr("data-sport-name") }
                ]

            $.get(url, criteria, function (json) {
                showHideReport("#divMatchPerformanceContainer");
                renderMatchGrid(json, titles, target.attr("data-league-name"), target.attr("data-trader-id"), target.attr("data-sport-id"));
            });
        })

        domElements.divSportPerformanceContainer.on('click', '#trader-link', function () {
            showTraderPerformanceReport();
        });

        domElements.divRegionPerformanceContainer.on('click', '#trader-link', function () {
            showTraderPerformanceReport();
        });

        $(document)
            .on("click", ".trader-fallback-link", () => showHideReport("#divTraderPerformanceContainer"))
            .on("click", ".sport-fallback-link", () => showHideReport("#divSportPerformanceContainer"))
            .on("click", ".league-fallback-link", () => showHideReport("#divLeaguePerformanceContainer"))
            .on("click", ".match-fallback-link", () => showHideReport("#divMatchPerformanceContainer"));

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

    traderReports.GetLeaguePerformance = function (traderId, traderName, sportId, sportName) {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: sportId,
            TraderId: traderId
        };

        TraderReportService.GetLeaguePerformance(criteria).then(function () {
            traderReports.LeaguePerformance = TraderReportService.LeaguePerformance;
            showLeaguePerformanceReport();
            renderLeaguePerformanceGrid(traderReports.LeaguePerformance, sportId, sportName, traderId, traderName);
        });
    };

    traderReports.GetBettypePerformance = function (traderId, traderName, sportId, sportName, leagueId, leagueName) {
        var criteria = {
            ReportType: domElements.ddlPeriodType.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: sportId,
            LeagueId: leagueId,
            TraderId: traderId
        };

        TraderReportService.GetBettypePerformance(criteria).then(function () {
            traderReports.BettypePerformance = TraderReportService.BettypePerformance;
            showBettypePerformanceReport();
            renderBettypePerformanceGrid(traderReports.BettypePerformance, traderName, sportName, leagueName);
        });
    };

    traderReports.Initialize = function () {
        cacheDOMElements();

        initPageFields();
    };

    function renderTraderGrid(data, traderName) {
        var sportLink = "<span class='sport-link link' data-trader-id='{1}' data-trader-name='{2}' data-sport-id={3}>{0}</span>";
        var regionLink = "<span class='region-link link' data-trader-id='{1}' data-trader-name='{2}' data-sport-id={3}>{0}</span>";

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
                    { Name: 'colSport', Value: sportLink.format(item.SportCount, item.TraderId, item.TraderName, item.SportId) },
                    //{ Name: 'colMatch', Value: `<span class='match-link link' data-trader-id="${item.TraderId}" data-trader-name="${item.TraderName}">${item.MatchCount}</span>` },
                    { Name: 'colRegion', Value: regionLink.format(item.RegionCount, item.TraderId, item.TraderName, item.SportId) },
                    { Name: 'colEvent', Value: item.EventProductCount },
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
                //{ HeaderText: "Matches", Width: 100, Name: "colMatch", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: 'Regions', Width: 100, Name: 'colRegion', HeaderAlign: 'center', CellAlign: 'right' },
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

        domElements.divTraderPerformanceGrid.fanexGrid(options);
    }

    function renderSportsGrid(traderId, traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            var noOfLeaguesFormat = '<span class="league-link link" data-sport-id="{0}" data-sport-name="{1}" data-trader-id="{2}" data-trader-name="{3}" >{4}</span>';

            var noOfLeagues = noOfLeaguesFormat.format(
                item.SportId,
                item.SportName,
                traderId,
                traderName,
                numeral(item.NoOfLeague).format(common.Formats.IntegerFormat));

            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'ColNoOfLeagues', Value: noOfLeagues },
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
                { HeaderText: 'Sport', Width: 200, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'No. Of Leagues', Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
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

        domElements.divSportPerformanceGrid.fanexGrid(options);

        handleSportPerformanceGridEvents();
    }

    function renderRegionsGrid(traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colRegion', Value: item.RegionName === null ? "Unknown" : item.RegionName },
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
                { HeaderText: 'Region', Width: 200, Name: 'colRegion', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
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

        domElements.divRegionPerformanceGrid.fanexGrid(options);
    }

    function renderLeaguePerformanceGrid(data, sportId, sportName, traderId, traderName) {
        var titleFormat = '<span id="spanTraderLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanSportLink" class="breadcrumb-link"> >> {1}</span>' +
            '<span> >> {2}</span>';
        var noOfBettypesFormat = '<span class="bettype-link link" data-league-id="{0}" title="{1}">{2}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.NoOfBettypes, Width: 100, Name: 'ColNoOfBettypes', HeaderAlign: 'center', CellAlign: 'right' },
            { HeaderText: "Matches", Width: 100, Name: "colMatch", HeaderAlign: "center", CellAlign: "right" },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc'
            },
            {
                HeaderText: 'V.Win Loss', Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
            },
            {
                HeaderText: 'V.Margin', Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
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
                text: titleFormat.format(labels.TraderPerformance, traderName, sportName)
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
                    { Name: 'colMatch', Value: `<span class='match-link link' title='Match Performance'  data-league-id="${item.LeagueId}" data-league-name="${item.LeagueName}" data-trader-id="${traderId}" data-trader-name="${traderName}" data-sport-name="${sportName}" data-sport-id="${sportId}">${item.NoOfMatch}</span>` },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColWinLoss', Value: item.VWinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.VMargin, labels.NA) },
                    { Name: 'ColAverageTurnover', Value: common.GetNumWithLabel(item.AverageVTurnover, labels.NA) },
                    { Name: 'ColPointMargin', Value: common.GetNumWithLabel(item.PointMargin, labels.NA) }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(sportId, sportName, traderId, traderName);
    };

    function showLeaguePerformanceReport() {
        showHideReport("#divLeaguePerformanceContainer");
    };

    function handleLeaguePerformanceGridEvents(sportId, sportName, traderId, traderName) {
        domElements.divLeaguePerformanceContainer.find('#spanSportLink').click(function () {
            showSportPerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divLeaguePerformanceGrid.find('span.bettype-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league-id');
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            traderReports.GetBettypePerformance(traderId, traderName, sportId, sportName, leagueId, leagueName);
        });
    };

    function handleSportPerformanceGridEvents() {
        domElements.divSportPerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var sportId = $link.attr('data-sport-id');
            var sportName = $link.attr('data-sport-name');

            var traderId = $link.attr('data-trader-id');
            var traderName = $link.attr('data-trader-name');

            sportName = sportName || $sportName.text();

            traderReports.GetLeaguePerformance(traderId, traderName, sportId, sportName);
        });
    };

    function renderBettypePerformanceGrid(data, traderName, sportName, leagueName) {
        var titleFormat = '<span id="spanTraderLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanSportLink" class="breadcrumb-link"> >> {1}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {2}</span>' +
            '<span> >> {3}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: 'Product', Width: 200, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc'
            },
            {
                HeaderText: 'V.Win Loss', Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
            },
            {
                HeaderText: 'V.Margin', Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
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
                text: titleFormat.format(labels.TraderPerformance, traderName, sportName, leagueName)
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
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColWinLoss', Value: item.VWinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.VMargin, labels.NA) },
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
        showHideReport("#divBettypePerformanceContainer");
    };

    function handleBettypePerformanceGridEvents() {
        domElements.divBettypePerformanceContainer.find('#spanSportLink').click(function () {
            showSportPerformanceReport();
        });

        domElements.divBettypePerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divBettypePerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });
    };

    function showSportPerformanceReport() {
        showHideReport("#divSportPerformanceContainer");
    };

    function showTraderPerformanceReport() {
        showHideReport("#divTraderPerformanceContainer");
    };

    function showRegionPerformanceReport() {
        showHideReport("#divRegionPerformanceContainer");
    };

    function showHideReport(report) {
        var container =
            [
                "#divTraderPerformanceContainer",
                "#divSportPerformanceContainer",
                "#divRegionPerformanceContainer",
                "#resultContainer",
                "#divLeaguePerformanceContainer",
                "#divBettypePerformanceContainer",
                "#divMatchPerformanceContainer"
            ];

        var $container = container.map(a => $(a));

        $container.filter($a => !$a.is(report)).forEach($c => $c.addClass("display-none"));

        $container.find($a => $a.is(report)).removeClass("display-none");
    }

    function renderMatchGrid(json, titles, leagueName, traderId, sportId) {
        function renderData(data, idx) {
            return {
                Columns: [
                    { Name: "No", Value: `<span data-index="${idx}">${idx + 1}</span>` },
                    { Name: "Match", Value: `<span class='link' title='Bet Type Detail'>${data.TeamName}</span>` },
                    { Name: "EventDate", Value: data.Date },
                    { Name: "Turnover", Value: data.Turnover, },
                    { Name: "Winloss", Value: data.Winloss, },
                    { Name: "Margin", Value: data.Margin, }
                ]
            };
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Match", Width: 500, Name: "Match", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Event Date", Width: 100, Name: "EventDate", HeaderAlign: "center", CellAlign: "center", },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: "Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: "Margin %", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
            ]

        var options =
            {
                columns: columns,
                bodyRows: json.map(renderData),
                gridExpandHeight: 170,
                showTitle: true,
                titleInfo:
                    {
                        text: `${renderTitle(titles)} >> ${leagueName}`,
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges,
                },
            };

        $("#divMatchPerformanceGrid").fanexGrid(options);

        $("#divMatchPerformanceGrid tr span.link").click(e => getMatchBettype(common.getGridData(e.target)));

        titles.push({ class: "match-fallback-link", value: leagueName });

        common.bindDataToFanexGrid("#divMatchPerformanceGrid", json, { titles, traderId, sportId })

        common.EnableInput();
    }

    function renderTitle(titles = []) {
        return titles
            .map(obj => `<span class='breadcrumb-link ${obj.class}'>${obj.value}</span>`)
            .join(" >> ");
    }

    function getMatchBettype(obj) {
        common.DisableInput();

        var url = common.ResolveRootUrl("OSTraderPerformance/GetMatchBettypePerformanace");

        var criteria =
            {
                leagueId: obj.LeagueId,
                matchId: obj.MatchId,
                traderId: obj.global.traderId,
                sportId: obj.global.sportId,
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo()
            }

        $.get(url, criteria, json => renderMatchBettype(json, obj, obj.global.titles))
    }

    function renderMatchBettype(json, obj, titles) {
        function renderData(data, idx) {
            return {
                Columns: [
                    { Name: "No", Value: idx + 1 },
                    { Name: "Product", Value: data.BettypeName },
                    { Name: "Turnover", Value: data.Turnover, },
                    { Name: "Winloss", Value: data.VWinloss, },
                    { Name: "Margin", Value: data.Margin, }
                ]
            };
        }

        var prefix = titles.map(t => t.value).join(" >> ");

        var title = `${prefix} >> ${obj.TeamName}`;

        var name = obj.TeamName;

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Product", Width: 300, Name: "Product", HeaderAlign: "center", CellAlign: "left", },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Margin", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
            ]

        var options =
            {
                columns: columns,
                bodyRows: json.map(renderData),
                gridExpandHeight: 170,
                showTitle: true,
                titleInfo:
                    {
                        text: `${renderTitle(titles)} >> ${name}`,
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges,
                }
            };

        $("#divBettypePerformanceGrid").fanexGrid(options);

        showHideReport("#divBettypePerformanceContainer");

        if (title.length >= 100) {
            $("#divBettypePerformanceContainer .grid-title").css("height", "40px");
        }

        common.EnableInput();
    }

    return traderReports;
})(jQuery);