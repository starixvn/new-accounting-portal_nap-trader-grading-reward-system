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
        GetLeaguePerformanceOfBetChoice: common.ResolveRootUrl('PerformanceDetail/GetLeaguePerformanceOfBetChoice'),
        GetTraderPerformanceOfBetTypeLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfBetTypeLeague'),
        GetBetChoicePerformaceOfBetTypeLeague: common.ResolveRootUrl('PerformanceDetail/GetBetChoicePerformaceOfBetTypeLeague'),
        GetMatchPerformanceOfBetTypeLeagueTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfBetTypeLeagueTrader'),
        GetBetChoicePerformanceOfBetType: common.ResolveRootUrl('PerformanceDetail/GetBetChoicePerformanceOfBetType')
    };
    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlMarket: null,
        divDateRange: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        txtMinRealTurnover: null,
        txtMinRealWinLoss: null,
        txtRealMarginFrom: null,
        txtRealMarginTo: null,
        ddlLeagueGroup: null,
        txtLeague: null,
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
        MarketFilter: null,
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
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.txtLeague = domElements.divBetTypePerformanceFilter.find('#txtLeague');
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

        if (isRealFigurePermission) {
            domElements.txtMarginFromReal = domElements.divBetTypePerformanceFilter.find('#txtMarginFromReal');
            domElements.txtMarginToReal = domElements.divBetTypePerformanceFilter.find('#txtMarginToReal');
            domElements.txtMinTurnoverReal = domElements.divBetTypePerformanceFilter.find('#txtMinTurnoverReal');
            domElements.txtMinWinLossReal = domElements.divBetTypePerformanceFilter.find('#txtMinWinLossReal');
        }
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

        domElements.txtMarginFromReal.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginFromReal.val());

            domElements.txtMarginFromReal.val(value);
            validator.ClearError(domElements.txtMarginFromReal);
        });

        domElements.txtMarginToReal.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginToReal.val());

            domElements.txtMargitxtMarginToRealnTo.val(value);
            validator.ClearError(domElements.txtMarginToReal);
        });

        domElements.txtMinTurnoverReal.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinTurnoverReal.val());

            domElements.txtMinTurnoverReal.val(value);
            validator.ClearError(domElements.txtMinTurnoverReal);
        });

        domElements.txtMinWinLossReal.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinWinLossReal.val());

            domElements.txtMinWinLossReal.val(value);
            validator.ClearError(domElements.txtMinWinLossReal);
        });

        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 195,
            height: 200,
            allSelectedText: labels.AllLeagueGroups
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();

                parameters.MarketFilter = domElements.ddlMarket.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.BetTypes = selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');                
                parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null;
                parameters.LeagueName = domElements.txtLeague.val();
                parameters.IsReal = isRealFigurePermission;

                if (isRealFigurePermission) {
                    parameters.MarginFromReal = domElements.txtMarginFromReal.val().replace(/,/g, '');
                    parameters.MarginToReal = domElements.txtMarginToReal.val().replace(/,/g, '');
                    parameters.TurnoverReal = domElements.txtMinTurnoverReal.val().replace(/,/g, '');
                    parameters.WinLossReal = domElements.txtMinWinLossReal.val().replace(/,/g, ''); 
                }

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
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo)
            && validateBetType()
            && validateLeagueGroup();
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

    var validateLeagueGroup = function () {
        if (!domElements.ddlLeagueGroup.val()) {
            validator.ShowError(domElements.ddlLeagueGroup.next(), messages.RequiredField, 'w');

            return false;
        } 

        return true;
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
            gridExpandHeight: 260,            
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportBetTypePerformance();
                }
            },
            sortOption: {
                beforeGridSorted: function (rows) {
                    var rowsCount = rows.length;

                    for (var i = 0; i < rowsCount; i++) {
                        rows[i].CssClass = (i % 2 == 0) ? "" : "freegrid-even";
                    }

                    return rows;
                },

                afterGridSorted: function (rows) {
                    handleBetTypePerformanceGridEvents();

                    return rows;
                }
            },
            showDistinctRow: false,
            showFooter: true
        };

        var columns = [
            { HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetType, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Market, Width: 90, Name: 'ColMarket', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 110, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
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
            },
        ];

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
                    { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
                    { HeaderText: labels.Market, Name: "ColMarket", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfTraders, Name: "ColNoOfTraders", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfLeagues, Name: "ColNoOfLeagues", MergeRowNumber: 2 },
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

    var renderBetTypePerformanceGridMergeBetTypeToBody = function (data) {
        var betTypeFormat = '<span class="bettype link bettype-link" data-bettype="{0}" data-is-live="{1}" data-bettype-name="{2}">{3}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{3}">{4}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{2}">{4}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';        
        var bodyData = [];
        var row;
        var betTypeId = '';
        var evenClass = '';
        var rowIndex = 1;

        $.each(data.ItemByOrderList, function (index, item) {
            betTypeCol = betTypeFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.IsLive ? labels.MarketLive : labels.MarketNonLive);
            noOfTradersCol = noOfTradersFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfLeaguesCol = noOfLeaguesFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            var currentColumms = [];

            if (betTypeId != item.BetTypeId) {
                if (evenClass == 'freegrid-even') {
                    evenClass = '';
                }
                else {
                    evenClass = 'freegrid-even';
                }
            }

            currentColumms = currentColumms.concat([
                { Name: 'ColNo', Value: rowIndex++ },
                { Name: 'ColBetType', Value: item.BetTypeName },
                { Name: 'ColMarket', Value: betTypeCol },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                currentColumms = currentColumms.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.NoOfMatches) },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) },
                ]);
            }
            
            row = {                
                Columns: currentColumms,
                CssClass: evenClass
            };

            bodyData.push(row);
            betTypeId = item.BetTypeId;
        });

        return bodyData;
    }

    var renderBetTypePerformanceGridMergeBetTypeToFooter = function (data) {
        var columns = [
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
            { Name: 'ColMarket', Value: 'Live' },
            { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
            { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
            { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) },
        ];

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.TotalItemLive.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.TotalItemLive.TurnoverReal / data.TotalItemLive.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.TotalItemLive.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.TotalItemLive.MarginReal, labels.NA) },
            ]);
        }
        
        return footerData = [
            {
                Columns: columns
            },           
        ];
    }

    var renderBetTypePerformanceGridToBody = function (items, groupName) {
        var betTypeFormat = '<span class="bettype link bettype-link" data-bettype="{0}" data-is-live="{1}" data-bettype-name="{2}">{3}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{3}">{4}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{2}">{4}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';        
        var bodyData = [];
        var row;
        var evenClass = '';

        $.each(items, function (index, item) {
            betTypeCol = betTypeFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.IsLive ? labels.MarketLive : labels.MarketNonLive);
            noOfTradersCol = noOfTradersFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfLeaguesCol = noOfLeaguesFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            if (evenClass == 'freegrid-even') {
                evenClass = '';
            }
            else {
                evenClass = 'freegrid-even';
            }

            var currentColumns = [
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColBetType', Value: item.BetTypeName },
                { Name: 'ColMarket', Value: betTypeCol },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
            ];

            if (isRealFigurePermission) {
                currentColumns = currentColumns.concat([
                    { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.NoOfMatches) },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                ]);
            }

            row = {
                Columns: currentColumns,
                CssClass: evenClass
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderBetTypePerformanceGridToFooter = function (data, groupName) {
        var columns = [
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColMarket', Value: groupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfLeagues', Value: numeral(data.Total.NoOfLeagues).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }
        ];

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData = [{
            Columns: columns
        }];
    }

    // Handle bet type performance grid's events.
    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');            
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');
            var betTypeId = $link.attr('data-bettype');

            getTraderPerformanceReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var $betType = $link.closest('tr').find('span.bettype');            
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');
            var betTypeId = $link.attr('data-bettype');

            getLeaguePerformanceOfBetTypeReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.bettype-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');
            var isLive = $link.attr('data-is-live');
            var betTypeName = $link.attr('data-bettype-name');
            getBetChoicePerformanceReport(betTypeId, betTypeName, isLive);
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
    var getBetChoicePerformanceReport = function (betTypeId, betTypeName, isLive) {
        var betChoicePerformance = {
            IsLive: isLive,
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetChoicePerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoicePerformance),
            success: function (result) {
                renderBetChoicePerformanceGrid(result, betTypeId, betTypeName, isLive);
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
    var renderBetChoicePerformanceGrid = function (data, betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}">{3}</span>';              

        var gridOptions = {           
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetChoice, Width: 300, Name: 'ColBetChoice', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
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
                    { HeaderText: labels.BetChoice, Name: "ColBetChoice", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfLeagues, Name: "ColNoOfLeagues", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }
        
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.length > 0) {
            var totalTO = 0;
            var totalWL = 0;
            var totalTOReal = 0;
            var totalWLReal = 0;
            var totalMatchCount = 0;
            var totalBetCount = 0;

            $.each(data, function (index, item) {
                noOfLeaguesCol = noOfLeaguesFormat.format(item.BetChoice, item.IsLive, betTypeId, numeral(item.LeagueCount).format(common.Formats.IntegerFormat));
                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalTOReal += item.TurnoverReal;
                totalWLReal += item.WinLossReal;
                totalMatchCount += item.MatchCount;
                totalBetCount += item.BetCount;
                var currentColumns = [];

                currentColumns = currentColumns.concat([
                    { Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColBetChoice', Value: item.BetChoice },
                    { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                    { Name: 'ColNoOfMatches', Value: item.MatchCount },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.MatchCount) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                ]);

                if (isRealFigurePermission) {
                    currentColumns = currentColumns.concat([
                        { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                        { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.MatchCount) },
                        { Name: 'ColWinLossReal', Value: item.WinLossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                    ]);
                }

                row = {
                    Columns: currentColumns
                };

                bodyData.push(row);
            });

            var columnTotals = [];

            columnTotals = columnTotals.concat([
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: totalBetCount },
                { Name: 'ColTurnover', Value: totalTO },
                { Name: 'ColAvgTurnoverPerMatch', Value: common.GetNumWithLabel(totalTO / totalMatchCount, labels.NA) },
                { Name: 'ColWinLoss', Value: totalWL },                
                { Name: 'ColMargin', Value: common.GetNumWithLabel(totalWL / totalTO * 100, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                columnTotals = columnTotals.concat([
                    { Name: 'ColTurnoverReal', Value: totalTOReal },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: common.GetNumWithLabel(totalTOReal / totalMatchCount, labels.NA) },
                    { Name: 'ColWinLossReal', Value: totalWLReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(totalWLReal / totalTOReal * 100, labels.NA) }
                ]);
            }

            row = {
                Columns: columnTotals
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

        domElements.divBetChoicePerformanceContainer.find('span.league-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');                    
            var betChoice = $link.attr('data-betchoice');
            getLeagueByBetChoiceReport(isLive, betTypeId, betTypeName, betChoice);
        });
    };

    var getLeagueByBetChoiceReport = function (isLive, betTypeId, betTypeName, betChoice) {
        var leaguePerformance = {
            IsLive: isLive,
            BetType: betTypeId,
            BetChoice: betChoice,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfBetChoice,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leaguePerformance),
            success: function (result) {
                renderLeagueOfBetChoicePerformanceGrid(result, betTypeId, betTypeName, betChoice, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });

        domElements.divBetChoicePerformanceContainer.addClass('display-none');
    };

    var renderLeagueOfBetChoicePerformanceGrid = function (data, betTypeId, betTypeName, betChoice, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderLeagueOfBetChoiceGridToBody(data);
            footerData = renderLeagueOfBetChoiceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        var gridOptions = renderLeagueOfBetChoiceGridOptions(betTypeId, betTypeName, betChoice, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeagueOfBetChoiceGridEvents();
    };

    var renderLeagueOfBetChoiceGridOptions = function (betTypeId, betChoice, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanBetChoiceLink" class="breadcrumb-link"> >> ({1}) {2} </span><span> >> {3}</span>';
        var gridOptions = {
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, betChoice)
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

        var columns = [];

        columns = columns.concat([{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
        { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
        { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
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
            FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
        },
        {
            HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
            FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
        }]);

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
                    { HeaderText: labels.League, Name: "ColLeague", MergeRowNumber: 2 },
                    { HeaderText: labels.LeagueGroup, Name: "ColLeagueGroupName", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }       
        
        gridOptions.columns = columns;

        return gridOptions;
    };

    var renderLeagueOfBetChoiceGridToBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var bodyData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));

            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColBetCount', Value: item.BetCount },
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

            row = {
                Columns: currentColumns
            };

            bodyData.push(row);
        });

        return bodyData;
    };

    var renderLeagueOfBetChoiceGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColLeagueGroupName', Value: data.TotalItemLive.LeagueGroupName },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },           
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData = [{
            Columns: columns
        }];
    };

    var handleLeagueOfBetChoiceGridEvents = function () {
        domElements.divLeaguePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('#spanBetChoiceLink').click(function () {
            domElements.divBetChoicePerformanceContainer.removeClass('display-none');
            domElements.divLeaguePerformanceContainer.addClass('display-none');
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
            BetTypeBMTo: parameters.BetTypeBMTo,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformance),
            success: function (result) {
                renderTraderPerformanceGrid(result, betTypeId, betTypeName, isLive);
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
    var renderTraderPerformanceGrid = function (data, betTypeId, betTypeName, isLive) {
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceGridToBody(data);
            footerData = renderTraderPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceGridOptions(betTypeId, betTypeName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [11]);
        }

        handleTraderPerformanceGridEvents(betTypeId, betTypeName);
    };

    var renderTraderPerformanceGridOptions = function (betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
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
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
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
                    { HeaderText: labels.NoOfLeagues, Name: "ColNoOfLeagues", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },                   
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: labels.Score, Name: "ColScore", MergeRowNumber: 2 },
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
            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol },
                { Name: 'ColTeam', Value: teamCol },
                { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
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

        columns = columns.concat([
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
            { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColScore', Value: '' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },            
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }            
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData = [{ Columns: columns }];        
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
            BetTypeBMTo: parameters.BetTypeBMTo,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
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
                reloadPage(cachedData.PageIndex, cachedData.PageSize, betTypeId, betTypeName, traderId, traderName, isLive);
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
    var reloadPage = function (pageIndex, pageSize, betTypeId, betTypeName, traderId, traderName, isLive) {
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
        renderMatchPerformanceOfTraderGrid(pageData, betTypeId, betTypeName, traderId, traderName, isLive);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceOfTraderGrid = function (data, betTypeId, betTypeName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
                          '<span> >> {3}</span>';

        var gridOptions = {            
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, traderName)
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

        var columns = [];

        if (isRealFigurePermission) {
            columns = columns.concat([
                { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                {
                    HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
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
                    { HeaderText: labels.EventDate, Name: "ColEventDate", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: labels.Score, Name: "ColScore", MergeRowNumber: 2 },                  
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
                ]
            }];
        }

        gridOptions.columns = columns;

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
                    var currentColumns = [];

                    currentColumns.concat([
                        { Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                        { Name: 'ColMatch', Value: item.MatchName },
                        { Name: 'ColEventDate', Value: item.EventDate },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColScore', Value: common.GetNumWithLabel(item.Score, labels.NA) },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                    ]);

                    if (isRealFigurePermission) {
                        currentColumns.concat([
                            { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                            { Name: 'ColWinLossReal', Value: item.WinLossReal },
                            { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                        ]);
                    }

                    row = { Columns: currentColumns };

                    subRows.push(row);
                });

                var groupColumns = [];

                groupColumns = groupColumns.concat([
                    { Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                    { Name: 'ColBetCount', Value: group.Total.BetCount },
                    { Name: 'ColScore', Value: common.GetNumWithLabel(group.Total.Score, labels.NA) },
                    { Name: 'ColTurnover', Value: group.Total.Turnover },
                    { Name: 'ColWinLoss', Value: group.Total.WinLoss },                    
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA) }      
                ]);

                if (isRealFigurePermission) {
                    groupColumns = groupColumns.concat([
                        { Name: 'ColTurnoverReal', Value: group.Total.TurnoverReal },
                        { Name: 'ColWinLossReal', Value: group.Total.WinLossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(group.Total.MarginReal, labels.NA) }
                    ]);
                }

                row = {
                    Columns: groupColumns,
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            var totalColumns = [];

            totalColumns = totalColumns.concat([
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
                { Name: 'ColScore', Value: common.GetNumWithLabel(cachedData.GrandTotal.Score, labels.NA) },
                { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
                { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },               
                { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                totalColumns = totalColumns.concat([
                    { Name: 'ColTurnoverReal', Value: cachedData.GrandTotal.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: cachedData.GrandTotal.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(cachedData.GrandTotal.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: totalColumns };
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
    var getLeaguePerformanceOfBetTypeReport = function (betTypeId, betTypeName, isLive) {
        var leaguePerformanceParams = {
            IsLive: isLive,
            BetType: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leaguePerformanceParams),
            success: function (result) {
                renderLeaguePerformanceOfBetTypeGrid(result, betTypeId, betTypeName, isLive);
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
    var renderLeaguePerformanceOfBetTypeGrid = function (data, betTypeId, betTypeName, isLive) {        
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderLeaguePerformanceOfBetTypeGridToBody(data);
            footerData = renderLeaguePerformanceOfBetTypeGridToFooter(data);
        }

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        var gridOptions = renderLeaguePerformanceOfBetTypeGridOptions(betTypeId, betTypeName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceOfBetTypeGridEvents(betTypeId, betTypeName);
    };

    var renderLeaguePerformanceOfBetTypeGridOptions = function (betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';      
        var gridOptions = {           
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.NoOfBetChoices, Width: 100, Name: 'ColNoOfBetChoices', HeaderAlign: 'center', CellAlign: 'right',
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
                    { HeaderText: labels.League, Name: "ColLeague", MergeRowNumber: 2 },
                    { HeaderText: labels.LeagueGroup, Name: "ColLeagueGroupName", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfTraders, Name: "ColNoOfTraders", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfBetChoices, Name: "ColNoOfBetChoices", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var renderLeaguePerformanceOfBetTypeGridToBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfBetChoicesFormat = '<span class="betchoices-link link" data-league-id="{0}" data-is-live="{1}" data-league-name="{2}" title="{3}">{4}</span>';
        var noOfTradersCol = '';
        var noOfBetChoicesCol = '';
        var bodyData = [];      
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfBetChoicesCol = noOfBetChoicesFormat.format(
                item.LeagueId,
                item.IsLive,
                item.LeagueName,
                labels.BetChoice,
                numeral(item.NoOfBetChoices).format(common.Formats.IntegerFormat));           

            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColNoOfBetChoices', Value: noOfBetChoicesCol },
                { Name: 'ColBetCount', Value: item.BetCount },
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

    var renderLeaguePerformanceOfBetTypeGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColLeagueGroupName', Value: data.TotalItemLive.LeagueGroupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColNoOfBetChoices', Value: '' },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },            
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }]);            
        }

        return footerData = [{
            Columns: columns
        }];
    }

    // Handle grid's events.
    var handleLeaguePerformanceOfBetTypeGridEvents = function (betTypeId, betTypeName) {
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

        domElements.divLeaguePerformanceGrid.find('span.betchoices-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league-id');
            var isLive = $link.attr('data-is-live');
            var leagueName = $link.attr('data-league-name');

            getBetChoiceOfBetTypeLeagueReport(betTypeId, betTypeName, leagueId, leagueName, isLive);
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
        var traderPerformanceParams = {
            IsLive: isLive,
            BetType: betTypeId,
            LeagueId: leagueId,
            LeagueName: parameters.LeagueName,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfBetTypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformanceParams),
            success: function (result) {
                renderTraderPerformanceOfLeagueGrid(result, betTypeId, betTypeName, leagueId, leagueName, isLive);
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
    var renderTraderPerformanceOfLeagueGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceOfLeagueGridToBody(data);
            footerData = renderTraderPerformanceOfLeagueGridToFooter(data);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceOfLeagueGridOptions(betTypeId, betTypeName, leagueId, leagueName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceOfLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);
    };

    var renderTraderPerformanceOfLeagueGridOptions = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span title="{3}"> >> {4}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
        var gridOptions = {
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName)
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
                    { HeaderText: labels.Score, Name: "ColScore", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }

        gridOptions.columns = columns;

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
            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColGrade', Value: gradeCol },
                { Name: 'ColTeam', Value: teamCol },
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

    var renderTraderPerformanceOfLeagueGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColScore', Value: '' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },           
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }           
        ]);

        if (isRealFigurePermission) {
            columns = columns.concat([
                { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                { Name: 'ColAvgTurnoverPerMatchReal', Value: (data.Total.TurnoverReal / data.Total.NoOfMatches) },
                { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
            ]);
        }

        return footerData = [{ Columns: columns }];
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

    var getBetChoiceOfBetTypeLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var betChoicePerformanceParams = {
            IsLive: isLive,
            BetType: betTypeId,
            LeagueId: leagueId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetChoicePerformaceOfBetTypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoicePerformanceParams),
            success: function (result) {
                renderBetChoiceOfBetTypeLeagueGrid(result, betTypeId, betTypeName, leagueId, leagueName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };   

    var renderBetChoiceOfBetTypeLeagueGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, isLive) {   
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span title="{3}"> >> {4}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}">{3}</span>';       
        var trimLeagueName = leagueName.length > 150 ? leagueName.substring(0, 151) : leagueName;
        
        var gridOptions = {
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {                
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetChoicePeformanceOfBetTypeLeagueGridEvents();

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
                    handleBetChoicePeformanceOfBetTypeLeagueGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetChoice, Width: 300, Name: 'ColBetChoice', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                    { HeaderText: labels.BetChoice, Name: "ColBetChoice", MergeRowNumber: 2 },
                    { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },               
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 4 }
                ]
            }];
        }
       
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.length > 0) {
            var totalTO = 0;
            var totalWL = 0;
            var totalTOReal = 0;
            var totalWLReal = 0;
            var totalMatchCount = 0;
            var totalBetCount = 0;

            $.each(data, function (index, item) {
                noOfLeaguesCol = noOfLeaguesFormat.format(item.BetChoice, item.IsLive, betTypeId, numeral(item.LeagueCount).format(common.Formats.IntegerFormat));
                totalTO += item.Turnover;
                totalWL += item.WinLoss;
                totalTOReal += item.TurnoverReal;
                totalWLReal += item.WinLossReal;
                totalMatchCount += item.MatchCount;
                totalBetCount += item.BetCount;
                var currentColumns = [];

                currentColumns = currentColumns.concat([
                    { Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColBetChoice', Value: item.BetChoice },
                    { Name: 'ColNoOfMatches', Value: item.MatchCount },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.MatchCount) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },                   
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                ]);

                if (isRealFigurePermission) {
                    currentColumns = currentColumns.concat([
                        { Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                        { Name: 'ColAvgTurnoverPerMatchReal', Value: (item.TurnoverReal / item.MatchCount) },
                        { Name: 'ColWinLossReal', Value: item.WinLossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                    ]);
                }

                row = { Columns: currentColumns };

                bodyData.push(row);
            });

            var totalColumns = [];

            totalColumns.concat([
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: totalBetCount },
                { Name: 'ColTurnover', Value: totalTO },
                { Name: 'ColAvgTurnoverPerMatch', Value: common.GetNumWithLabel(totalTO / totalMatchCount, labels.NA) },
                { Name: 'ColWinLoss', Value: totalWL },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(totalWL / totalTO * 100, labels.NA) }
            ]);

            if (isRealFigurePermission) {
                totalColumns.concat([
                    { Name: 'ColTurnoverReal', Value: totalTO },
                    { Name: 'ColAvgTurnoverPerMatchReal', Value: common.GetNumWithLabel(totalTOReal / totalMatchCount, labels.NA) },
                    { Name: 'ColWinLossReal', Value: totalWLReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(totalWLReal / totalTOReal * 100, labels.NA) }
                ]);
            }

            row = { Columns: totalColumns };

            footerData.push(row);
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetChoicePerformanceGrid.fanexGrid(gridOptions);
        handleBetChoicePeformanceOfBetTypeLeagueGridEvents();
    };

    var handleBetChoicePeformanceOfBetTypeLeagueGridEvents = function () {        
        domElements.divBetChoicePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divBetChoicePerformanceContainer.find('#spanLeagueLink').click(function () {
            domElements.divBetChoicePerformanceContainer.addClass('display-none');
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
                renderMatchPerformanceOfLeagueTraderGrid(result, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
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
    var renderMatchPerformanceOfLeagueTraderGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var bodyData = [];
        var footerData = [];       

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceOfLeagueTraderGridToBody(data);
            footerData = renderMatchPerformanceOfLeagueTraderGridToFooter(data);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceOfLeagueTraderGridOptions(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchPerformanceOfLeagueTraderGridEvents();
    };

    var renderMatchPerformanceOfLeagueTraderGridOptions = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link" title="{3}"> >> {4}</span>' +
            '<span> >> {5}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
        var gridOptions = {           
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName, traderName)
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

        var columns = [];

        columns = columns.concat([
            { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.EventDate, Width: 120, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
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
                    { HeaderText: labels.EventDate, Name: "ColEventDate", MergeRowNumber: 2 },
                    { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },  
                    { HeaderText: labels.Score, Name: "ColScore", MergeRowNumber: 2 },                   
                    { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                    { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
                ]
            }];
        }

        gridOptions.columns = columns;

        return gridOptions;
    }

    var renderMatchPerformanceOfLeagueTraderGridToBody = function (data) {
        var bodyData = [];        
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            var currentColumns = [];

            currentColumns = currentColumns.concat([
                { Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: item.MatchName },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColScore', Value: common.GetNumWithLabel(item.Score, labels.NA) },
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

    var renderMatchPerformanceOfLeagueTraderGridToFooter = function (data) {
        var columns = [];

        columns = columns.concat([
            { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColScore', Value: common.GetNumWithLabel(data.Total.Score, labels.NA) },
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