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
    
    var domElements = {
        divLeaguePerformanceFilter: null,
        ddlMarket: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        txtLeague: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        ddlLeagueGroup: null,
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
        GetInitializedData: common.ResolveRootUrl('PerformanceDetail/GetInitializedData'),
        GetLeaguePerformance: common.ResolveRootUrl('PerformanceDetail/GetLeaguePerformance'),
        ExportLeaguePerformance: common.ResolveRootUrl('PerformanceDetail/ExportLeaguePerformance'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfLeague'),
        GetMatchPerformanceOfLeagueTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfLeagueTrader'),
        GetMatchPerformanceOfLeague: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfLeague'),
        GetBettypeDetail: common.ResolveRootUrl('PerformanceDetail/GetBettypeDetailLeague'),
        GetBettypePerformanceOfLeagueMatch: common.ResolveRootUrl('PerformanceDetail/GetBettypePerformanceOfLeagueMatch')
    };
    var parameters = {
        MarketFilter: null,
        FromDate: null,
        ToDate: null,
        LeagueName: null,
        LeagueGroupIds: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLoss: null
    };

    var gradeHistory = new Fanex.TGRS.PerformanceSummary.GradeHistory();
    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divLeaguePerformanceFilter = $('#divLeaguePerformanceFilter');
        domElements.ddlMarket = $('#ddlMarket');
        domElements.divDateRange = domElements.divLeaguePerformanceFilter.find('#divDateRange');
        domElements.txtLeague = domElements.divLeaguePerformanceFilter.find('#txtLeague');
        domElements.ddlBetType = domElements.divLeaguePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divLeaguePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divLeaguePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divLeaguePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divLeaguePerformanceFilter.find('#txtMinWinLoss');
        domElements.ddlLeagueGroup = domElements.divLeaguePerformanceFilter.find('#ddlLeagueGroup');
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
            groupsCollapsable: true,
            optGroupChecked: true,
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

        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 195,
            height: 200,
            allSelectedText: labels.AllLeagueGroups
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divLeaguePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();

                parameters.MarketFilter = domElements.ddlMarket.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null,
                parameters.LeagueName = domElements.txtLeague.val();
                parameters.BetTypes = selectedBetTypes !== null ? selectedBetTypes.join(',') : null;
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

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
        return validateBetType() && validateLeagueGroup();
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

    var validateLeagueGroup = function () {
        if (!domElements.ddlLeagueGroup.val()) {
            validator.ShowError(domElements.ddlLeagueGroup.next(), messages.RequiredField, 'w');

            return false;
        }

        return true;
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
        var bodyData = [];
        var footerData = [];

        if (data) {
            if (data.ItemByOrderList.length > 0) {
                bodyData = generateLeaguePerformanceGridMergeLeagueToBody(data);
                footerData = generateLeaguePerformanceGridMergeLeagueToFooter(data);
            }
            else {
                if (data.ItemNonLiveList.length > 0) {
                    bodyData = generateLeaguePerformanceGridToBody(data.ItemNonLiveList, labels.MarketNonLive);
                    footerData = generateLeaguePerformanceGridToFooter(data, labels.MarketNonLive);
                }

                if (data.ItemLiveList.length > 0) {
                    bodyData = generateLeaguePerformanceGridToBody(data.ItemLiveList, labels.MarketLive);
                    footerData = generateLeaguePerformanceGridToFooter(data, labels.MarketLive);
                }
            }
        }

        var gridOptions = generateLeaguePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.showDistinctRow = false;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents();
    };

    var generateLeaguePerformanceGridOptions = function () {
        var gridOptions = {            
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportLeaguePerformance();
                }
            },
            sortOption: {
                beforeGridSorted: function (rows) {
                    var rowsCount = rows.length;

                    for (var i = 0; i < rowsCount; i++)
                    {
                        rows[i].CssClass = (i % 2 == 0) ? "" : "freegrid-even";
                    }

                    return rows;
                },

                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents();

                    return rows;
                }
            },
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
            showDistinctRow: false,
            showFooter: true
        };

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.Market, Width: 100, Name: 'ColMarket', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
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
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
            },           
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
            }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatchReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
                }
            ]);

            gridOptions.customizeHeader = true;

            gridOptions.groupHeaderRows = [{
                Columns: [
                    { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                    { HeaderText: labels.League, Name: "ColLeague", MergeRowNumber: 2 },
                    { HeaderText: labels.Market, Name: "ColMarket", MergeRowNumber: 2 },
                    { HeaderText: labels.LeagueGroup, Name: "ColLeagueGroupName", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfTraders, Name: "ColNoOfTraders", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var generateLeaguePerformanceGridMergeLeagueToBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-league-name="{1}" data-is-live="{2}" title="{3}">{4}</span>';
        var noOfMatchsFormat = '<span class="match-link link" data-league-id="{0}" data-league-name="{1}" data-is-live="{2}" title="{3}">{4}</span>';
        var noOfTradersCol = '';
        var bodyData = [];
        var row;    
        var leagueId = '';
        var evenClass = '';
        var rowIndex = 1;

        $.each(data.ItemByOrderList, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.LeagueName,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            var noOfMatchesCol = noOfMatchsFormat.format(item.LeagueId, item.LeagueName, item.IsLive, labels.MatchPerformance, item.NoOfMatches);
         
            var currentColumms = [];

            if (leagueId != item.LeagueId) {
                if (evenClass == 'freegrid-even') {
                    evenClass = '';
                }
                else {
                    evenClass = 'freegrid-even';
                }
            }

            currentColumms = currentColumms.concat([
                { Name: 'ColNo', Value: rowIndex++ },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColMarket', Value: item.IsLive ? labels.MarketLive : labels.MarketNonLive },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },              
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]);

            if (isRealFigurePermission) {
                currentColumms = currentColumms.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.NoOfMatches) },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                ]);
            }

            row = {
                Columns: currentColumms,
                CssClass: evenClass
            };
            
            bodyData.push(row);
            leagueId = item.LeagueId;
        });

        return bodyData;
    }
   
    var generateLeaguePerformanceGridMergeLeagueToFooter = function (data) {
        var columns1 = [];
        var columns2 = [];

        columns1 = columns1.concat([{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
            { Name: 'ColMarket', Value: 'Live' },
            { Name: 'ColLeagueGroupName', Value: data.TotalItemLive.LeagueGroupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
            { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
            { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },           
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) }]);

        columns2 = columns2.concat([{ Name: 'ColMarket', Value: 'Non-Live' },
            { Name: 'ColLeagueGroupName', Value: data.TotalItemNonLive.LeagueGroupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemNonLive.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.TotalItemNonLive.NoOfMatches },
            { Name: 'ColBetCount', Value: data.TotalItemNonLive.BetCount },
            { Name: 'ColTurnover', Value: data.TotalItemNonLive.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.TotalItemNonLive.WinLoss },           
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin, labels.NA) }]);

        if (isRealFigurePermission) {
            columns1 = columns1.concat([{ Name: 'ColTurnoverReal', Value: data.TotalItemLive.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.TotalItemLive.TurnoverReal / data.TotalItemLive.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.TotalItemLive.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.TotalItemLive.MarginReal, labels.NA) }]);

            columns2 = columns2.concat([{ Name: 'ColTurnoverReal', Value: data.TotalItemNonLive.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.TotalItemNonLive.TurnoverReal / data.TotalItemNonLive.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.TotalItemNonLive.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.TotalItemNonLive.MarginReal, labels.NA) }]);
        }

        return footerRows = [{Columns: columns1}, { Columns: columns2 }];
    }   

    var generateLeaguePerformanceGridToBody = function (items, groupName) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-league-name="{1}" data-is-live="{2}" title="{3}">{4}</span>';
        var noOfMatchsFormat = '<span class="match-link link" data-league-id="{0}" data-league-name="{1}" data-is-live="{2}" title="{3}">{4}</span>';
        var noOfTradersCol = '';
        var bodyData = [];
        var row;
        var evenClass = '';

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.LeagueName,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            var noOfMatchesCol = noOfMatchsFormat.format(item.LeagueId, item.LeagueName, item.IsLive, labels.MatchPerformance, item.NoOfMatches);

            if (evenClass == 'freegrid-even') {
                evenClass = '';
            }
            else {
                evenClass = 'freegrid-even';
            }

            var currentColumns = [];

            currentColumns = currentColumns.concat([{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColMarket', Value: item.IsLive ? labels.MarketLive : labels.MarketNonLive },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },               
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]);

            if (isRealFigurePermission) {
                currentColumns = currentColumns.concat([{ Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.NoOfMatches) },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }]);
            }

            row = {
                Columns: currentColumns,
                CssClass: evenClass
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var generateLeaguePerformanceGridToFooter = function (data, groupName) {
        var columns = [];

        columns = columns.concat([{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColMarket', Value: groupName },
            { Name: 'ColLeagueGroupName', Value: data.Total.LeagueGroupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },           
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]);

        if (isRealFigurePermission) {
            columns = columns.concat([{ Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }]);
        }

        return footerRow = [{ Columns: columns }];
    }

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function () {
        domElements.divLeaguePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $link.attr('data-league-name');
            var isLive = $link.attr('data-is-live');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceReport(leagueId, leagueName, isLive);
        });

        domElements.divLeaguePerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $link.attr('data-league-name');
            var isLive = $link.attr('data-is-live');

            leagueName = leagueName || $leagueName.text();

            getMatchPerformanceOfLeagueReport(leagueId, leagueName, isLive);
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
    var getTraderPerformanceReport = function (leagueId, leagueName, isLive) {
        var traderPerformanceParamrters = {
            IsLive: isLive,
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
                renderTraderPerformanceGrid(result, leagueId, isLive, leagueName);
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
    var renderTraderPerformanceGrid = function (data, leagueId, isLive, leagueName) {
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceGridToBody(data); 
            footerData = renderTraderPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceGridOptions(leagueId, isLive, leagueName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceGridEvents(leagueId, leagueName);
    };

    var renderTraderPerformanceGridOptions = function (leagueId, isLive, leagueName) {
        var gridOptions = {            
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>'.format(labels.LeaguePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, leagueName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
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
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            }           
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatchReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                }
            ]);

            gridOptions.customizeHeader = true;

            gridOptions.groupHeaderRows = [{
                Columns: [
                    { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                    { HeaderText: labels.Trader, Name: "ColTrader", MergeRowNumber: 2 },
                    { HeaderText: labels.Grade, Name: "ColGrade", MergeRowNumber: 2 },
                    { HeaderText: labels.Team, Name: "ColTeam", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: labels.Score, Name: "Score", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var renderTraderPerformanceGridToBody = function (data) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}" data-is-live="{2}">{3}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';
        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';
        var bodyData = [];       
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.IsLive, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
            gradeCol = gradeFormat.format(item.Grade);
            gradeCol += item.HasGradeHistory ? detailIcon.format('grade-column', labels.GradeHistoryDetail) : '';
            teamCol = teamFormat.format(item.TeamName);
            teamCol += item.HasTeamHistory ? detailIcon.format('team-column', labels.TeamHistoryDetail) : '';
            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol, CssClass: 'history' },
                { Name: 'ColTeam', Value: teamCol, CssClass: 'history' },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                currentColumns = currentColumns.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.NoOfMatches) },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: currentColumns };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderTraderPerformanceGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColScore', Value: '' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },            
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }          
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([{ Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData= [{ Columns: columns }];
    }

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
            var isLive = $link.attr('data-is-live');

            getMatchPerformanceReport(leagueId, leagueName, traderId, traderName, isLive);
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
    var getMatchPerformanceReport = function (leagueId, leagueName, traderId, traderName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
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
                renderMatchPerformanceGrid(result, leagueId, leagueName, traderId, traderName, isLive);
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
    var renderMatchPerformanceGrid = function (data, leagueId, leagueName, traderId, traderName, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceGridToBody(data);
            footerData = renderMatchPerformanceGridFooter(data);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceGridOptions(leagueId, leagueName, traderId, traderName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(leagueId, leagueName, traderId, traderName);
    };

    var renderMatchPerformanceGridOptions = function (leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanTraderLink"  class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span> >> {3}</span>';

        var gridOptions = {
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, leagueName, traderName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
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
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);

            gridOptions.customizeHeader = true;

            gridOptions.groupHeaderRows = [{
                Columns: [
                    { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                    { HeaderText: labels.Match, Name: "ColMatch", MergeRowNumber: 2 },
                    { HeaderText: "Event Date", Name: "ColEventDate", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: labels.Score, Name: "Score", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var renderMatchPerformanceGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);
            var currentColumns = [];
            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: matchDetailCol },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },               
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                currentColumns = currentColumns.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: currentColumns };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceGridFooter = function (data) {
        var columns = [];

        columns = columns.concat([{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },            
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }
        
        return footerData = [{ Columns: columns }];       
    }

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
            var isLive = $link.attr('data-is-live');

            getBettypeDetailReport(leagueId, leagueName, traderId, traderName, matchId, matchName, isLive);
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
    var getBettypeDetailReport = function (leagueId, leagueName, traderId, traderName, matchId, matchName, isLive) {
        var bettypeDetailParameters = {
            IsLive: isLive,
            LeagueId: leagueId,
            CustId: traderId,
            MatchId: matchId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeDetailGrid(result, matchId, matchName, leagueId, leagueName, traderId, traderName, isLive);
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
    var renderBettypeDetailGrid = function (data, matchId, matchName, leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink"  class="breadcrumb-link"> >> ({1}) {2}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {3}</span>' +
                          '<span title="{4}"> >> {5}</span>';
        //length of >>: 12
        var titleLength = 12 + labels.LeaguePerformance.length + leagueName.length + traderName.length;
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 280, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, leagueName, traderName, matchName, shortenName(common.HasViewScorePermission ? 113 : 93, titleLength, matchName))
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
                Columns: [  { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                            { Name: 'ColTurnover', Value: total.Turnover },
                            { Name: 'ColWinLoss', Value: total.WinLoss },
                            { Name: 'ColBetCount', Value: total.BetCount },
                            { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }
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
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [6]);
        }

        handleBettypeDetailGridEvents();
    };

    //LEAGUE - MATCH SECTION.

    // Get match performance by league.
    var getMatchPerformanceOfLeagueReport = function (leagueId, leagueName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
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
                renderMatchPerformanceOfLeagueGrid(result, leagueId, leagueName, isLive);
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
    var renderMatchPerformanceOfLeagueGrid = function (data, leagueId, leagueName, isLive) {
        var bodyData = [];
        var footerData = [];        

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceOfLeagueGridToBody(data);
            footerData = renderMatchPerformanceOfLeagueGridToFooter(data);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceOfLeagueGridOptions(leagueId, leagueName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceOfLeagueGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfLeagueGridEvents(leagueId, leagueName);
    };

    var renderMatchPerformanceOfLeagueGridOptions = function (leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
            '<span> >> ({1}) {2}</span>';
        var gridOptions = {
            columns: [],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, leagueName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
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
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);

            gridOptions.customizeHeader = true;

            gridOptions.groupHeaderRows = [{
                Columns: [
                    { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                    { HeaderText: labels.Match, Name: "ColMatch", MergeRowNumber: 2 },
                    { HeaderText: "Event Date", Name: "ColEventDate", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },                    
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var renderMatchPerformanceOfLeagueGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var footerData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);

            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: matchDetailCol },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },               
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                currentColumns = currentColumns.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: currentColumns };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceOfLeagueGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData = [{ Columns: columns }];
    }

    // Handle match performance of league grid's events.
    var handleMatchPerformanceOfLeagueGridEvents = function (leagueId, leagueName) {

        domElements.divMatchPerformanceOfLeagueContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divMatchPerformanceOfLeagueContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            var isLive = $link.attr('data-is-live');

            getBettypeOfLeagueMatchDetailReport(leagueId, leagueName, matchId, matchName, isLive);
        });
    };

    //Bettype Detail (of league and match)
    var getBettypeOfLeagueMatchDetailReport = function (leagueId, leagueName, matchId, matchName, isLive) {
        var bettypeDetailParameters = {
            IsLive: isLive,
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
                renderBettypeOfLeagueMatchDetailGrid(result, matchId, matchName, leagueId, leagueName, isLive);
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
    var renderBettypeOfLeagueMatchDetailGrid = function (data, matchId, matchName, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> ({1}) {2}</span>' +
                          '<span title="{3}"> >> {4}</span>';
        //length of >>: 8
        var titleLength = 8 + labels.LeaguePerformance.length + leagueName.length + 10;
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
                }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, leagueName, matchName, shortenName(90, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeOfLeagueMatchDetailGridEvents();

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
                    handleBettypeOfLeagueMatchDetailGridEvents();

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
                                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                                        );
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
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }
                ]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');

        domElements.divBettypePerformanceOfLeagueMatchGrid.fanexGrid(gridOptions);

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
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};