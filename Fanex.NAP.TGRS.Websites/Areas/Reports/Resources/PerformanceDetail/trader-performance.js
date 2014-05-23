/* File Created: May 19, 2014 */
/* global Namespace, numeral, moment, Fanex, common, layout, validator, labels, datepickerSetting */

'use strict';
$(document).ready(function () {
    var traderPerformance = new Fanex.NAP.TGRS.PerformanceDetail.TraderPerformance();

    traderPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.TraderPerformance');
Fanex.NAP.TGRS.PerformanceDetail.TraderPerformance = function () {
    var $this = this;
    var domElements = {
        divTraderPerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        ddlBetType: null,
        txtTrader: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null
    };
    var urls = {
        GetTraderPerformance: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformance'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTrader')
    };
    var parameters = {
        DateFrom: null,
        DateTo: null,
        BetType: null,
        TraderName: null,
        MarginFrom: null,
        MarginTo: null,
        MinTurnover: null,
        MinWinLoss: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTraderPerformanceFilter = $('#divTraderPerformanceFilter');
        domElements.divDateRange = domElements.divTraderPerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divTraderPerformanceFilter.find('#ddlBetType');
        domElements.txtTrader = domElements.divTraderPerformanceFilter.find('#txtTrader');
        domElements.txtMarginFrom = domElements.divTraderPerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divTraderPerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divTraderPerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divTraderPerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divTraderPerformanceFilter.find('#btnGenerate');
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
            'col_3',
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

            domElements.dpkFromDate = domElements.divTraderPerformanceFilter.find('#dpkFromDate');
            domElements.dpkToDate = domElements.divTraderPerformanceFilter.find('#dpkToDate');

        domElements.txtTrader.focusout(function () {
            var value = $.trim(domElements.txtTrader.val());

            domElements.txtTrader.val(value);
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
            if (validator.ValidateForm(domElements.divTraderPerformanceFilter, 'w')) {
                parameters.DateFrom = domElements.dpkFromDate.val();
                parameters.DateTo = domElements.dpkToDate.val();
                parameters.TraderName = domElements.txtTrader.val();
                parameters.BetType = domElements.ddlBetType.val();
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.MinTurnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.MinWinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

                getTraderPerformanceReport();
            }
        });
    };

    // Get trader performance on a specific league.
    var getTraderPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderTraderPerformanceGrid(result);
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
    var renderTraderPerformanceGrid = function (data) {
        var noOfMatchesFormat = '<span class="no-of-matches link" data-trader-id="{0}">{1}</span>';
        var noOfMatchesCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Traders, Width: 170, Name: 'ColTraders', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Team, Width: 170, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right' },
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
                noOfMatchesCol = noOfMatchesFormat.format(item.TraderId, item.NoOfMatches);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTraders', Value: item.TraderName, CssClass: 'trader-name' },
                              { Name: 'ColGrade', Value: item.Grade },
                              { Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4 },
                          { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
                          { Name: 'ColNoOfMatches', Value: numeral(data.Total.NoOfMatches).format(common.Formats.IntegerFormat) },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        handleTraderPerformanceGridEvents();
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function () {
        domElements.divTraderPerformanceGrid.find('span.no-of-matches').click(function () {
            var $link = $(this);
            var traderId = $link.attr('data-trader-id');
            var traderName = $link.closest('tr').find('div.trader-name').text();

            getMatchPerformanceReport(traderId, traderName);
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (traderId, traderName) {
        var matchPerformanceParamrters = {
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
                renderMatchPerformanceGrid(result, traderId, traderName);
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
    var renderMatchPerformanceGrid = function (data, traderId, traderName) {
        var titleFormat = '<span id="spanTraderLink">{0}</span><span>{1}</span>';
        var forecastFormat = '<span class="forecast link" data-trader-id="{0}" data-match-id="{1}">{2}</span>';
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
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TraderPerformance, traderName)
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
        var counter = 0;

        if (data && data.GroupList.length > 0) {
            $.each(data.GroupList, function (groupIndex, group) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 7, CssClass: 'league-row' }]
                };
                bodyData.push(row);

                $.each(group.ItemList, function (index, item) {
                    counter++;
                    forecastCol = forecastFormat.format(traderId, item.MatchId);

                    row = {
                        Columns: [{ Name: 'ColNo', Value: counter },
                                  { Name: 'ColMatch', Value: item.MatchName },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColBetCount', Value: item.BetCount },
                                  { Name: 'ColMargin', Value: item.Margin },
                                  { Name: 'ColForecast', Value: forecastCol}]
                    };
                    bodyData.push(row);
                });
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
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents();
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function () {
        domElements.divMatchPerformanceGrid.find('span.forecast').click(function () {
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