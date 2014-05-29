/* File Created: May 19, 2014 */
/* global Namespace, numeral, moment, Fanex, common, layout, validator, labels, datepickerSetting */

'use strict';
$(document).ready(function () {
    var gradePerformance = new Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance();

    gradePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance');
Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance = function () {
    var $this = this;
    var domElements = {
        divTeamPerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        ddlTeam: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtTeamBMFrom: null,
        txtTeamBMTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divTeamPerformanceContainer: null,
        divTeamPerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null
    };
    var urls = {
        GetTeamPerformance: common.ResolveRootUrl('PerformanceDetail/GetTeamPerformance'),
        GetTraderPerformanceOfTeam: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfTeam'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTrader')
    };
    var parameters = {
        DateFrom: null,
        DateTo: null,
        TeamId: null,
        BetType: null,
        MarginFrom: null,
        MarginTo: null,
        TeamBMFrom: null,
        TeamBMTo: null,
        MinTurnover: null,
        MinWinLoss: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTeamPerformanceFilter = $('#divTeamPerformanceFilter');
        domElements.divDateRange = domElements.divTeamPerformanceFilter.find('#divDateRange');
        domElements.ddlTeam = domElements.divTeamPerformanceFilter.find('#ddlTeam');
        domElements.ddlBetType = domElements.divTeamPerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divTeamPerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divTeamPerformanceFilter.find('#txtMarginTo');
        domElements.txtTeamBMFrom = domElements.divTeamPerformanceFilter.find('#txtTeamBMFrom');
        domElements.txtTeamBMTo = domElements.divTeamPerformanceFilter.find('#txtTeamBMTo');
        domElements.txtMinTurnover = domElements.divTeamPerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divTeamPerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divTeamPerformanceFilter.find('#btnGenerate');
        domElements.divTeamPerformanceContainer = $('#divTeamPerformanceContainer');
        domElements.divTeamPerformanceGrid = $('#divTeamPerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
    };

    // Bind event handlers.
    var initializeFields = function () {
        layout.CreateDateRange(
            domElements.divDateRange,
            labels.FromDate,
            'col_5',
            'datepicker',
            datepickerSetting.DefaultFromDate,
            labels.ToDate,
            'col_5',
            'datepicker',
            datepickerSetting.DefaultToDate,
            datepickerSetting.MinDate,
            datepickerSetting.DefaultToDate,
            function (selectedDate) {
                var limitedDate = moment(selectedDate).add('year', datepickerSetting.AllowYearRange);
                var maxDate = moment(datepickerSetting.DefaultToDate) > limitedDate ?
                              limitedDate.format(common.Formats.MomentDateFormat) :
                              datepickerSetting.DefaultToDate;

                domElements.dpkToDate.datepicker('option', 'maxDate', maxDate);
            },
            function (selectedDate) {
                var limitedDate = moment(selectedDate).add('year', datepickerSetting.AllowYearRange * -1);
                var minDate = moment(datepickerSetting.MinDate) < limitedDate ?
                              limitedDate.format(common.Formats.MomentDateFormat) :
                              datepickerSetting.MinDate;

                domElements.dpkToDate.datepicker('option', 'minDate', minDate);
            });

        domElements.dpkFromDate = domElements.divTeamPerformanceFilter.find('#dpkFromDate');
        domElements.dpkToDate = domElements.divTeamPerformanceFilter.find('#dpkToDate');

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

        domElements.txtTeamBMFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtTeamBMFrom.val());

            domElements.txtTeamBMFrom.val(value);
            validator.ClearError(domElements.txtTeamBMFrom);
        });

        domElements.txtTeamBMTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtTeamBMTo.val());

            domElements.txtTeamBMTo.val(value);
            validator.ClearError(domElements.txtTeamBMTo);
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
            if (validator.ValidateForm(domElements.divTeamPerformanceFilter, 'w')) {
                parameters.DateFrom = domElements.dpkFromDate.val();
                parameters.DateTo = domElements.dpkToDate.val();
                parameters.TeamId = domElements.ddlTeam.val();
                parameters.BetType = domElements.ddlBetType.val();
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.TeamBMFrom = domElements.txtTeamBMFrom.val().replace(/,/g, '');
                parameters.TeamBMTo = domElements.txtTeamBMTo.val().replace(/,/g, '');
                parameters.MinTurnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.MinWinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

                getTeamPerformanceReport();
            }
        });
    };

    // Get team performance report data.
    var getTeamPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTeamPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderTeamPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render team performance grid.
    var renderTeamPerformanceGrid = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}">{1}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 200, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.LeagueBM, Width: 100, Name: 'ColLeagueBM', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 180,
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(item.LeagueId, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin },
                              { Name: 'ColLeagueBM', Value: item.LeagueBM}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2 },
                          { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin },
                          { Name: 'ColLeagueBM', Value: data.Total.LeagueBM}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTeamPerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents();
    };

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function () {
        domElements.divTeamPerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league-id');
            var leagueName = $link.closest('tr').find('div.league-name').text();

            getTraderPerformanceReport(leagueId, leagueName);
        });
    };

    // Show league performance report and hide other reports.
    var showLeaguePerformanceReport = function () {
        domElements.divTeamPerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Get trader performance on a specific league.
    var getTraderPerformanceReport = function (leagueId, leagueName) {
        var traderPerformanceParamrters = {
            LeagueId: leagueId
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
        var noOfTradersFormat = '<span class="trader-name-link link" data-league-id="{0}" data-trader-id="{1}">{2}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Traders, Width: 170, Name: 'ColTraders', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Team, Width: 170, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 180,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: '<span id="spanLeagueLink">{0}</span><span>{1}</span>'.format(labels.LeaguePerformance, leagueName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(leagueId, item.TraderId, item.TraderName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTraders', Value: noOfTradersCol },
                              { Name: 'ColGrade', Value: item.Grade },
                              { Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4 },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin}]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTeamPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        handleTraderPerformanceGridEvents(leagueName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (leagueName) {
        domElements.divTraderPerformanceGrid.find('span.trader-name-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league-id');
            var traderId = $link.attr('data-trader-id');
            var traderName = $link.text();

            getMatchPerformanceReport(leagueId, leagueName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTeamPerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (leagueId, leagueName, traderId, traderName) {
        var matchPerformanceParamrters = {
            LeagueId: leagueId,
            TraderId: traderId
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfTrader,
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
        var titleFormat = '<span id="spanLeagueLink">{0}</span><span id="spanTraderLink">{1}</span><span>{2}</span>';
        var forecastFormat = '<span class="forecast link" data-league-id="{0}" data-trader-id="{1}" data-match-id="{2}">{3}</span>';
        var forecastCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 300, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Forecast, Width: 100, Name: 'ColForecast', HeaderAlign: 'center', CellAlign: 'center' }, ],
            gridExpandHeight: 180,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, leagueName, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                forecastCol = forecastFormat.format(leagueId, traderId, item.MatchId);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColMatch', Value: item.MatchName },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin },
                              { Name: 'ColForecast', Value: forecastCol}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2 },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin}]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTeamPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents();
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function () {
        domElements.divMatchPerformanceGrid.find('span.forecast').click(function () {
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divTraderPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};