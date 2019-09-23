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
        ddlMarket: null,
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
        GetTeamPerformance: common.ResolveRootUrl('PerformanceDetail/GetTeamPerformance'),
        ExportTeamPerformance: common.ResolveRootUrl('PerformanceDetail/ExportTeamPerformance'),
        GetTraderPerformanceOfTeam: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfTeam'),
        GetMatchPerformanceOfTeamTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTeamTrader'),
        GetBettypeDetail: common.ResolveRootUrl('PerformanceDetail/GetBettypeDetailTeam'),
        GetLeagueDetail: common.ResolveRootUrl('PerformanceDetail/GetLeagueDetailTeam'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfLeagueTeam'),
        GetMatchTraderLeagueTeam: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTraderLeagueTeam')
    };
    var parameters = {
        MarketFilter: null,
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        TeamIds: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLoss: null
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
        domElements.ddlMarket = domElements.divTeamPerformanceFilter.find('#ddlMarket');
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
            if (validator.ValidateForm(domElements.divTeamPerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');
                var selectedTeams = domElements.ddlTeam.val();
                var teamOptions = domElements.ddlTeam.find('option');

                parameters.MarketFilter = domElements.ddlMarket.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.TeamIds = selectedTeams.length === teamOptions.length ? '0' : selectedTeams.join(',');
                parameters.BetTypes = selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

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
        var bodyData = [];
        var footerData = [];        

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTeamPerformanceGridToBody(data);
            footerData = renderTeamPerformanceGridToFooter(data);
        }
        var gridOptions = renderTeamPerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTeamPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTeamPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTeamPerformanceGridEvents();
    };

    var renderTeamPerformanceGridOptions = function () {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
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
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
                , FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat//, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true, SortDirection: 'desc'
                , FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
                , FormatNegative: '$'
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
            showTree: true,
            showDistinctRow: false,
            showPager: false,
            showNumberColumn: false,
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

        return gridOptions;
    }

    var renderTeamPerformanceGridToBody = function (data) {
        var nonLiveData = [];
        var liveData = [];

        if (data.ItemNonLiveList.length > 0) {
            nonLiveData = addTeamPerformanceToRowsBody(data.ItemNonLiveList, labels.MarketNonLive);
        }

        if (data.ItemLiveList.length > 0) {
            liveData = addTeamPerformanceToRowsBody(data.ItemLiveList, labels.MarketLive);
        }

        var bodyData = nonLiveData.concat(liveData);

        return bodyData;
    }

    var addTeamPerformanceToRowsBody = function (items, groupName) {
        var noOfTradersFormat = '<span class="trader-link link" data-team-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-team-id="{0}" data-is-live="{1}" data-team-name="{2}">{3}</span>';
        var noOfTradersCol = '';
        var subRows = [];
        var rows = [];
        var row;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.TeamId,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColTeam', Value: item.TeamName, CssClass: 'team-name' },
                    { Name: 'ColNoOfTraders', Value: noOfTradersFormat.format(item.TeamId, item.IsLive, '', item.NoOfTraders) },
                    { Name: 'ColNoOfLeagues', Value: noOfLeaguesFormat.format(item.TeamId, item.IsLive, item.TeamName, item.NoOfLeagues) },
                    { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                    { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
            };

            subRows.push(row);
        });

        row = {
            Columns: [
                { Name: 'ColNo', Value: groupName, CellAlign: 'left', MergeColNumber: 11 }
            ],
            SubRows: subRows
        }
        rows.push(row);

        return rows;
    }

    var renderTeamPerformanceGridToFooter = function (data) {
        return footerData = [
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
                { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                { Name: 'ColTurnover', Value: data.Total.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
                { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                { Name: 'ColBetCount', Value: data.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
                { Name: 'ColScore', Value: '' }]
            }        
        ];
    }

    // Handle grid's events.
    var handleTeamPerformanceGridEvents = function () {
        domElements.divTeamPerformanceGrid.find('span.trader-link').click(function () {
            var link = $(this);
            var teamId = link.attr('data-team-id');
            var teamName = link.closest('tr').find('div.team-name').text();
            var isLive = link.attr('data-is-live');

            getTraderPerformanceReport(teamId, teamName, isLive);
        });
        $(".league-link").click(function () {
            var link = $(this);
            var teamId = link.attr("data-team-id");
            var teamName = link.attr("data-team-name");
            var isLive = link.attr('data-is-live');

            getLeagueDetail(teamId, teamName, isLive);
        });
    };

    var getLeagueDetail = function (teamId, teamName, isLive) {
        var criteria = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderLeagueDetailGridToBody(data);
            footerData = renderLeagueDetailGridToFooter(data);
        }

        // Hide previous report.
        domElements.divTeamPerformanceContainer.addClass('display-none');
        var gridOptions = renderLeagueDetailGridOptions(teamId, teamName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeagueDetailGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(teamId, teamName);
    }

    var renderLeagueDetailGridOptions = function (teamId, teamName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span><span> >> {1} </span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            }],
            gridExpandHeight: 260,
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

        return gridOptions;
    }

    var renderLeagueDetailGridToBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfTradersCol = '';
        var bodyData = [];       
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderLeagueDetailGridToFooter = function (data) {
        return footerData = {
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        };
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
            var isLive = $link.attr('data-is-live');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceReportByLeague(teamId, teamName, leagueId, leagueName, isLive);
        });
    };

    var getTraderPerformanceReportByLeague = function (teamId, teamName, leagueId, leagueName, isLive) {
        var criteria = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceByLeagueGridToBody(data);
            footerData = renderTraderPerformanceByLeagueGridToFooter(data);
        }

        // Hide previous report.
        domElements.divLeagueDetailContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceByLeagueGridOptions(teamId, teamName, leagueId, leagueName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [9]);
        }

        handleTraderPerformanceByLeagueGridEvents(teamId, teamName, leagueId, leagueName);
    };

    var renderTraderPerformanceByLeagueGridOptions = function (teamId, teamName, leagueId, leagueName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1} </span>' +
            '<span title="{2}"> >> {3}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
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

        return gridOptions;
    }

    var renderTraderPerformanceByLeagueGridToBody = function (data) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';
        var bodyData = [];
        var footerData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
            gradeCol = gradeFormat.format(item.Grade);
            teamCol = teamFormat.format(item.TeamName);

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol, CssClass: 'history' },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderTraderPerformanceByLeagueGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
            { Name: 'ColScore', Value: '' }]
        }];        
    }

    var handleTraderPerformanceByLeagueGridEvents = function (teamId, teamName, leagueId, leagueName) {
        domElements.divTraderPerformanceContainer.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();
            var isLive = $link.attr('data-is-live');

            getMatchPerformanceOfGradeLeagueTraderReport(teamId, teamName, leagueId, leagueName, traderId, traderName, isLive);
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

    var getMatchPerformanceOfGradeLeagueTraderReport = function (teamId, teamName, leagueId, leagueName, traderId, traderName, isLive) {
        var criteria = {
            IsLive: isLive,
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
                renderMatchPerformanceOfGradeLeagueTraderGrid(result.GroupList[0], teamId, teamName, leagueId, leagueName, traderId, traderName);
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
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceOfGradeLeagueTraderGridToBody(data)
            footerData = renderMatchPerformanceOfGradeLeagueTraderGridToFooter(data);           
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceOfGradeLeagueTraderGridOptions(teamId, teamName, leagueId, leagueName, traderId, traderName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfGradeLeagueTraderGridEvents(teamId, teamName, leagueId, leagueName, traderId, traderName);
    };

    var renderMatchPerformanceOfGradeLeagueTraderGridOptions = function (teamId, teamName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1} </span>' +
            '<span id="spanTraderLink" class="breadcrumb-link" title="{2}"> >> {3}</span>' +
            '<span> >> {4}</span>';

        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
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

        return gridOptions;
    }

    var renderMatchPerformanceOfGradeLeagueTraderGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var footerData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: matchDetailCol },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceOfGradeLeagueTraderGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

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
            var isLive = $link.attr('data-is-live');

            getBettypeDetailOfGradeLeagueReport(teamId, teamName, leagueId, leagueName, traderId, traderName, matchId, matchName, isLive);
        });
    };

    var getBettypeDetailOfGradeLeagueReport = function (teamId, teamName, leagueId, leagueName, traderId, traderName, matchId, matchName, isLive) {
        var criteria = {
            IsLive: isLive,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Bettypes: parameters.BetTypes,
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
                //shortenName(common.HasViewScorePermission ? 113 : 93, plainText.length + 4, matchName)
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
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                {
                    HeaderText: labels.Turnover,
                    Width: 100,
                    Name: 'ColTurnover',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss,
                    Width: 100,
                    Name: 'ColWinLoss',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                },
                {
                    HeaderText: labels.BetCount,
                    Width: 80,
                    Name: 'ColBetCount',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Margin,
                    Width: 90,
                    Name: 'ColMargin',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                },
                {
                    HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
            ],
            gridExpandHeight: 260,
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
        var total = {
            Turnover: 0,
            WinLoss: 0,
            BetCount: 0,
            Margin: null
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push({ Name: 'ColNo', Value: index + 1 },
                                        { Name: 'ColBettype', Value: item.TypeName },
                                        { Name: 'ColTurnover', Value: item.Turnover },
                                        { Name: 'ColWinLoss', Value: item.WinLoss },
                                        { Name: 'ColBetCount', Value: item.BetCount },
                                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                        { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.WinLoss;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0) {
                total.Margin = total.WinLoss / total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColWinLoss', Value: total.WinLoss },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [6]);
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
    var getTraderPerformanceReport = function (teamId, teamName, isLive) {
        var traderParamrters = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceGridToBody(data);
            footerData = renderTraderPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divTeamPerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceGridOptions(teamId, teamName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceGridEvents(teamId, teamName);
    };

    var renderTraderPerformanceGridOptions = function (teamId, teamName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left'
            },
            {
                HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left'
            },
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
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
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

        return gridOptions;
    }

    var renderTraderPerformanceGridToBody = function (data) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}" data-is-live="{2}">{3}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var traderCol = '';
        var gradeCol = '';
        var noOfMatchesCol = '';
        var bodyData = [];      
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.IsLive, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
            gradeCol = gradeFormat.format(item.Grade);

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                {
                    Name: 'ColTrader', Value: traderCol
                },
                {
                    Name: 'ColGrade', Value: gradeCol, CssClass: 'history'
                },
                {
                    Name: 'ColNoOfLeagues', Value: item.NoOfLeagues
                },
                {
                    Name: 'ColNoOfMatches', Value: noOfMatchesCol
                },
                {
                    Name: 'ColTurnover', Value: item.Turnover
                },
                {
                    Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches)
                },
                {
                    Name: 'ColWinLoss', Value: item.WinLoss
                },
                {
                    Name: 'ColBetCount', Value: item.BetCount
                },
                {
                    Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA)
                },
                {
                    Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA)
                }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderTraderPerformanceGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            {
                Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues
            },
            {
                Name: 'ColNoOfMatches', Value: numeral(data.Total.NoOfMatches).format(common.Formats.IntegerFormat)
            },
            {
                Name: 'ColTurnover', Value: data.Total.Turnover
            },
            {
                Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches)
            },
            {
                Name: 'ColWinLoss', Value: data.Total.WinLoss
            },
            {
                Name: 'ColBetCount', Value: data.Total.BetCount
            },
            {
                Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA)
            },
            {
                Name: 'ColScore', Value: ''
            }]
        }];
    }

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (teamId, teamName) {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();
            var isLive = $link.attr('data-is-live');

            gradeHistory.GetGradeHistory({
                IsLive: isLive,
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
            var isLive = $link.attr('data-is-live');

            getMatchPerformanceReport(teamId, teamName, traderId, traderName, isLive);
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
    var getMatchPerformanceReport = function (teamId, teamName, traderId, traderName, isLive) {
        var matchParamrters = {
            IsLive: isLive,
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
                var items = group.ItemLiveList.length > 0 ? group.ItemLiveList : group.ItemNonLiveList;
                var temCounter = counter + items.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        LeagueId: group.LeagueId,
                        LeagueName: group.LeagueName,
                        Total: group.Total,
                        Items: []
                    };

                    $.each(items, function (index, item) {
                        if (counter >= startIndex && counter <= endIndex) {
                            item.Order = counter;
                            currentGroup.Items.push(item);
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
        var bodyData = [];
        var footerData = [];

        if (data && data.length > 0) {
            bodyData = renderMatchPerformanceGridToBody(data);
            footerData = renderMatchPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceGridOptions(teamId, teamName, traderId, traderName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(teamId, teamName, traderId, traderName);
    };

    var renderMatchPerformanceGridOptions = function (teamId, teamName, traderId, traderName) {
        var titleFormat = '<span id="spanTeamLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link"> >> {1}</span>' +
            '<span> >> {2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
            {
                HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left'
            },
            {
                HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center'
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
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

        return gridOptions;
    }

    var renderMatchPerformanceGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var footerData = [];
        var subRows;
        var row;
        var counter = 0;

        $.each(data, function (groupIndex, group) {
            subRows = [];

            $.each(group.Items, function (index, item) {
                counter++;
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                    {
                        Name: 'ColMatch', Value: matchDetailCol
                    },
                    {
                        Name: 'ColEventDate', Value: item.EventDate
                    },
                    {
                        Name: 'ColTurnover', Value: item.Turnover
                    },
                    {
                        Name: 'ColWinLoss', Value: item.WinLoss
                    },
                    {
                        Name: 'ColBetCount', Value: item.BetCount
                    },
                    {
                        Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA)
                    }]
                };
                subRows.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                {
                    Name: 'ColTurnover', Value: group.Total.Turnover
                },
                {
                    Name: 'ColWinLoss', Value: group.Total.WinLoss
                },
                {
                    Name: 'ColBetCount', Value: group.Total.BetCount
                },
                {
                    Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA)
                }],
                SubRows: subRows
            };
            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceGridToFooter = function (data) {
        return rofooterDataw = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            {
                Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover
            },
            {
                Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss
            },
            {
                Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount
            },
            {
                Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA)
            }]
        }];
    }

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
            var isLive = $link.attr('data-is-live');

            getBettypeDetailReport(teamId, teamName, traderId, traderName, matchId, matchName, isLive);
        });
    };

    //Bettype Detail
    var getBettypeDetailReport = function (teamId, teamName, traderId, traderName, matchId, matchName, isLive) {
        var bettypeDetailParameters = {
            IsLive: isLive,
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
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true
            },
            {
                HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 80, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 90, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            }],
            gridExpandHeight: 260,
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
        var total = {
            Turnover: 0,
            WinLoss: 0,
            BetCount: 0,
            Margin: null
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push({ Name: 'ColNo', Value: index + 1 },
                {
                    Name: 'ColBettype', Value: item.TypeName
                },
                {
                    Name: 'ColTurnover', Value: item.Turnover
                },
                {
                    Name: 'ColWinLoss', Value: item.WinLoss
                },
                {
                    Name: 'ColBetCount', Value: item.BetCount
                },
                {
                    Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA)
                },
                {
                    Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA)
                });
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.WinLoss;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0) {
                total.Margin = total.WinLoss / total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                {
                    Name: 'ColTurnover', Value: total.Turnover
                },
                {
                    Name: 'ColWinLoss', Value: total.WinLoss
                },
                {
                    Name: 'ColBetCount', Value: total.BetCount
                },
                {
                    Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA)
                },
                {
                    Name: 'ColScore', Value: ''
                }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [6]);
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
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};