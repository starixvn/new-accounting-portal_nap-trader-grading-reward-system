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
        divSportPerformanceFilter: null,
        divDateRange: null,
        ddlSport: null,
        btnGenerate: null,
        divSportPerformanceContainer: null,
        divSportPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divBettypePerformanceContainer: null,
        divBettypePerformanceGrid: null
    };

    sportPerformance.GetSportPerformance = function () {
        var criteria = {
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

    sportPerformance.GetBettypePerformance = function (sportId, sportName, leagueId, leagueName) {
        var criteria = {
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

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Sport, Width: 200, Name: 'ColSport', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
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
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColSport', Value: item.SportName, CssClass: 'sport-name' },
                              { Name: 'ColNoOfLeagues', Value: noOfLeagues },
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
        domElements.divSportPerformanceGrid.fanexGrid(gridOptions);
        handleSportPerformanceGridEvents();
    };

    function showSportPerformanceReport() {
        domElements.divSportPerformanceContainer.removeClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBettypePerformanceContainer.addClass('display-none');
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
    };

    // Render league performance grid.
    function renderLeaguePerformanceGrid(data, sportId, sportName) {
        var titleFormat = '<span id="spanSportLink" class="breadcrumb-link">{0}</span>' +
                         '<span title="{1}"> >> {2}</span>';
        var noOfBettypesFormat = '<span class="bettype-link link" data-league-id="{0}" title="{1}">{2}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfBettypes, Width: 100, Name: 'ColNoOfBettypes', HeaderAlign: 'center', CellAlign: 'right' },
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
        handleLeaguePerformanceGridEvents(sportId, sportName);
    };

    function showLeaguePerformanceReport() {
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divBettypePerformanceContainer.addClass('display-none');
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

    // Render bettype performance grid.
    function renderBettypePerformanceGrid(data, sportName, leagueName) {
        var titleFormat = '<span id="spanSportLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        var titleLength = 8 + labels.SportPerformance.length + leagueName.length + sportName.length;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: 'Product', Width: 100, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left' },
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
        domElements.divSportPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
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