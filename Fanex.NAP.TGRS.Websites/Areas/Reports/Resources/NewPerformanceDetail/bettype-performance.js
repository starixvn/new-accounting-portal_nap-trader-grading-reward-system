/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, datepickerSetting, forecastBettype, messages */

////'use strict';
$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance');
Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance = function () {
    var $this = this;
    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('NewPerformanceDetail/GetBetTypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('NewPerformanceDetail/ExportBetTypePerformance'),
        GetTraderPerformanceOfBetType: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformanceOfBetType'),
        GetMatchPerformanceOfBetTypeTrader: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfBetTypeTrader'),
        GetLeaguePerformanceOfBetType: common.ResolveRootUrl('NewPerformanceDetail/GetLeaguePerformanceOfBetType'),
        GetTraderPerformanceOfBetTypeLeague: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformanceOfBetTypeLeague'),
        GetMatchPerformanceOfBetTypeLeagueTrader: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfBetTypeLeagueTrader')
    };
    var domElements = {
        divBetTypePerformanceFilter: null,
        divDateRange: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null
    };
    var parameters = {
        FromDate: null,
        ToDate: null
    };
    var cachedData = {
        MatchPerformance: null,
        GrandTotal: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divBetTypePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divBetTypePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divBetTypePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divBetTypePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divBetTypePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
    };

    // Bind event handlers.
    var initializeFields = function () {
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            create: function () {
                performanceDetailHelper.SelectDefaultBettypes(domElements.ddlBetType, performanceDetailHelper.GetDefaultBettypes());
            }
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
        });

        domElements.txtMarginFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginFrom.val());

            domElements.txtMarginFrom.val(value);
            validator.ClearError(domElements.txtMarginFrom);
        });

        domElements.txtMarginTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginTo.val());

            domElements.txtMarginTo.val(value);
            validator.ClearError(domElements.txtMarginTo);
        });

        domElements.txtMinTurnover.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinTurnover.val());

            domElements.txtMinTurnover.val(value);
            validator.ClearError(domElements.txtMinTurnover);
        });

        domElements.txtMinWinLoss.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinWinLoss.val());

            domElements.txtMinWinLoss.val(value);
            validator.ClearError(domElements.txtMinWinLoss);
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();

                hideAllReports();
                getBetTypePerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
    };

    // Get bet type performance.
    var getBetTypePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetTypePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderBetTypePerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render bet type performance grid.
    var renderBetTypePerformanceGrid = function (data) {
        var betTypeFormat = '<span class="bettype" data-bettype="{0}">{1}</span>';
        var noOfTradersFormat = '<span class="trader-link link" title="{0}">{1}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" title="{0}">{1}</span>';
        var betTypeCol = '';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBetType', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfTraders, Name: 'ColNoOfTraders', MergeRowNumber: 2 },
                                 { HeaderText: labels.NoOfLeagues, Name: 'ColNoOfLeagues', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.BetType, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
                      {
                          HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                     {
                         HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                         FormatNumber: common.Formats.DecimalFormat, Sort: true
                     },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      }],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportBetTypePerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetTypePerformanceGridEvents();

                    return rows;
                }
            },
            showNumberColumn: true,
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0;

        if (data) {
            $.each(data, function (index, item) {
                betTypeCol = betTypeFormat.format(item.BetType, item.TypeName);
                noOfTradersCol = noOfTradersFormat.format(labels.TraderPerformance, numeral(item.TraderCount).format(common.Formats.IntegerFormat));
                noOfLeaguesCol = noOfLeaguesFormat.format(labels.LeaguePerformance, numeral(item.LeagueCount).format(common.Formats.IntegerFormat));

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColBetType', Value: betTypeCol },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;
                totalLeague += item.LeagueCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfTraders', Value: numeral(totalTrader).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfLeagues', Value: numeral(totalLeague).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: numeral(totalMatch).format(common.Formats.IntegerFormat) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);
        handleBetTypePerformanceGridEvents();
    };

    // Handle bet type performance grid's events.
    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');
            var betTypeId = $betType.attr('data-bettype');
            var betTypeName = $betType.text();

            getTraderPerformanceReport(betTypeId, betTypeName);
        });

        domElements.divBetTypePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');
            var betTypeId = $betType.attr('data-bettype');
            var betTypeName = $betType.text();
            getLeaguePerformanceReport(betTypeId, betTypeName);
        });
    };

    // Show bet type performance report and hide other reports.
    var showBetTypePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
    };

    // Export bet type performance to excel.
    var exportBetTypePerformance = function () {
        common.DownloadFile(urls.ExportBetTypePerformance, parameters);
    };

    // Get trader performance on a specific bet type.
    var getTraderPerformanceReport = function (betTypeId, betTypeName) {
        var traderPerformance = {
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            BetTypeBMFrom: parameters.BetTypeBMFrom,
            BetTypeBMTo: parameters.BetTypeBMTo
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformance),
            success: function (result) {
                renderTraderPerformanceGrid(result, betTypeId, betTypeName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific bet type grid.
    var renderTraderPerformanceGrid = function (data, betTypeId, betTypeName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" title="{0}">{1}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';

        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Trader, Name: 'ColTrader', MergeRowNumber: 2 },
                                 { HeaderText: labels.Grade, Name: 'ColGrade', MergeRowNumber: 2 },
                                { HeaderText: labels.Team, Name: 'ColTeam', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfLeagues, Name: 'ColNoOfLeagues', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      {
                          HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0;

        if (data) {
            $.each(data, function (index, item) {
                traderCol = traderFormat.format(item.CustId, item.TeamId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
                gradeCol = gradeFormat.format(item.Grade);
                teamCol = teamFormat.format(item.TeamName);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol },
                              { Name: 'ColTeam', Value: teamCol },
                              { Name: 'ColNoOfLeagues', Value: item.LeagueCount },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalLeague += item.LeagueCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                          { Name: 'ColNoOfLeagues', Value: totalLeague },
                          { Name: 'ColNoOfMatches', Value: totalMatch },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceGridEvents(betTypeId, betTypeName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (betTypeId, betTypeName) {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            gradeHistory.GetGradeHistory({
                CustId: traderId,
                Username: traderName,
                BetTypes: betTypeId,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate,
                BetTypeBMFrom: parameters.BetTypeBMFrom,
                BetTypeBMTo: parameters.BetTypeBMTo
            });
        });

        domElements.divTraderPerformanceGrid.find('span.team-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            teamHistory.GetTeamHistory({
                CustId: traderId,
                Username: traderName,
                BetTypes: betTypeId,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate,
                BetTypeBMFrom: parameters.BetTypeBMFrom,
                BetTypeBMTo: parameters.BetTypeBMTo
            });
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            getMatchPerformanceOfTraderReport(betTypeId, betTypeName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceOfTraderReport = function (betTypeId, betTypeName, traderId, traderName) {
        var matchPerformanceParamrters = {
            CustId: traderId,
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfBetTypeTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result;
                debugger;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, betTypeId, betTypeName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Customize reloading page.
    var reloadPage = function (pageIndex, pageSize, betTypeId, betTypeName, traderId, traderName) {
        var pageData = [];
        var startIndex = 0;
        var endIndex = 0;
        var counter = 0;

        if (cachedData.MatchPerformance) {
            pageIndex = parseInt(pageIndex);
            pageSize = parseInt(pageSize);
            startIndex = pageIndex * pageSize;
            endIndex = startIndex + pageSize - 1;

            $.each(cachedData.MatchPerformance, function (groupKey, group) {
                var temCounter = counter + group.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        LeagueName: groupKey,
                        GroupTO: 0,
                        GroupJuice: 0,
                        GroupWL: 0,
                        GroupBetcount: 0,
                        ItemList: []
                    };

                    $.each(group, function (index, item) {
                        if (counter >= startIndex && counter <= endIndex) {
                            item.Order = counter;
                            currentGroup.ItemList.push(item);
                        }

                        currentGroup.GroupTO += item.Turnover;
                        currentGroup.GroupJuice += item.Juice;
                        currentGroup.GroupWL += item.WinLoss;
                        currentGroup.GroupBetcount += item.BetCount;

                        counter++;
                    });

                    pageData.push(currentGroup);
                }
            });

            cachedData.TotalItems = counter;
        }

        cachedData.PageIndex = pageIndex;
        cachedData.PageSize = pageSize;
        renderMatchPerformanceOfTraderGrid(pageData, betTypeId, betTypeName, traderId, traderName);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceOfTraderGrid = function (data, betTypeId, betTypeName, traderId, traderName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span> >> {2}</span>';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Match, Name: 'ColMatch', MergeRowNumber: 2 },
                                { HeaderText: labels.EventDate, Name: 'ColEventDate', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                       {
                           HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                           FormatNumber: common.Formats.DecimalFormat
                       },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                         HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                         FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, betTypeName, traderName)
            },
            showTree: true,
            showDistinctRow: false,
            showPager: true,
            customPager: true,
            pagerOption: {
                currentPage: cachedData.PageIndex,
                itemsPerPage: cachedData.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                totalItem: cachedData.TotalItems,
                pagerSelectCallBack: function (pageIndex, pageSize) {
                    reloadPage(pageIndex, pageSize, betTypeId, betTypeName, traderId, traderName);
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var subRows;
        var row;
        var counter = 0;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (groupIndex, group) {
                subRows = [];

                $.each(group.ItemList, function (index, item) {
                    counter++;

                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: item.MatchName },
                                  { Name: 'ColEventDate', Value: item.EventDateString },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColJuice', Value: item.Juice },
                                  { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                                  { Name: 'ColLeftover', Value: item.Leftover },
                                  { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                  { Name: 'ColBetCount', Value: item.BetCount },
                                  { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                              { Name: 'ColTurnover', Value: group.GroupTO },
                              { Name: 'ColJuice', Value: group.GroupJuice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(group.GroupTO > 0 ? group.GroupJuice / group.GroupTO * 100 : null, labels.NA) },
                              { Name: 'ColLeftover', Value: group.GroupWL - group.GroupJuice },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(group.GroupTO > 0 ? (group.GroupWL - group.GroupJuice) / group.GroupTO * 100 : null, labels.NA) },
                              { Name: 'ColWinLoss', Value: group.GroupWL },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(group.GroupTO > 0 ? group.GroupWL / group.GroupTO * 100 : null, labels.NA) },
                              { Name: 'ColBetCount', Value: group.GroupBetcount },
                              { Name: 'ColScore', Value: '' }],
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [11]);
        }

        handleMatchPerformanceOfTraderGridEvents();
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceOfTraderGridEvents = function () {
        domElements.divMatchPerformanceGrid.find('span.forecast').click(function () {
        });

        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });
    };

    // Get league performance on a specific bet type.
    var getLeaguePerformanceReport = function (betTypeId, betTypeName) {
        var leaguePerformance = {
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leaguePerformance),
            success: function (result) {
                renderLeaguePerformanceGrid(result, betTypeId, betTypeName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render league performance grid.
    var renderLeaguePerformanceGrid = function (data, betTypeId, betTypeName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" title="{1}">{2}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.League, Name: 'ColLeague', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfTraders, Name: 'ColNoOfTraders', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      {
                          HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      }],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleLeaguePerformanceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(
                                     item.LeagueId,
                                     labels.TraderPerformance,
                                     numeral(item.TraderCount).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfTraders', Value: numeral(totalTrader).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: numeral(totalMatch).format(common.Formats.IntegerFormat) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(betTypeId, betTypeName);
    };

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function (betTypeId, betTypeName) {
        domElements.divLeaguePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divLeaguePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceOfLeagueReport(betTypeId, betTypeName, leagueId, leagueName);
        });
    };

    // Show league performance report and hide other reports.
    var showLeaguePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
    };

    // Get trader performance on a specific league.
    var getTraderPerformanceOfLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName) {
        var traderPerformanceParamrters = {
            BetType: betTypeId,
            LeagueId: leagueId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfBetTypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformanceParamrters),
            success: function (result) {
                renderTraderPerformanceOfLeagueGrid(result, betTypeId, betTypeName, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific league grid.
    var renderTraderPerformanceOfLeagueGrid = function (data, betTypeId, betTypeName, leagueId, leagueName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" title="{0}">{1}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Trader, Name: 'ColTrader', MergeRowNumber: 2 },
                                { HeaderText: labels.Team, Name: 'ColTeam', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      {
                          HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, betTypeName, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceOfLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceOfLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                traderCol = traderFormat.format(item.CustId, item.TeamId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
                gradeCol = gradeFormat.format(item.Grade);
                teamCol = teamFormat.format(item.TeamName);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColTeam', Value: teamCol },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColNoOfMatches', Value: totalMatch },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [12]);
        }

        handleTraderPerformanceOfLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceOfLeagueGridEvents = function (betTypeId, betTypeName, leagueId, leagueName) {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            gradeHistory.GetGradeHistory({
                CustId: traderId,
                Username: traderName,
                LeagueId: leagueId,
                BetTypes: betTypeId,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate,
                BetTypeBMFrom: parameters.BetTypeBMFrom,
                BetTypeBMTo: parameters.BetTypeBMTo
            });
        });

        domElements.divTraderPerformanceGrid.find('span.team-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            teamHistory.GetTeamHistory({
                CustId: traderId,
                Username: traderName,
                LeagueId: leagueId,
                BetTypes: betTypeId,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate,
                BetTypeBMFrom: parameters.BetTypeBMFrom,
                BetTypeBMTo: parameters.BetTypeBMTo
            });
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            getMatchPerformanceOfLeagueTraderReport(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    // Get match performance by trader.
    var getMatchPerformanceOfLeagueTraderReport = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName) {
        var matchPerformanceParamrters = {
            BetType: betTypeId,
            LeagueId: leagueId,
            CustId: traderId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfBetTypeLeagueTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                renderMatchPerformanceOfLeagueTraderGrid(result, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceOfLeagueTraderGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link" title="{2}"> >> {3}</span>' +
                          '<span> >> {4}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Match, Name: 'ColMatch', MergeRowNumber: 2 },
                                { HeaderText: "Event Date", Name: 'ColEventDate', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      {
                          HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, betTypeName, leagueName, trimLeagueName, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceOfLeagueTraderGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColMatch', Value: item.MatchName },
                              { Name: 'ColEventDate', Value: item.EventDateString },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceByLeagueGrid.fanexGrid("hideColumns", gridOptions, [11]);
        }

        handleMatchPerformanceOfLeagueTraderGridEvents();
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceOfLeagueTraderGridEvents = function () {
        domElements.divMatchPerformanceGrid.find('span.forecast-icon').click(function () {
        });

        domElements.divMatchPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};