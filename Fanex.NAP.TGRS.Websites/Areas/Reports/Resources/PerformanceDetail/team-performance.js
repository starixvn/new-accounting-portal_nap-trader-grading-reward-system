/* File Created: May 19, 2014 */
/* global Namespace, numeral, Fanex, common, validator, labels, messages, datepickerSetting, forecastBettype */

'use strict';
$(document).ready(function () {
    var teamPerformance = new Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance();

    teamPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance');
Fanex.NAP.TGRS.PerformanceDetail.TeamPerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divTeamPerformanceFilter: null,
        divDateRange: null,
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
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };
    var urls = {
        GetTeamPerformance: common.ResolveRootUrl('PerformanceDetail/GetTeamPerformance'),
        ExportTeamPerformance: common.ResolveRootUrl('PerformanceDetail/ExportTeamPerformance'),
        GetTraderPerformanceOfTeam: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfTeam'),
        GetMatchPerformanceOfTeamTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTeamTrader'),
        GetBettypeDetail: common.ResolveRootUrl('PerformanceDetail/GetBettypeDetailTeam')
    };
    var parameters = {
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        TeamIds: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLost: null,
        TeamBMFrom: null,
        TeamBMTo: null
    };
    var cachedData = {
        MatchPerformance: null,
        GrandTotal: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };
    var gradeHistory = new Fanex.TGRS.PerformanceSummary.GradeHistory();
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

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
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');
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

        domElements.ddlTeam.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllTeams,
            create: function () {
                domElements.ddlTeam.multiselect('checkAll');
            }
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlTeam.next());
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
            if (validator.ValidateForm(domElements.divTeamPerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');
                var selectedTeams = domElements.ddlTeam.val();
                var teamOptions = domElements.ddlTeam.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.TeamIds = selectedTeams.length === teamOptions.length ? '0' : selectedTeams.join(',');
                parameters.TeamBMFrom = domElements.txtTeamBMFrom.val().replace(/,/g, '');
                parameters.TeamBMTo = domElements.txtTeamBMTo.val().replace(/,/g, '');
                parameters.BetTypes = selectedBetTypes.length === betTypeOptions.length ? '0' : selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLost = domElements.txtMinWinLoss.val().replace(/,/g, '');

                hideAllReports();
                getTeamPerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divTeamPerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo) &&
               validateValueRange(domElements.txtTeamBMFrom, domElements.txtTeamBMTo) &&
               validateDropdownFields();
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

    // Validate dropdown fields.
    var validateDropdownFields = function () {
        var selectedBetTypes = domElements.ddlBetType.val();
        var selectedTeams = domElements.ddlTeam.val();

        if (!selectedBetTypes) {
            validator.ShowError(domElements.ddlBetType.next(), messages.RequiredField, 'w');

            return false;
        } else if (!selectedTeams) {
            validator.ShowError(domElements.ddlTeam.next(), messages.RequiredField, 'w');

            return false;
        } else {
            return true;
        }
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
        var noOfTradersFormat = '<span class="trader-link link" data-team-id="{0}" title="{1}">{2}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
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
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      { HeaderText: labels.TeamBM, Width: 100, Name: 'ColTeamBM', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportTeamPerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTeamPerformanceGridEvents();

                    return rows;
                }
            },
            showNumberColumn: true,
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(
                                     item.TeamId,
                                     labels.TraderPerformance,
                                     numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTeam', Value: item.TeamName, CssClass: 'team-name' },
                              { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                              { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                              { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA },
                              { Name: 'ColTeamBM', Value: item.TeamBM },
                              { Name: 'ColScore', Value: item.Score }]
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
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA },
                          { Name: 'ColTeamBM', Value: '' },
                          { Name: 'ColScore', Value: ''}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTeamPerformanceGrid.fanexGrid(gridOptions);
        handleTeamPerformanceGridEvents();
    };

    // Handle grid's events.
    var handleTeamPerformanceGridEvents = function () {
        domElements.divTeamPerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var teamId = $link.attr('data-team-id');
            var teamName = $link.closest('tr').find('div.team-name').text();

            getTraderPerformanceReport(teamId, teamName);
        });
    };

    // Show team performance report and hide other reports.
    var showTeamPerformanceReport = function () {
        domElements.divTeamPerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Export team performance to excel.
    var exportTeamPerformance = function () {
        common.DownloadFile(urls.ExportTeamPerformance, parameters);
    };

    // Get trader performance on a specific team.
    var getTraderPerformanceReport = function (teamId, teamName) {
        var traderParamrters = {
            TeamId: teamId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfTeam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderParamrters),
            success: function (result) {
                renderTraderPerformanceGrid(result, teamId, teamName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific team grid.
    var renderTraderPerformanceGrid = function (data, teamId, teamName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" title="{0}">{1}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';

        var traderCol = '';
        var gradeCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      { HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true
                      }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceGridEvents(teamId, teamName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents(teamId, teamName);

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

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol, CssClass: 'history' },
                              { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA },
                              { Name: 'ColScore', Value: item.Score }]
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
                          { Name: 'ColMargin', Value: data.Total.Margin || labels.NA },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTeamPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        handleTraderPerformanceGridEvents(teamId, teamName);
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (teamId, teamName) {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            gradeHistory.GetGradeHistory({
                CustId: traderId,
                Username: traderName,
                TeamId: teamId,
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

            getMatchPerformanceReport(teamId, teamName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanTeamLink').click(function () {
            showTeamPerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTeamPerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (teamId, teamName, traderId, traderName) {
        var matchParamrters = {
            TeamId: teamId,
            CustId: traderId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfTeamTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParamrters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result.GroupList;
                cachedData.GrandTotal = result.GrandTotal;
                cachedData.TotalItems = result.TotalItems;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, teamId, teamName, traderId, traderName);
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
    var reloadPage = function (pageIndex, pageSize, teamId, teamName, traderId, traderName) {
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
        renderMatchPerformanceGrid(pageData, teamId, teamName, traderId, traderName);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, teamId, teamName, traderId, traderName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span> >> {2}</span>';
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}">{2}</span>';
        var matchDetailCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName, traderName)
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
                    reloadPage(pageIndex, pageSize, teamId, teamName, traderId, traderName);
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
                    matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: matchDetailCol },
                                  { Name: 'ColEventDate', Value: item.EventDate },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColBetCount', Value: item.BetCount },
                                  { Name: 'ColMargin', Value: item.Margin || labels.NA }]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                              { Name: 'ColTurnover', Value: group.Total.Turnover },
                              { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                              { Name: 'ColBetCount', Value: group.Total.BetCount },
                              { Name: 'ColMargin', Value: group.Total.Margin || labels.NA }],
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
                          { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
                          { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
                          { Name: 'ColMargin', Value: cachedData.GrandTotal.Margin || labels.NA }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(teamId, teamName, traderId, traderName);
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function (teamId, teamName, traderId, traderName) {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanTeamLink').click(function () {
            showTeamPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link ').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            getBettypeDetailReport(teamId, teamName, traderId, traderName, matchId, matchName);
        });
    };

    //Bettype Detail
    var getBettypeDetailReport = function (teamId, teamName, traderId, traderName, matchId, matchName) {
        var bettypeDetailParameters = {
            TeamId: teamId,
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
                renderBettypeDetailGrid(result, matchId, matchName, teamId, teamName, traderId, traderName);
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
    var renderBettypeDetailGrid = function (data, matchId, matchName, teamId, teamName, traderId, traderName) {
        var forecastFormat = '<span class="forecast-icon" data-match-id="{0}" data-bettype="{1}" title="{2}"></span>';
        var forecastCol = '';
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {2}</span>' +
                          '<span title="{3}"> >> {4}</span>';
        //length of >>: 12
        var titleLength = 12 + labels.TeamPerformance.length + teamName.length + traderName.length;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.BetType, Width: 300, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetTypeBM, Width: 110, Name: 'ColBetTypeBM', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Forecast, Width: 100, Name: 'ColForecast', HeaderAlign: 'center', CellAlign: 'center'}],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName, traderName, matchName, shortenName(titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailGridEvents();

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
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var total = {
            Turnover: 0,
            WinLost: 0,
            BetCount: 0,
            Margin: null
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                if (canForecast(item.BetType)) {
                    forecastCol = forecastFormat.format(matchId, item.BetType, labels.Forecast);
                }
                else {
                    forecastCol = 'N/A';
                }
                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColBettype', Value: item.TypeName },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLost },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA },
                              { Name: 'ColBetTypeBM', Value: item.Benchmark },
                              { Name: 'ColForecast', Value: forecastCol}]
                };

                bodyData.push(row);
                total.Turnover += item.Turnover;
                total.WinLost += item.WinLost;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0)
            {
                total.Margin = total.WinLost/total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColWinLoss', Value: total.WinLost },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: total.Margin || labels.NA },
                          { Name: 'ColBetTypeBM', Value: '' },
                          { Name: 'ColForecast', Value: ''}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);
        handleBettypeDetailGridEvents();
    };

    var canForecast = function(bettype) {
        return (forecastBettype.indexOf(bettype) > -1);
    };
    var shortenName = function(prefixLength, name) {
        var titleLength = prefixLength + name.length;
        if (titleLength > maximumMatchNameLength) {
            return name.substring(0,maximumMatchNameLength - prefixLength) + '...';
        }
        else {
            return name;
        }
    };

    // Handle grid's events.
    var handleBettypeDetailGridEvents = function () {
        domElements.divBettypeDetailContainer.find('span.forecast-icon').click(function () {
        });

        domElements.divBettypeDetailContainer.find('#spanTeamLink').click(function () {
            showTeamPerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceReport();
        });
    };

    var showMatchPerformanceReport = function () {
        domElements.divTeamPerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    $this.InitPage = function () {
        cacheDOMElements();
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};