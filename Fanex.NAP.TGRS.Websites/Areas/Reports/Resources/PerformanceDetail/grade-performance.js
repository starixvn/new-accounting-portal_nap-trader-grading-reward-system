/* File Created: May 19, 2014 */
/* global Namespace, numeral, Fanex, common, validator, labels, datepickerSetting, messages */

'use strict';
$(document).ready(function () {
    var gradePerformance = new Fanex.NAP.TGRS.PerformanceDetail.GradePerformance();

    gradePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.GradePerformance');
Fanex.NAP.TGRS.PerformanceDetail.GradePerformance = function () {
    var $this = this;
    var domElements = {
        divGradePerformanceFilter: null,
        divDateRange: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divGradePerformanceContainer: null,
        divGradePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null
    };
    var urls = {
        GetGradePerformance: common.ResolveRootUrl('PerformanceDetail/GetGradePerformance'),
        ExportGradePerformance: common.ResolveRootUrl('PerformanceDetail/ExportGradePerformance'),
        GetTraderPerformanceOfGrade: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfGrade'),
        GetMatchPerformanceOfGradeTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfGradeTrader')
    };
    var parameters = {
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLost: null
    };
    var cachedData = {
        MatchPerformance: null,
        GrandTotal: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };
    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divGradePerformanceFilter = $('#divGradePerformanceFilter');
        domElements.divDateRange = domElements.divGradePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divGradePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divGradePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divGradePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divGradePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divGradePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divGradePerformanceFilter.find('#btnGenerate');
        domElements.divGradePerformanceContainer = $('#divGradePerformanceContainer');
        domElements.divGradePerformanceGrid = $('#divGradePerformanceGrid');
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
            labelCss: 'col_3'
        });

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 215,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            create: function () {
                domElements.ddlBetType.multiselect('checkAll');
            }
        }).multiselectfilter({ width: 125 });

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
            if (validator.ValidateForm(domElements.divGradePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.BetTypes = selectedBetTypes.length === betTypeOptions.length ? '0' : selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLost = domElements.txtMinWinLoss.val().replace(/,/g, '');

                hideAllReports();
                getGradePerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divGradePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo);
    };

    // Validate From/To values.
    var validateValueRange = function ($from, $to) {
        var fromValue = $from.val();
        var toValue = $to.val();
        var isValid = true;

        if (fromValue !== '' && toValue !== '') {
            fromValue = fromValue.replace(/,/g, '');
            toValue = toValue.replace(/,/g, '');

            isValid = $.isNumeric(fromValue) && $.isNumeric(toValue) && parseFloat(fromValue) < parseFloat(toValue);
        }

        if (!isValid) {
            validator.ShowError($to, messages.InvalidValue, 'w');
        }

        return isValid;
    };

    // Get grade performance on a specific league.
    var getGradePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetGradePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderGradePerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render grade performance of a specific league grid.
    var renderGradePerformanceGrid = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-grade="{0}">{1}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
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
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportGradePerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleGradePerformanceGridEvents();

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
                    handleGradePerformanceGridEvents();

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
                noOfTradersCol = noOfTradersFormat.format(item.Grade, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColGrade', Value: item.Grade },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                              { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divGradePerformanceGrid.fanexGrid(gridOptions);
        handleGradePerformanceGridEvents();
    };

    // Handle grade performance grid's events.
    var handleGradePerformanceGridEvents = function () {
        domElements.divGradePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var grade = $link.attr('data-grade');

            getTraderPerformanceReport(grade);
        });
    };

    // Show grade performance report and hide other reports.
    var showGradePerformanceReport = function () {
        domElements.divGradePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Export grade performance to excel.
    var exportGradePerformance = function () {
        common.DownloadFile(urls.ExportGradePerformance, parameters);
    };

    // Get trader performance on a specific grade.
    var getTraderPerformanceReport = function (grade) {
        var traderPerformance = {
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformance),
            success: function (result) {
                renderTraderPerformanceGrid(result, grade);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific grade grid.
    var renderTraderPerformanceGrid = function (data, grade) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span><span> >> {1}: {2}</span>';
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-trader-id="{0}">{1}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}"></span>';

        var traderCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 200, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
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
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, labels.Grade, grade)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceGridEvents(grade);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents(grade);

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
                noOfMatchesCol = noOfMatchesFormat.format(item.TraderId, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
                teamCol = teamFormat.format(item.TeamName);
                teamCol += item.HasTeamHistory ? detailIcon.format('team-column') : '';

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColTeam', Value: teamCol, CssClass: 'history' },
                              { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
                          { Name: 'ColNoOfMatches', Value: numeral(data.Total.NoOfMatches).format(common.Formats.IntegerFormat) },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA}]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divGradePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        handleTraderPerformanceGridEvents(grade);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (grade) {
        domElements.divTraderPerformanceGrid.find('span.team-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            teamHistory.GetTeamHistory({
                CustId: traderId,
                Username: traderName,
                Grade: grade,
                BetTypes: parameters.BetTypes,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate
            });
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $link.attr('data-trader-id');
            var traderName = $trader.text();

            getMatchPerformanceReport(grade, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divGradePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (grade, traderId, traderName) {
        var matchPerformanceParamrters = {
            CustId: traderId,
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfGradeTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result.GroupList;
                cachedData.GrandTotal = result.GrandTotal;
                cachedData.TotalItems = result.TotalItems;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, grade, traderId, traderName);
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
    var reloadPage = function (pageIndex, pageSize, grade, traderId, traderName) {
        var pageData = [];
        var startIndex = 0;
        var endIndex = 0;
        var counter = 0;

        if (cachedData.MatchPerformance && cachedData.MatchPerformance.length > 0) {
            pageIndex = parseInt(pageIndex);
            pageSize = parseInt(pageSize);
            startIndex = pageIndex * pageSize;
            endIndex = startIndex + pageSize - 1;

            $.each(cachedData.MatchPerformance, function (groupIndex, group) {
                var temCounter = counter + group.ItemList.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        LeagueId: group.LeagueId,
                        LeagueName: group.LeagueName,
                        Total: group.Total,
                        ItemList: []
                    };

                    $.each(group.ItemList, function (index, item) {
                        if (counter >= startIndex && counter <= endIndex) {
                            item.Order = counter;
                            currentGroup.ItemList.push(item);
                        }

                        counter++;
                    });

                    pageData.push(currentGroup);
                }
            });
        }

        cachedData.PageIndex = pageIndex;
        cachedData.PageSize = pageSize;
        renderMatchPerformanceGrid(pageData, grade, traderId, traderName);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, grade, traderId, traderName) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> {1}: {2}</span>' +
                          '<span> >> {3}</span>';
        var forecastFormat = '<span class="forecast-icon" data-trader-id="{0}" data-match-id="{1}" title="{2}"></span>';
        var forecastCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
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
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, labels.Grade, grade, traderName)
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
                    reloadPage(pageIndex, pageSize, grade, traderId, traderName);
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var subRows;
        var row;
        var counter = 0;

        if (data && data.length > 0) {
            $.each(data, function (groupIndex, group) {
                subRows = [];

                $.each(group.ItemList, function (index, item) {
                    counter++;
                    forecastCol = forecastFormat.format(traderId, item.MatchId);

                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: item.MatchName },
                                  { Name: 'ColEventDate', Value: item.EventDate },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColBetCount', Value: item.BetCount },
                                  { Name: 'ColMargin', Value: item.Margin || labels.NA },
                                  { Name: 'ColForecast', Value: forecastCol}]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                              { Name: 'ColTurnover', Value: group.Total.Turnover },
                              { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                              { Name: 'ColBetCount', Value: group.Total.BetCount },
                              { Name: 'ColMargin', Value: group.Total.Margin || labels.NA },
                              { Name: 'ColForecast', Value: ''}],
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
                          { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
                          { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
                          { Name: 'ColMargin', Value: cachedData.GrandTotal.Margin || labels.NA },
                          { Name: 'ColForecast', Value: ''}]
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

        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};