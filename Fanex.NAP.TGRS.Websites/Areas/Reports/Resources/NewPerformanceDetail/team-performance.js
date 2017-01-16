/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, messages, datepickerSetting, forecastBettype */

////'use strict';
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
        divBettypeDetailGrid: null,
        divLeagueDetailContainer: null,
        divLeagueDetailGrid: null
    };
    var urls = {
        GetTeamPerformance: common.ResolveRootUrl('NewPerformanceDetail/GetTeamPerformance'),
        ExportTeamPerformance: common.ResolveRootUrl('NewPerformanceDetail/ExportTeamPerformance'),
        GetTraderPerformanceOfTeam: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformanceOfTeam'),
        GetMatchPerformanceOfTeamTrader: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfTeamTrader'),
        GetBettypeDetail: common.ResolveRootUrl('NewPerformanceDetail/GetBettypeDetailTeam'),
        GetLeagueDetail: common.ResolveRootUrl('NewPerformanceDetail/GetLeagueDetailTeam'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformanceOfLeagueTeam'),
        GetMatchTraderLeagueTeam: common.ResolveRootUrl('NewPerformanceDetail/GetMatchPerformanceOfTraderLeagueTeam')
    };
    var parameters = {
        FromDate: null,
        ToDate: null,
        TeamIds: null
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
        domElements.divTeamPerformanceFilter = $('#divTeamPerformanceFilter');
        domElements.divDateRange = domElements.divTeamPerformanceFilter.find('#divDateRange');
        domElements.ddlTeam = domElements.divTeamPerformanceFilter.find('#ddlTeam');
        domElements.ddlBetType = domElements.divTeamPerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divTeamPerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divTeamPerformanceFilter.find('#txtMarginTo');
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
        domElements.divLeagueDetailContainer = $('#divLeagueDetailContainer');
        domElements.divLeagueDetailGrid = $('#divLeagueDetailGrid');
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
                var selectedTeams = domElements.ddlTeam.val();
                var teamOptions = domElements.ddlTeam.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.TeamIds = selectedTeams.length === teamOptions.length ? '0' : selectedTeams.join(',');

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
        domElements.divLeagueDetailContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo) &&
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
        var noOfTradersFormat = '<span class="trader-link link" data-team-id="{0}" data-team-name="{1}">{2}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-team-id="{0}" data-team-name="{1}">{2}</span>';
        var noOfTradersCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Team, Name: 'ColTeam', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfTraders, Name: 'ColNoOfTraders', MergeRowNumber: 2 },
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
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
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
            showPager: true,
            showNumberColumn: true,
            showFooter: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTeamPerformanceGridEvents();

                    return rows;
                }
            }
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0;

        if (data) {
            $.each(data, function (index, item) {
                noOfTradersCol = noOfTradersFormat.format(
                                     item.TeamId,
                                      item.TeamName,
                                     numeral(item.TraderCount).format(common.Formats.IntegerFormat));
                noOfLeaguesCol = noOfLeaguesFormat.format(
                                    item.TeamId,
                                    item.TeamName,
                                    numeral(item.LeagueCount).format(common.Formats.IntegerFormat));
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTeam', Value: item.TeamName },
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
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
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
                          { Name: 'ColBetCount', Value: totalBetcount },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTeamPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTeamPerformanceGrid.fanexGrid("hideColumns", gridOptions, [13]);
        }

        handleTeamPerformanceGridEvents();
    };

    // Handle grid's events.
    var handleTeamPerformanceGridEvents = function () {
        domElements.divTeamPerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var teamId = $link.attr('data-team-id');
            var teamName = $link.attr("data-team-name");

            getTraderPerformanceReport(teamId, teamName);
        });
        $(".league-link").click(function () {
            var link = $(this);
            var teamId = link.attr("data-team-id");
            var teamName = link.attr("data-team-name");
            getLeagueDetail(teamId, teamName);
        });
    };

    var getLeagueDetail = function (teamId, teamName) {
        var criteria = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            TeamId: teamId,
            Bettypes: parameters.BetTypes
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeagueDetail,
            data: criteria,
            success: function (data) {
                renderLeagueDetailGrid(data, teamId, teamName);
            },
            error: common.HandleAjaxError,
            complete: common.EnableInput
        });
    };

    var renderLeagueDetailGrid = function (data, teamId, teamName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span><span> >> {1} </span>';
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
                text: titleFormat.format(labels.TeamPerformance, teamName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents(teamId, teamName);

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
                    handleLeaguePerformanceGridEvents(teamId, teamName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data && data.length > 0) {
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
        domElements.divTeamPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeagueDetailGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(teamId, teamName);
    }

    var handleLeaguePerformanceGridEvents = function (teamId, teamName) {
        domElements.divLeagueDetailContainer.find('#spanTeamLink').click(function () {
            domElements.divLeagueDetailContainer.addClass('display-none');
            domElements.divTeamPerformanceContainer.removeClass('display-none');
        });

        domElements.divLeagueDetailGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceReportByLeague(teamId, teamName, leagueId, leagueName);
        });
    };

    var getTraderPerformanceReportByLeague = function (teamId, teamName, leagueId, leagueName) {
        var criteria = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Bettypes: parameters.BetTypes,
            TeamId: teamId,
            LeagueId: leagueId
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(criteria),
            success: function (result) {
                renderTraderPerformanceByLeagueGrid(result, teamId, teamName, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    // Render trader performance of a specific league grid.
    var renderTraderPerformanceByLeagueGrid = function (data, teamId, teamName, leagueId, leagueName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1} </span>' +
                          '<span title="{2}"> >> {3}</span>';
        var traderFormat = '<span class="trader" data-cust-id="{0}">{1}</span>';
        var noOfMatchesFormat = '<span class="match-link link" title="{0}">{1}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
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
                                { HeaderText: labels.Grade, Name: 'ColGrade', MergeRowNumber: 2 },
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
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
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
                text: titleFormat.format(labels.TeamPerformance, teamName, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceByLeagueGridEvents(teamId, teamName, leagueId, leagueName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceByLeagueGridEvents(teamId, teamName, leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                traderCol = traderFormat.format(item.CustId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
                gradeCol = teamFormat.format(item.Grade);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol },
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
        domElements.divLeagueDetailContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [12]);
        }

        handleTraderPerformanceByLeagueGridEvents(teamId, teamName, leagueId, leagueName);
    };

    var handleTraderPerformanceByLeagueGridEvents = function (teamId, teamName, leagueId, leagueName) {
        domElements.divTraderPerformanceContainer.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            getMatchPerformanceOfGradeLeagueTraderReport(teamId, teamName, leagueId, leagueName, traderId, traderName);
        });

        domElements.divTraderPerformanceContainer.find('#spanTeamLink').click(function () {
            domElements.divTraderPerformanceContainer.addClass('display-none');
            domElements.divTeamPerformanceContainer.removeClass('display-none');
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            domElements.divTraderPerformanceContainer.addClass('display-none');
            domElements.divLeagueDetailContainer.removeClass('display-none');
        });
    };

    var getMatchPerformanceOfGradeLeagueTraderReport = function (teamId, teamName, leagueId, leagueName, traderId, traderName) {
        var criteria = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Bettypes: parameters.BetTypes,
            CustId: traderId,
            TeamId: teamId,
            LeagueId: leagueId
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetMatchTraderLeagueTeam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(criteria),
            success: function (result) {
                renderMatchPerformanceOfGradeLeagueTraderGrid(result, teamId, teamName, leagueId, leagueName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderMatchPerformanceOfGradeLeagueTraderGrid = function (data, teamId, teamName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                         '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1} </span>' +
                         '<span id="spanTraderLink" class="breadcrumb-link" title="{2}"> >> {3}</span>' +
                         '<span> >> {4}</span>';

        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
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
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
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
                      }],
            gridExpandHeight: 200,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName, leagueName, trimLeagueName, traderName)
            },
            showPager: true,
            sortOption: {
                afterGridSorted: function (rows) {
                    handleMatchPerformanceOfGradeLeagueTraderGridEvents(teamId, teamName, leagueId, leagueName, traderId, traderName);

                    return rows;
                }
            },
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceOfGradeLeagueTraderGridEvents(teamId, teamName, leagueId, leagueName, traderId, traderName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColMatch', Value: matchDetailCol },
                              { Name: 'ColEventDate', Value: item.EventDateString },
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
                          { Name: 'ColBetCount', Value: totalBetcount }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfGradeLeagueTraderGridEvents(teamId, teamName, leagueId, leagueName, traderId, traderName);
    };

    var handleMatchPerformanceOfGradeLeagueTraderGridEvents = function (teamId, teamName, leagueId, leagueName, traderId, traderName) {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divTraderPerformanceContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('#spanLeagueLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divLeagueDetailContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('#spanTeamLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divTeamPerformanceContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();

            getBettypeDetailOfGradeLeagueReport(teamId, teamName, leagueId, leagueName, traderId, traderName, matchId, matchName);
        });
    };

    var getBettypeDetailOfGradeLeagueReport = function (teamId, teamName, leagueId, leagueName, traderId, traderName, matchId, matchName) {
        var criteria = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            CustId: traderId,
            MatchId: matchId
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(criteria),
            success: function (result) {
                renderBettypeDetailOfGradeLeagueGrid(result, teamId, teamName, matchId, matchName, leagueId, leagueName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBettypeDetailOfGradeLeagueGrid = function (data, teamId, teamName, matchId, matchName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1} </span>' +
                            '<span id="spanTraderLink" class="breadcrumb-link" title="{2}"> >> {3}</span>' +
                            '<span id="spanMatchLink"  class="breadcrumb-link"> >> {4}</span>' +
                            '<span title="{5}"> >> {6}</span>';

        //length of >>: 12
        var trimLeagueName = leagueName.length > 40 ? leagueName.substring(0, 41) : leagueName;
        var titleLength = 12 + labels.TeamPerformance.length + trimLeagueName.length + traderName.length + teamName.length;
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBettype', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [
                    { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                    { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                    {
                        HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
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
                        HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                    }
            ],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName,
                    leagueName, trimLeagueName, traderName, matchName, shortenName(common.HasViewScorePermission ? 109 : 89, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailOfGradeLeagueGridEvents();

                    return rows;
                }
            },
            showNumberColumn: false,
            showDistinctRow: false,
            showHighlightRow: false,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypeDetailOfGradeLeagueGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push(
                        { Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBettype', Value: item.TypeName },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColJuice', Value: item.Juice },
                        { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                        { Name: 'ColLeftover', Value: item.Leftover },
                        { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };

                bodyData.push(row);

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalBetcount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
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
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleBettypeDetailOfGradeLeagueGridEvents();
    };

    var handleBettypeDetailOfGradeLeagueGridEvents = function () {
        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divTraderPerformanceContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanLeagueLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divLeagueDetailContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanTeamLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divTeamPerformanceContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divMatchPerformanceContainer.removeClass('display-none');
        });
    };

    // Show team performance report and hide other reports.
    var showTeamPerformanceReport = function () {
        domElements.divTeamPerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divLeagueDetailContainer.addClass('display-none');
    };

    // Export team performance to excel.
    var exportTeamPerformance = function () {
        common.DownloadFile(urls.ExportTeamPerformance, parameters);
    };

    // Get trader performance on a specific team.
    var getTraderPerformanceReport = function (teamId, teamName) {
        var traderParamrters = {
            TeamId: teamId,
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
        var traderCol = '';
        var gradeCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Trader, Name: 'ColTrader', MergeRowNumber: 2 },
                                { HeaderText: labels.Grade, Name: 'ColGrade', MergeRowNumber: 2 },
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
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
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
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                traderCol = traderFormat.format(item.CustId, item.TeamId, item.TraderName);
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
                gradeCol = gradeFormat.format(item.Grade);

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: traderCol },
                              { Name: 'ColGrade', Value: gradeCol },
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
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;
                totalLeague += item.LeagueCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
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
        domElements.divTeamPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [13]);
        }

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
        domElements.divLeagueDetailContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (teamId, teamName, traderId, traderName) {
        var matchParamrters = {
            TeamId: teamId,
            CustId: traderId,
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
                cachedData.MatchPerformance = result;
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
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
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
                      }],
            gridExpandHeight: 200,
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
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (groupIndex, group) {
                subRows = [];

                $.each(group.ItemList, function (index, item) {
                    matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: matchDetailCol },
                                  { Name: 'ColEventDate', Value: item.EventDateString },
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
                    totalBetcount += item.BetCount;

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
                              { Name: 'ColBetCount', Value: group.GroupBetcount }],
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
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {2}</span>' +
                          '<span title="{3}"> >> {4}</span>';
        //length of >>: 12
        var titleLength = 12 + labels.TeamPerformance.length + teamName.length + traderName.length;
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBettype', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [
                    { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                    { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                    {
                        HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
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
                        HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                    }
            ],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TeamPerformance, teamName, traderName, matchName, shortenName(common.HasViewScorePermission ? 117 : 97, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showNumberColumn: false,
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
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push(
                       { Name: 'ColNo', Value: index + 1 },
                       { Name: 'ColBettype', Value: item.TypeName },
                       { Name: 'ColTurnover', Value: item.Turnover },
                       { Name: 'ColJuice', Value: item.Juice },
                       { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                       { Name: 'ColLeftover', Value: item.Leftover },
                       { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                       { Name: 'ColWinLoss', Value: item.WinLoss },
                       { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                       { Name: 'ColBetCount', Value: item.BetCount },
                       { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };

                bodyData.push(row);

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalBetcount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
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
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleBettypeDetailGridEvents();
    };

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
        domElements.divLeagueDetailContainer.addClass('display-none');
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};