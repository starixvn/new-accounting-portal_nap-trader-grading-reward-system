/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, datepickerSetting, forecastBettype, messages */

////'use strict';
$(document).ready(function () {
    var leaguePerformance = new Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance();

    leaguePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance');
Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divLeaguePerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        txtLeague: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null,
        divMatchPerformanceOfLeagueContainer: null,
        divMatchPerformanceOfLeagueGrid: null,
        divBettypePerformanceOfLeagueMatchContainer: null,
        divBettypePerformanceOfLeagueMatchGrid: null
    };
    var urls = {
        GetInitializedData: common.ResolveRootUrl('NewPerformanceDetail/GetInitializedData'),
        GetLeaguePerformance: common.ResolveRootUrl('NewPerformanceDetail/GetLeaguePerformance'),
        ExportLeaguePerformance: common.ResolveRootUrl('NewPerformanceDetail/ExportLeaguePerformance'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformanceOfLeague'),
        GetMatchPerformanceOfLeagueTrader: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfLeagueTrader'),
        GetMatchPerformanceOfLeague: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfLeague'),
        GetBettypeDetail: common.ResolveRootUrl('NewPerformanceDetail/GetBettypeDetailLeague'),
        GetBettypePerformanceOfLeagueMatch: common.ResolveRootUrl('NewPerformanceDetail/GetBettypePerformanceOfLeagueMatch')
    };
    var parameters = {
        FromDate: null,
        ToDate: null,
        LeagueName: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLoss: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divLeaguePerformanceFilter = $('#divLeaguePerformanceFilter');
        domElements.divDateRange = domElements.divLeaguePerformanceFilter.find('#divDateRange');
        domElements.txtLeague = domElements.divLeaguePerformanceFilter.find('#txtLeague');
        domElements.ddlBetType = domElements.divLeaguePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divLeaguePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divLeaguePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divLeaguePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divLeaguePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divLeaguePerformanceFilter.find('#btnGenerate');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');
        domElements.divMatchPerformanceOfLeagueContainer = $('#divMatchPerformanceOfLeagueContainer');
        domElements.divMatchPerformanceOfLeagueGrid = $('#divMatchPerformanceOfLeagueGrid');
        domElements.divBettypePerformanceOfLeagueMatchContainer = $('#divBettypePerformanceOfLeagueMatchContainer');
        domElements.divBettypePerformanceOfLeagueMatchGrid = $('#divBettypePerformanceOfLeagueMatchGrid');
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

        domElements.txtLeague.focusout(function () {
            var value = $.trim(domElements.txtLeague.val());

            domElements.txtLeague.val(value);
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
            if (validator.ValidateForm(domElements.divLeaguePerformanceFilter, 'w')) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueName = domElements.txtLeague.val();

                hideAllReports();
                getLeaguePerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateBetType();
    };

    // Validate Bet Type field.
    var validateBetType = function () {
        var selectedBetTypes = domElements.ddlBetType.val();

        if (!selectedBetTypes) {
            validator.ShowError(domElements.ddlBetType.next(), messages.RequiredField, 'w');

            return false;
        } else {
            return true;
        }
    };

    // Get league performance report data.
    var getLeaguePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderLeaguePerformanceGrid(result);
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
    var renderLeaguePerformanceGrid = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" title="{1}">{2}</span>';
        var noOfMatchsFormat = '<span class="match-link link" data-league-id="{0}" data-league-name="{1}" title="{2}">{3}</span>';
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
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.NoOfTraders, Width: 60, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      {
                          HeaderText: labels.NoOfMatches, Width: 60, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
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
                    exportLeaguePerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents();

                    return rows;
                }
            },
            showPager: true,
            showNumberColumn: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleLeaguePerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;
        
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(
                                    item.LeagueId,
                                    labels.TraderPerformance,
                                    numeral(item.TraderCount).format(common.Formats.IntegerFormat));
                var noOfMatchesCol = noOfMatchsFormat.format(item.LeagueId, item.LeagueName, labels.MatchPerformance, item.MatchCount);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                              { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                              { Name: 'ColLeftover', Value: item.WinlostLeftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount }]
                };

                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });
            
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfTraders', Value: numeral(totalTrader).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: numeral(totalMatch).format(common.Formats.IntegerFormat) },    
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },                      
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents();
    };

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function () {
        domElements.divLeaguePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceReport(leagueId, leagueName);
        });

        domElements.divLeaguePerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            getMatchPerformanceOfLeagueReport(leagueId, leagueName);
        });
    };

    // Show league performance report and hide other reports.
    var showLeaguePerformanceReport = function () {
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    // Export league performance to excel.
    var exportLeaguePerformance = function () {
        common.DownloadFile(urls.ExportLeaguePerformance, parameters);
    };

    // Get trader performance on a specific league.
    var getTraderPerformanceReport = function (leagueId, leagueName) {
        var traderPerformanceParamrters = {
            LeagueId: leagueId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformanceParamrters),
            success: function (result) {
                renderTraderPerformanceGrid(result, leagueId, leagueName);
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
    var renderTraderPerformanceGrid = function (data, leagueId, leagueName) {
        var traderFormat = '<span class="trader" data-cust-id="{0}">{1}</span>';
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
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 140, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.NoOfMatches, Width: 60, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 120, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 105, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 105, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 105, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 90, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      {
                          HeaderText: labels.Score, Width: 90, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>'.format(labels.LeaguePerformance, leagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceGridEvents(leagueId, leagueName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents(leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                traderCol = traderFormat.format(item.CustId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
                gradeCol = gradeFormat.format(item.Grade);
                teamCol = teamFormat.format(item.TeamName);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol },
                              { Name: 'ColTeam', Value: teamCol },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                              { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                              { Name: 'ColLeftover', Value: item.WinlostLeftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };
                
                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                          { Name: 'ColNoOfMatches', Value: totalMatch },
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
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
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [17]);
        }

        handleTraderPerformanceGridEvents(leagueId, leagueName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (leagueId, leagueName) {
        domElements.divTraderPerformanceGrid.find('span.team-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            teamHistory.GetTeamHistory({
                CustId: traderId,
                Username: traderName,
                LeagueId: leagueId,
                BetTypes: parameters.BetTypes,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate
            });
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            getMatchPerformanceReport(leagueId, leagueName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (leagueId, leagueName, traderId, traderName) {
        var matchPerformanceParamrters = {
            LeagueId: leagueId,
            CustId: traderId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfLeagueTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                renderMatchPerformanceGrid(result, leagueId, leagueName, traderId, traderName);
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
    var renderMatchPerformanceGrid = function (data, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span> >> {2}</span>';
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}">{2}</span>';
        var matchDetailCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Match, Name: 'ColMatch', MergeRowNumber: 2 },
                                { HeaderText: "Event Date", Name: 'ColEventDate', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Event Date", Width: 90, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, leagueName, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceGridEvents(leagueId, leagueName, traderId, traderName);
                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColMatch', Value: matchDetailCol },
                              { Name: 'ColEventDate', Value: item.EventDateString },
                              { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                              { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                              { Name: 'ColLeftover', Value: item.WinlostLeftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount }]
                };

                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
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
        handleMatchPerformanceGridEvents(leagueId, leagueName, traderId, traderName);
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function (leagueId, leagueName, traderId, traderName) {
        domElements.divMatchPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            getBettypeDetailReport(leagueId, leagueName, traderId, traderName, matchId, matchName);
        });

    };

    // Show trader performance report and hide other reports.
    var showMatchPerformanceReport = function () {
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    //Bettype Detail
    var getBettypeDetailReport = function (leagueId, leagueName, traderId, traderName, matchId, matchName) {
        var bettypeDetailParameters = {
            LeagueId: leagueId,
            CustId: traderId,
            MatchId: matchId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeDetailGrid(result, matchId, matchName, leagueId, leagueName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render bettype performance grid.
    var renderBettypeDetailGrid = function (data, matchId, matchName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {2}</span>' +
                          '<span title="{3}"> >> {4}</span>';
        //length of >>: 12
        var titleLength = 12 + labels.LeaguePerformance.length + leagueName.length + traderName.length;
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBettype', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [
                    { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                    { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
                      },
                    {
                        HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.IntegerFormat, Sort: true
                    },
                    {
                        HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                    }
            ],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, leagueName, traderName, matchName, shortenName(common.HasViewScorePermission ? 113 : 93, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showNumberColumn: true,
            showDistinctRow: false,
            showHighlightRow: false,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push(
                        { Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBettype', Value: item.TypeName },
                        { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                        { Name: 'ColJuice', Value: item.Juice },
                        { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                        { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                        { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                        { Name: 'ColLeftover', Value: item.WinlostLeftover },
                        { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                        { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalBetcount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }
                ]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [14]);
        }

        handleBettypeDetailGridEvents();
    };

    //LEAGUE - MATCH SECTION.

    // Get match performance by league.
    var getMatchPerformanceOfLeagueReport = function (leagueId, leagueName) {
        var matchPerformanceParamrters = {
            LeagueId: leagueId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                renderMatchPerformanceOfLeagueGrid(result, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render match performance of a specific league grid.
    var renderMatchPerformanceOfLeagueGrid = function (data, leagueId, leagueName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span> >> {1}</span>';
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}">{2}</span>';
        var matchDetailCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Match, Name: 'ColMatch', MergeRowNumber: 2 },
                                { HeaderText: "Event Date", Name: 'ColEventDate', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Event Date", Width: 90, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, leagueName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceOfLeagueGridEvents(leagueId, leagueName);
                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalBetcount = 0;

        if (data) {
            $.each(data, function (index, item) {
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColMatch', Value: matchDetailCol },
                              { Name: 'ColEventDate', Value: item.EventDateString },
                                { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                                { Name: 'ColJuice', Value: item.Juice },
                                { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                                { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                                { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                                { Name: 'ColLeftover', Value: item.WinlostLeftover },
                                { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                                { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                                { Name: 'ColTurnover', Value: item.Turnover },
                                { Name: 'ColWinLoss', Value: item.WinLoss },
                                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount }]
                };

                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceOfLeagueGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfLeagueGridEvents(leagueId, leagueName);
    };

    // Handle match performance of league grid's events.
    var handleMatchPerformanceOfLeagueGridEvents = function (leagueId, leagueName) {

        domElements.divMatchPerformanceOfLeagueContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divMatchPerformanceOfLeagueContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            getBettypeOfLeagueMatchDetailReport(leagueId, leagueName, matchId, matchName);
        });

    };

    //Bettype Detail (of league and match)
    var getBettypeOfLeagueMatchDetailReport = function (leagueId, leagueName, matchId, matchName) {
        var bettypeDetailParameters = {
            LeagueId: leagueId,
            MatchId: matchId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypePerformanceOfLeagueMatch,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeOfLeagueMatchDetailGrid(result, matchId, matchName, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render bettype performance (of league and match) grid.
    var renderBettypeOfLeagueMatchDetailGrid = function (data, matchId, matchName, leagueId, leagueName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        //length of >>: 8
        var titleLength = 8 + labels.LeaguePerformance.length + leagueName.length;
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBettype', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuiceTO", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "ColLeftoverTO", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 3 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [
                    { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                    { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColJuiceTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColJuiceMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColLeftoverTO', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.MarginTotal, Width: 80, Name: 'ColLeftoverMarginTotal', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 110, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 80, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$', SortDirection: 'desc'
                      },
                    {
                        HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.IntegerFormat, Sort: true
                    }
            ],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, leagueName, matchName, shortenName(98, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeOfLeagueMatchDetailGridEvents();

                    return rows;
                }
            },
            showNumberColumn: true,
            showDistinctRow: false,
            showHighlightRow: false,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypeOfLeagueMatchDetailGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalWL = 0, totalJuiceWL = 0, totalJuiceTO = 0, totalLeftoverWL = 0, totalLeftoverTO = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push(
                        { Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBettype', Value: item.TypeName },
                        { Name: 'ColJuiceTO', Value: item.TurnoverJuice },
                        { Name: 'ColJuice', Value: item.Juice },
                        { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                        { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(item.JuiceMarginTotal, labels.NA) },
                        { Name: 'ColLeftoverTO', Value: item.TurnoverLeftover },
                        { Name: 'ColLeftover', Value: item.WinlostLeftover },
                        { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                        { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(item.LeftoverMarginTotal, labels.NA) },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                        { Name: 'ColBetCount', Value: item.BetCount }
                        );
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalJuiceWL += item.Juice;
                totalJuiceTO += item.TurnoverJuice;
                totalLeftoverWL += item.WinlostLeftover;
                totalLeftoverTO += item.TurnoverLeftover;
                totalBetcount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColJuiceTO', Value: totalJuiceTO },
                          { Name: 'ColJuice', Value: totalJuiceWL },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalJuiceTO > 0 ? totalJuiceWL / totalJuiceTO * 100 : null, labels.NA) },
                          { Name: 'ColJuiceMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuiceWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverTO', Value: totalLeftoverTO },
                          { Name: 'ColLeftover', Value: totalLeftoverWL },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalLeftoverTO > 0 ? totalLeftoverWL / totalLeftoverTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftoverMarginTotal', Value: common.GetNumWithLabel(totalTO > 0 ? totalLeftoverWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount }
                ]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');

        domElements.divBettypePerformanceOfLeagueMatchGrid.fanexGrid(gridOptions);

        //if (!common.HasViewScorePermission) {
        //    domElements.divBettypePerformanceOfLeagueMatchGrid.fanexGrid("hideColumns", gridOptions, [10]);
        //}

        handleBettypeOfLeagueMatchDetailGridEvents();
    };

    // Handle bettype of League and Match grid's events.
    var handleBettypeOfLeagueMatchDetailGridEvents = function () {

        domElements.divBettypePerformanceOfLeagueMatchContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divBettypePerformanceOfLeagueMatchContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceOfLeagueReport();
        });

    };

    // Show match performance of league report and hide other reports.
    var showMatchPerformanceOfLeagueReport = function () {
        domElements.divMatchPerformanceOfLeagueContainer.removeClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    //END LEAGUE - MATCH SECTION.

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    // Handle grid's events.
    var handleBettypeDetailGridEvents = function () {
        domElements.divBettypeDetailContainer.find('span.forecast-icon').click(function () {
        });

        domElements.divBettypeDetailContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceReport();
        });

    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};