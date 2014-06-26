/* File Created: May 19, 2014 */
/* global Namespace, numeral, Fanex, common, validator, labels, datepickerSetting, messages */

'use strict';
$(document).ready(function () {
    var leaguePerformance = new Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance();

    leaguePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance');
Fanex.NAP.TGRS.PerformanceDetail.LeaguePerformance = function () {
    var $this = this;
    var domElements = {
        divLeaguePerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        txtLeague: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtLeagueBMFrom: null,
        txtLeagueBMTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null
    };
    var urls = {
        GetLeaguePerformance: common.ResolveRootUrl('PerformanceDetail/GetLeaguePerformance'),
        ExportLeaguePerformance: common.ResolveRootUrl('PerformanceDetail/ExportLeaguePerformance'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfLeague'),
        GetMatchPerformanceOfLeagueTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfLeagueTrader')
    };
    var parameters = {
        FromDate: null,
        ToDate: null,
        LeagueName: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        LeagueBMFrom: null,
        LeagueBMTo: null,
        Turnover: null,
        WinLost: null
    };
    var gradeHistory = new Fanex.TGRS.PerformanceSummary.GradeHistory();
    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divLeaguePerformanceFilter = $('#divLeaguePerformanceFilter');
        domElements.divDateRange = domElements.divLeaguePerformanceFilter.find('#divDateRange');
        domElements.txtLeague = domElements.divLeaguePerformanceFilter.find('#txtLeague');
        domElements.ddlBetType = domElements.divLeaguePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divLeaguePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divLeaguePerformanceFilter.find('#txtMarginTo');
        domElements.txtLeagueBMFrom = domElements.divLeaguePerformanceFilter.find('#txtLeagueBMFrom');
        domElements.txtLeagueBMTo = domElements.divLeaguePerformanceFilter.find('#txtLeagueBMTo');
        domElements.txtMinTurnover = domElements.divLeaguePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divLeaguePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divLeaguePerformanceFilter.find('#btnGenerate');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
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
                domElements.ddlBetType.multiselect('checkAll');
            }
        }).multiselectfilter({ width: 125 }).change(function () {
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

        domElements.txtLeagueBMFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtLeagueBMFrom.val());

            domElements.txtLeagueBMFrom.val(value);
            validator.ClearError(domElements.txtLeagueBMFrom);
        });

        domElements.txtLeagueBMTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtLeagueBMTo.val());

            domElements.txtLeagueBMTo.val(value);
            validator.ClearError(domElements.txtLeagueBMTo);
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
            if (validator.ValidateForm(domElements.divLeaguePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueName = domElements.txtLeague.val();
                parameters.BetTypes = selectedBetTypes.length === betTypeOptions.length ? '0' : selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.LeagueBMFrom = domElements.txtLeagueBMFrom.val().replace(/,/g, '');
                parameters.LeagueBMTo = domElements.txtLeagueBMTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLost = domElements.txtMinWinLoss.val().replace(/,/g, '');

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
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtLeagueBMFrom, domElements.txtLeagueBMTo) &&
               validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo) &&
               validateBetType();
    };

    // Validate From/To values.
    var validateValueRange = function ($from, $to) {
        var fromValue = $from.val();
        var toValue = $to.val();
        var isValid = true;

        if (fromValue !== '' && toValue !== '') {
            fromValue = fromValue.replace(/,/g, '');
            toValue = toValue.replace(/,/g, '');

            isValid = $.isNumeric(fromValue) && $.isNumeric(toValue) && parseFloat(fromValue) <= parseFloat(toValue);
        }

        if (!isValid) {
            validator.ShowError($to, messages.InvalidValue, 'w');
        }

        return isValid;
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
        var noOfTradersCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc'
                      },
                      { HeaderText: labels.LeagueBM, Width: 100, Name: 'ColLeagueBM', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      }],
            gridExpandHeight: 260,
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
            showNumberColumn: true,
            showPager: true,
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

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(
                                    item.LeagueId,
                                    labels.TraderPerformance,
                                    numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA },
                              { Name: 'ColLeagueBM', Value: item.LeagueBM}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA },
                          { Name: 'ColLeagueBM', Value: ''}]
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
    };

    // Show league performance report and hide other reports.
    var showLeaguePerformanceReport = function () {
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
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
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 200, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc'
                      }],
            gridExpandHeight: 260,
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

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                traderCol = traderFormat.format(item.TraderId, item.TeamId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
                gradeCol = gradeFormat.format(item.Grade);
                gradeCol += item.HasGradeHistory ? detailIcon.format('grade-column', labels.GradeHistoryDetail) : '';
                teamCol = teamFormat.format(item.TeamName);
                teamCol += item.HasTeamHistory ? detailIcon.format('team-column', labels.TeamHistoryDetail) : '';

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol, CssClass: 'history' },
                              { Name: 'ColTeam', Value: teamCol, CssClass: 'history' },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA}]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        handleTraderPerformanceGridEvents(leagueId, leagueName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (leagueId, leagueName) {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            gradeHistory.GetGradeHistory({
                CustId: traderId,
                Username: traderName,
                LeagueId: leagueId,
                BetTypes: parameters.BetTypes,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate
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
        var forecastFormat = '<span class="forecast-icon" data-league-id="{0}" data-trader-id="{1}" data-match-id="{2}" title="{3}"></span>';
        var forecastCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Forecast, Width: 100, Name: 'ColForecast', HeaderAlign: 'center', CellAlign: 'center' }, ],
            gridExpandHeight: 260,
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
                    handleMatchPerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                forecastCol = forecastFormat.format(leagueId, traderId, item.MatchId, labels.Forecast);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColMatch', Value: item.MatchName },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA },
                              { Name: 'ColForecast', Value: forecastCol}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA}]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents();
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function () {
        domElements.divMatchPerformanceGrid.find('span.forecast-icon').click(function () {
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