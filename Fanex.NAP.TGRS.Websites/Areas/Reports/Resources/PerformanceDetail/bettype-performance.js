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
        GetBetTypePerformance: common.ResolveRootUrl('PerformanceDetail/GetBetTypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('PerformanceDetail/ExportBetTypePerformance'),
        GetTraderPerformanceOfBetType: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfBetType'),
        GetMatchPerformanceOfBetTypeTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfBetTypeTrader'),
        GetLeaguePerformanceOfBetType: common.ResolveRootUrl('PerformanceDetail/GetLeaguePerformanceOfBetType'),
        GetTraderPerformanceOfBetTypeLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfBetTypeLeague'),
        GetMatchPerformanceOfBetTypeLeagueTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfBetTypeLeagueTrader'),
        GetBetChoicePerformanceOfBetType: common.ResolveRootUrl('PerformanceDetail/GetBetChoicePerformanceOfBetType')
    };
    var domElements = {
        divBetTypePerformanceFilter: null,
        MarketFilter: null,
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
        divLeaguePerformanceGrid: null,
        divBetChoicePerformanceContainer: null,
        divBetChoicePerformanceGrid: null
    };
    var parameters = {
        Market: null,
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        BetTypeBMFrom: null,
        BetTypeBMTo: null,
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
    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.ddlMarket = domElements.divBetTypePerformanceFilter.find('#ddlMarket');
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
        domElements.divBetChoicePerformanceContainer = $('#divBetChoicePerformanceContainer');
        domElements.divBetChoicePerformanceGrid = $('#divBetChoicePerformanceGrid');
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
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.MarketFilter = domElements.ddlMarket.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.BetTypes = selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

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
        domElements.divBetChoicePerformanceContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo) &&
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
        var bodyData = [];
        var footerData = [];

        if (data) {
            if (data.ItemByOrderList.length > 0) {
                bodyData = renderBetTypePerformanceGridMergeBetTypeToBody(data);
                footerData = renderBetTypePerformanceGridMergeBetTypeToFooter(data);
            } else {
                if (data.ItemNonLiveList.length > 0) {
                    bodyData = renderBetTypePerformanceGridToBody(data.ItemNonLiveList, labels.MarketNonLive);
                    footerData = renderBetTypePerformanceGridToFooter(data, labels.MarketNonLive);
                }

                if (data.ItemLiveList.length > 0) {
                    bodyData = renderBetTypePerformanceGridToBody(data.ItemLiveList, labels.MarketLive);
                    footerData = renderBetTypePerformanceGridToFooter(data, labels.MarketLive);
                }
            }
        }
        
        var gridOptions = renderBetTypePerformanceGridOptions(); 
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);
        handleBetTypePerformanceGridEvents();
    };

    var renderBetTypePerformanceGridOptions = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetType, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Market, Width: 100, Name: 'ColMarket', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
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
            showDistinctRow: false,
            showFooter: true
        };

        return gridOptions;
    }

    var renderBetTypePerformanceGridMergeBetTypeToBody = function (data) {
        var betTypeFormat = '<span class="bettype link bettype-link" data-bettype="{0}">{1}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-bettype="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-bettype="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';
        var betChoiceCol = '';
        var bodyData = [];
        var row;
        var rowIndex = 0;

        $.each(data.ItemByOrderList, function (index, item) {
            betTypeCol = betTypeFormat.format(item.BetTypeId, item.BetTypeName);
            noOfTradersCol = noOfTradersFormat.format(item.BetTypeId, item.IsLive, labels.TraderPerformance, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfLeaguesCol = noOfLeaguesFormat.format(item.BetTypeId, item.IsLive, labels.LeaguePerformance, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            var currentColumms = [];
            var evenClass = '';

            if (index % 2 == 0) {
                currentColumms.push(
                    { Name: 'ColNo', Value: rowIndex + 1, MergeRowNumber: 2 },
                    { Name: 'ColBetType', Value: betTypeCol, MergeRowNumber: 2 },
                );
                if (evenClass == 'freegrid-even') {
                    evenClass = '';
                }
                else {
                    evenClass = 'freegrid-even';
                }
                rowIndex += 1;
            }
            row = {
                Columns: currentColumms.concat([
                    { Name: 'ColMarket', Value: index % 2 == 0 ? 'Non - live' : 'Live' },
                    { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                    { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                    { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]),
                CssClass: evenClass
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderBetTypePerformanceGridMergeBetTypeToFooter = function (data) {
        return footerData = [
            {
                Columns: [
                    { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                    { Name: 'ColMarket', Value: 'Non - live' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemNonLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemNonLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemNonLive.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.TotalItemNonLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: data.TotalItemNonLive.WinLoss },
                    { Name: 'ColBetCount', Value: data.TotalItemNonLive.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin, labels.NA) }]
            },
            {
                Columns: [
                    { Name: 'ColMarket', Value: 'Live' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                    { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) }]
            }
        ];
    }

    var renderBetTypePerformanceGridToBody = function (items, groupName) {
        var betTypeFormat = '<span class="bettype link bettype-link" data-bettype="{0}">{1}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';
        var betChoiceCol = '';
        var bodyData = [];
        var row;
        var evenClass = '';

        $.each(items, function (index, item) {
            betTypeCol = betTypeFormat.format(item.BetTypeId, item.BetTypeName);
            noOfTradersCol = noOfTradersFormat.format(item.IsLive, labels.TraderPerformance, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfLeaguesCol = noOfLeaguesFormat.format(item.IsLive, labels.LeaguePerformance, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            if (evenClass == 'freegrid-even') {
                evenClass = '';
            }
            else {
                evenClass = 'freegrid-even';
            }

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColBetType', Value: betTypeCol },
                    { Name: 'ColMarket', Value: groupName },
                    { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                    { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                    { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }],
                    CssClass: evenClass
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderBetTypePerformanceGridToFooter = function (data, groupName) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColMarket', Value: groupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfLeagues', Value: numeral(data.Total.NoOfLeagues).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    // Handle bet type performance grid's events.
    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');            
            var betTypeName = $betType.text();
            var isLive = $link.attr('data-is-live');
            var betTypeId = $link.attr('data-bettype');

            getTraderPerformanceReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');            
            var betTypeName = $betType.text();
            var isLive = $link.attr('data-is-live');
            var betTypeId = $link.attr('data-bettype');

            getLeaguePerformanceReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.bettype-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');
            var betTypeName = $link.text();            
            
            getBetChoicePerformanceReport(betTypeId, betTypeName);
        });
    };

    // Show bet type performance report and hide other reports.
    var showBetTypePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBetChoicePerformanceContainer.addClass('display-none');
    };

    // Export bet type performance to excel.
    var exportBetTypePerformance = function () {
        common.DownloadFile(urls.ExportBetTypePerformance, parameters);
    };

    // Get betchoice performance on a specific bet type.
    var getBetChoicePerformanceReport = function (betTypeId, betTypeName) {
        var betChoicePerformance = {
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetChoicePerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoicePerformance),
            success: function (result) {
                renderBetChoicePerformanceGrid(result, betTypeId, betTypeName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render betchoice performance grid.
    var renderBetChoicePerformanceGrid = function (data, betTypeId, betTypeName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetChoice, Width: 300, Name: 'ColBetChoice', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                text: titleFormat.format(labels.BetTypePerformance, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetChoicePerformanceGridEvents(betTypeId, betTypeName);

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
                    handleBetChoicePerformanceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.length > 0) {
            var totalTO = 0;
            var totalWL = 0;
            var totalMatchCount = 0;
            var totalBetCount = 0;

            $.each(data, function (index, item) {
                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalMatchCount += item.MatchCount;
                totalBetCount += item.BetCount;
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColBetChoice', Value: item.BetChoice },
                    { Name: 'ColNoOfLeagues', Value: item.LeagueCount },
                    { Name: 'ColNoOfMatches', Value: item.MatchCount },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.MatchCount) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                { Name: 'ColTurnover', Value: totalTO },
                { Name: 'ColAvgTurnoverPerMatch', Value: common.GetNumWithLabel(totalTO / totalMatchCount, labels.NA) },
                { Name: 'ColWinLoss', Value: totalWL },
                { Name: 'ColBetCount', Value: totalBetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(totalWL / totalTO * 100, labels.NA) }]
            };

            footerData.push(row);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetChoicePerformanceGrid.fanexGrid(gridOptions);
        handleBetChoicePerformanceGridEvents(betTypeId, betTypeName);
    };

    // Handle grid's events.
    var handleBetChoicePerformanceGridEvents = function (betTypeId, betTypeName) {
        domElements.divBetChoicePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });
    };

    // Get trader performance on a specific bet type.
    var getTraderPerformanceReport = function (betTypeId, betTypeName, isLive) {
        var traderPerformance = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceGridToBody(data);
            footerData = renderTraderPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceGridOptions(betTypeId, betTypeName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [11]);
        }

        handleTraderPerformanceGridEvents(betTypeId, betTypeName);
    };

    var renderTraderPerformanceGridOptions = function (betTypeId, betTypeName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
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
            teamCol = teamFormat.format(item.TeamName);

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol },
                { Name: 'ColTeam', Value: teamCol },
                { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
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

    var renderTraderPerformanceGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
            { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
            { Name: 'ColScore', Value: '' }]
        }];        
    }

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (betTypeId, betTypeName) {
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
            var isLive = $link.attr('data-is-live');

            getMatchPerformanceOfTraderReport(betTypeId, betTypeName, traderId, traderName, isLive);
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
    var getMatchPerformanceOfTraderReport = function (betTypeId, betTypeName, traderId, traderName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
            CustId: traderId,
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            BetTypeBMFrom: parameters.BetTypeBMFrom,
            BetTypeBMTo: parameters.BetTypeBMTo
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
                cachedData.MatchPerformance = result.GroupList;
                cachedData.GrandTotal = result.GrandTotal;
                cachedData.TotalItems = result.TotalItems;
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
        renderMatchPerformanceOfTraderGrid(pageData, betTypeId, betTypeName, traderId, traderName);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceOfTraderGrid = function (data, betTypeId, betTypeName, traderId, traderName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> {1}</span>' +
                          '<span> >> {2}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
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
                      },
                    {
                        HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                        FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                    }],
            gridExpandHeight: 260,
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

        if (data && data.length > 0) {
            $.each(data, function (groupIndex, group) {
                subRows = [];

                $.each(group.Items, function (index, item) {
                    counter++;

                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: item.MatchName },
                                  { Name: 'ColEventDate', Value: item.EventDate },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColBetCount', Value: item.BetCount },
                                  { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                  { Name: 'ColScore', Value: common.GetNumWithLabel(item.Score, labels.NA) }]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                              { Name: 'ColTurnover', Value: group.Total.Turnover },
                              { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                              { Name: 'ColBetCount', Value: group.Total.BetCount },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA) },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(group.Total.Score, labels.NA) }],
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
                          { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
                          { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA) }],
                //{ Name: 'ColScore', Value: common.GetNumWithLabel(cachedData.GrandTotal.Score, labels.NA) }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

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
    var getLeaguePerformanceReport = function (betTypeId, betTypeName, isLive) {
        var leaguePerformance = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderLeaguePerformanceGridToBody(data);
            footerData = renderLeaguePerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        var gridOptions = renderLeaguePerformanceGridOptions(betTypeId, betTypeName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(betTypeId, betTypeName);
    };

    var renderLeaguePerformanceGridOptions = function (betTypeId, betTypeName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
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
        return gridOptions;
    }

    var renderLeaguePerformanceGridToBody = function (data) {
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

    var renderLeaguePerformanceGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];       
    }

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
            var isLive = $link.attr('data-is-live');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceOfLeagueReport(betTypeId, betTypeName, leagueId, leagueName, isLive);
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
    var getTraderPerformanceOfLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var traderPerformanceParamrters = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceOfLeagueGridToBody(data);
            footerData = renderTraderPerformanceOfLeagueGridToFooter(data);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceOfLeagueGridOptions(betTypeId, betTypeName, leagueId, leagueName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceOfLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);
    };

    var renderTraderPerformanceOfLeagueGridOptions = function (betTypeId, betTypeName, leagueId, leagueName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
            '<span title="{2}"> >> {3}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
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

        return gridOptions;
    }

    var renderTraderPerformanceOfLeagueGridToBody = function (data) {
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
            teamCol = teamFormat.format(item.TeamName);

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol },
                { Name: 'ColTeam', Value: teamCol },
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

    var renderTraderPerformanceOfLeagueGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
            { Name: 'ColScore', Value: '' }]
        }];
    }

    // Handle trander performance grid's events.
    var handleTraderPerformanceOfLeagueGridEvents = function (betTypeId, betTypeName, leagueId, leagueName) {
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
            var isLive = $link.attr('data-is-live');

            teamHistory.GetTeamHistory({
                IsLive: isLive,
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
            var isLive = $link.attr('data-is-live');

            getMatchPerformanceOfLeagueTraderReport(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
        });

        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    // Get match performance by trader.
    var getMatchPerformanceOfLeagueTraderReport = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
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
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceOfLeagueTraderGridToBody(data);
            footerData = renderMatchPerformanceOfLeagueTraderGridToFooter(data);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceOfLeagueTraderGridOptions(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchPerformanceOfLeagueTraderGridEvents();
    };

    var renderMatchPerformanceOfLeagueTraderGridOptions = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> {1}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link" title="{2}"> >> {3}</span>' +
            '<span> >> {4}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.EventDate, Width: 120, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
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
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
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
        return gridOptions;
    }

    var renderMatchPerformanceOfLeagueTraderGridToBody = function (data) {
        var bodyData = [];        
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: item.MatchName },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                { Name: 'ColScore', Value: common.GetNumWithLabel(item.Score, labels.NA) }]
            };
            bodyData.push(row);
        });
        return bodyData;
    }

    var renderMatchPerformanceOfLeagueTraderGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
            //{ Name: 'ColScore', Value: common.GetNumWithLabel(data.Total.Score, labels.NA) }]
        }];
    }

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
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};