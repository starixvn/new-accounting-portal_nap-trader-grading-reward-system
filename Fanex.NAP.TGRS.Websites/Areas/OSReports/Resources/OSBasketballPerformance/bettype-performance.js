$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.OSReports.BasketballPerformace();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.OSReports.BasketballPerformace');
Fanex.NAP.TGRS.OSReports.BasketballPerformace = function () {
    var $this = this;

    var urls = {
        GetBettypePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetBettypePerformance'),
        ExportBettypePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/ExportBettypePerformance'),
        GetBetChoiceOfBettype: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetBetChoiceOfBettype'),
        GetQuarterOfBettypeBetChoice: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetQuarterOfBettypeBetChoice'),
        GetLeagueOfBettypeBetChoiceQuarter: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetLeagueOfBettypeBetChoiceQuarter'),
        GetLeagueOfBettypeBetChoice: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetLeagueOfBettypeBetChoice'),
        GetBetChoiceOfBettypeLeague: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetBetChoiceOfBettypeLeague'),
        GetQuarterOfBettypeLeagueBetChoice: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetQuarterOfBettypeLeagueBetChoice'),
        GetTraderOfBettype: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetTraderOfBettype'),
        GetMatchOfBettypeTrader: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetMatchOfBettypeTrader'),
        GetLeagueOfBettype: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetLeagueOfBettype'),
        GetTraderOfBettypeLeague: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetTraderOfBettypeLeague'),
        GetMatchOfBettypeLeagueTrader: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetMatchOfBettypeLeagueTrader')
    };

    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlLiveType: null,
        divDateRange: null,
        ddlBetType: null,
        ddlLeagueGroup: null,
        txtLeague: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null,
        divBetChoicePerformanceContainer: null,
        divBetChoicePerformanceGrid: null,
        divQuarterPerformanceContainer: null,
        divQuarterPerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null
    };

    var parameters = {
        LiveType: null,
        FromDate: null,
        ToDate: null,
        Bettypes: null,
        LeagueGroupIds: null,
        LeagueName: null
    };

    var cachedData = {
        MatchPerformance: null,
        Total: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };

    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.ddlLiveType = domElements.divBetTypePerformanceFilter.find('#ddlLiveType');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divBetTypePerformanceFilter.find('#ddlBetType');
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.txtLeague = domElements.divBetTypePerformanceFilter.find('#txtLeague');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
        domElements.divBetChoicePerformanceContainer = $('#divBetChoicePerformanceContainer');
        domElements.divBetChoicePerformanceGrid = $('#divBetChoicePerformanceGrid');
        domElements.divQuarterPerformanceContainer = $('#divQuarterPerformanceContainer');
        domElements.divQuarterPerformanceGrid = $('#divQuarterPerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
    };

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
            height: 300,
            allSelectedText: labels.AllBetTypes,
            groupsCollapsable: true,
            optGroupChecked: true            
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
        });

        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 195,
            height: 200,
            allSelectedText: labels.AllLeagueGroups
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w') && validateBetType() && validateLeagueGroup()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
                
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Bettypes = selectedBetTypes.join(',');
                parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null;
                parameters.LeagueName = domElements.txtLeague.val().trim();
                parameters.LiveType = domElements.ddlLiveType.val();                

                hideAllReports();
                getBetTypePerformanceReport();
            }
        });
    };

    var validateBetType = function () {
        var selectedBetTypes = domElements.ddlBetType.val();

        if (!selectedBetTypes) {
            validator.ShowError(domElements.ddlBetType.next(), messages.RequiredField, 'w');

            return false;
        }

        return true;
    };

    var validateLeagueGroup = function () {
        if (!domElements.ddlLeagueGroup.val()) {
            validator.ShowError(domElements.ddlLeagueGroup.next(), messages.RequiredField, 'w');

            return false;
        }

        return true;
    };

    var hideAllReports = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBetChoicePerformanceContainer.addClass('display-none');
        domElements.divQuarterPerformanceContainer.addClass('display-none');
    };

    var getBetTypePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypePerformance,
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

    var renderBetTypePerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length > 0) {
            bodyData = renderBetTypePerformanceGridBody(data);
            footerData = renderBetTypePerformanceGridFooter(data);
        }

        var gridOptions = renderBetTypePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);
        handleBetTypePerformanceGridEvents();
    };

    var renderBetTypePerformanceGridOptions = function () {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetType, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Market, Width: 90, Name: 'ColMarket', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            { HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 110, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
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
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
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
                beforeGridSorted: function (rows) {
                    var rowsCount = rows.length;

                    for (var i = 0; i < rowsCount; i++) {
                        rows[i].CssClass = (i % 2 === 0) ? "" : "freegrid-even";
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

        return gridOptions;
    };

    var exportBetTypePerformance = function () {
        common.DownloadFile(urls.ExportBettypePerformance, parameters);
    };

    var renderBetTypePerformanceGridBody = function (data) {
        var betChoiceFormat = '<span class="betchoice-link link" data-bettype="{0}" data-is-live="{1}" data-bettype-name="{2}">{3}</span>';
        var noOfTradersFormat = '<span class="trader-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{3}">{4}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-bettype="{0}" data-is-live="{1}" title="{2}" data-bettype-name="{2}">{4}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';
        var bodyData = [];
        var row;
        var betTypeId = '';
        var evenClass = '';
        var rowIndex = 1;

        $.each(data.Items, function (_, item) {
            betChoiceCol = betChoiceFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.IsLive ? labels.MarketLive : labels.MarketNonLive);
            noOfTradersCol = noOfTradersFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            noOfLeaguesCol = noOfLeaguesFormat.format(item.BetTypeId, item.IsLive, item.BetTypeName, item.BetTypeName, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            var currentColumms = [];

            if (betTypeId !== item.BetTypeId) {
                evenClass = evenClass === 'freegrid-even' ? '' : 'freegrid-even';
            }

            row = {
                Columns: currentColumms.concat([
                    { Name: 'ColNo', Value: rowIndex++ },
                    { Name: 'ColBetType', Value: item.BetTypeName },
                    { Name: 'ColMarket', Value: betChoiceCol },
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
            betTypeId = item.BetTypeId;
        });

        return bodyData;
    };

    var renderBetTypePerformanceGridFooter = function (data) {
        var footerData = [];
        var itemLive = {
            Columns: [
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                { Name: 'ColMarket', Value: 'Live' },
                { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
                { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemLive.NoOfMatches !== 0 ? (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) : 0 },
                { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) }]
        };

        var itemNonLive = {
            Columns: [
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                { Name: 'ColMarket', Value: 'Non-Live' },
                { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemNonLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemNonLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfMatches', Value: data.TotalItemNonLive.NoOfMatches },
                { Name: 'ColTurnover', Value: data.TotalItemNonLive.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemNonLive.NoOfMatches !== 0 ? (data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches) : 0 },
                { Name: 'ColWinLoss', Value: data.TotalItemNonLive.WinLoss },
                { Name: 'ColBetCount', Value: data.TotalItemNonLive.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin, labels.NA) }]
        };

        if (parameters.LiveType === "0") {
            footerData.push(itemNonLive);
        } else if (parameters.LiveType === "1") {
            footerData.push(itemLive);
        } else {
            footerData.push(itemNonLive);
            footerData.push({
                Columns: [
                    { Name: 'ColMarket', Value: 'Live' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemLive.NoOfMatches !== 0 ? (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) : 0 },
                    { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                    { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) }]
            });            
        }
        
        return footerData;
    };

    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getTraderOfBettypeReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getLeaguePerformanceOfBetTypeReport(betTypeId, betTypeName, isLive);
        });        

        domElements.divBetTypePerformanceGrid.find('span.betchoice-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');            
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getBetChoiceOfBettypeReport(betTypeId, betTypeName, isLive);
        });
    };

    var getBetChoiceOfBettypeReport = function (betTypeId, betTypeName, isLive) {
        var betChoiceParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LiveType: isLive === 'true' ? "1" : "0",
            Bettype: betTypeId,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName
        };
      
        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetBetChoiceOfBettype,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoiceParams),
            success: function (result) {
                renderBetChoiceOfBettypeGrid(result, betTypeId, betTypeName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBetChoiceOfBettypeGrid = function (data, betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}">{3}</span>';
        var betChoiceFormat = '<span class="betchoice-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}" data-is-quarter="{3}" data-is-hdp="{4}">{5}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetChoice, Width: 300, Name: 'ColBetChoice', HeaderAlign: 'center', CellAlign: 'left' },
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetChoiceOfBettypeGridEvents(betTypeId, betTypeName);

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
                    handleBetChoiceOfBettypeGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data.Items && data.Items.length > 0) {
            $.each(data.Items, function (index, item) {
                noOfLeaguesCol = noOfLeaguesFormat.format(item.BetChoice, item.IsLive, betTypeId, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));
                betChoiceCol = data.IsBetTypeQuarter || data.IsBetTypeHdp ? betChoiceFormat.format(item.BetChoice, item.IsLive, betTypeId, data.IsBetTypeQuarter, data.IsBetTypeHdp, item.BetChoice) : item.BetChoice;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBetChoice', Value: betChoiceCol },
                        { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                        { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                    { Name: 'ColTurnover', Value: data.Total.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: common.GetNumWithLabel(data.Total.Turnover / data.Total.NoOfMatches, labels.NA) },
                    { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                    { Name: 'ColBetCount', Value: data.Total.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
            };

            footerData.push(row);
        }
        
        domElements.divBetTypePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetChoicePerformanceGrid.fanexGrid(gridOptions);

        handleBetChoiceOfBettypeGridEvents(betTypeId, betTypeName);
    };

    var handleBetChoiceOfBettypeGridEvents = function (betTypeId, betTypeName) {
        domElements.divBetChoicePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divBetChoicePerformanceContainer.find('span.betchoice-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');
            var betChoice = $link.attr('data-betchoice');
            var isQuarter = $link.attr('data-is-quarter');
            var isHdp = $link.attr('data-is-hdp');

            getQuarterOfBettypeBetChoiceReport(isLive, betTypeId, betTypeName, betChoice, isQuarter, isHdp);
        });

        domElements.divBetChoicePerformanceContainer.find('span.league-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');
            var betChoice = $link.attr('data-betchoice');

            getLeagueOfBettypeBetChoiceReport(isLive, betTypeId, betTypeName, betChoice);
        });
    };

    var getQuarterOfBettypeBetChoiceReport = function (isLive, betTypeId, betTypeName, betChoice, isQuarter, isHdp) {
        var quarterParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? 1 : 0,
            Bettype: betTypeId,
            BetChoice: betChoice,
            IsQuarter: isQuarter,
            IsHdp: isHdp
        };
        
        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetQuarterOfBettypeBetChoice,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(quarterParams),
            success: function (result) {
                renderQuarterOfBettypeBetChoiceGrid(result, betTypeId, betTypeName, betChoice, isLive, isQuarter, isHdp);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderQuarterOfBettypeBetChoiceGrid = function (data, betTypeId, betTypeName, betChoice, isLive, isQuarter, isHdp) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length) {
            bodyData = renderQuarterOfBettypeBetChoiceGridBody(data, betTypeId, betChoice);
            footerData = renderQuarterOfBettypeBetChoiceGridFooter(data);
        }

        domElements.divBetChoicePerformanceContainer.addClass('display-none');

        var gridOptions = renderQuarterOfBettypeBetChoiceGridOptions(betTypeId, betTypeName, betChoice, isLive, isQuarter, isHdp);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divQuarterPerformanceGrid.fanexGrid(gridOptions);

        handleQuarterOfBettypeBetChoiceGridEvents(betTypeId, betTypeName);
    }

    var renderQuarterOfBettypeBetChoiceGridOptions = function (betTypeId, betTypeName, betChoice, isLive, isQuarter, isHdp) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanBetChoiceLink" class="breadcrumb-link"> >> ({1}) {2} </span><span> >> {3}</span>';
        var secondHeader = isHdp ? "HDP" : "Quarter";
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: secondHeader, Width: 300, Name: 'ColQuarter', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },      
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
            }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, betChoice)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleQuarterOfBettypeBetChoiceGridEvents(betTypeId, betTypeName);

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
                    handleQuarterOfBettypeBetChoiceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderQuarterOfBettypeBetChoiceGridBody = function (data, betTypeId, betChoice) {
        var noOfLeaguesFormat = '<span class="league-link link" data-quarter="{0}" data-is-live="{1}" data-bettype-id="{2}" data-betchoice="{3}" data-betid="{4}">{5}</span>';
        var bodyData = [];
        var row;

        $.each(data.Items, function (index, item) {
            noOfLeaguesCol = noOfLeaguesFormat.format(item.Quarter, item.IsLive, betTypeId, betChoice, item.BetId, numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColQuarter', Value: item.Quarter },
                { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
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

    var renderQuarterOfBettypeBetChoiceGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },            
            { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    var handleQuarterOfBettypeBetChoiceGridEvents = function (betTypeId, betTypeName) {
        domElements.divQuarterPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divQuarterPerformanceContainer.find('#spanBetChoiceLink').click(function () {
            domElements.divBetChoicePerformanceContainer.removeClass('display-none');
            domElements.divQuarterPerformanceContainer.addClass('display-none');
        });

        domElements.divQuarterPerformanceContainer.find('span.league-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');
            var betChoice = $link.attr('data-betchoice');
            var betId = $link.attr('data-betid');
            var quarter = $link.attr('data-quarter');            

            getLeagueOfBettypeBetChoiceQuarterReport(isLive, betTypeId, betTypeName, betChoice, betId, quarter);
        });
    }

    var getLeagueOfBettypeBetChoiceQuarterReport = function (isLive, betTypeId, betTypeName, betChoice, betId, quarter) {
        var hdp = parseFloat(quarter);
        hdp = isNaN(hdp) ? null : hdp;

        var leagueParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? 1 : 0,
            Bettype: betTypeId,
            BetChoice: betChoice,
            BetId: betId,
            Hdp: hdp
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetLeagueOfBettypeBetChoiceQuarter,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParams),
            success: function (result) {
                renderLeagueOfBettypeBetChoiceQuarterGrid(result, betTypeId, betTypeName, betChoice, isLive, quarter);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderLeagueOfBettypeBetChoiceQuarterGrid = function (data, betTypeId, betTypeName, betChoice, isLive, quarter) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length) {
            bodyData = renderLeagueOfBettypeBetChoiceQuarterGridBody(data);
            footerData = renderLeagueOfBettypeBetChoiceQuarterGridFooter(data);
        }

        domElements.divQuarterPerformanceContainer.addClass('display-none');

        var gridOptions = renderLeagueOfBettypeBetChoiceQuarterGridOptions(betTypeId, betTypeName, betChoice, isLive, quarter);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeagueOfBettypeBetChoiceQuarterGridEvents();
    }

    var renderLeagueOfBettypeBetChoiceQuarterGridOptions = function (betTypeId, betTypeName, betChoice, isLive, quarter) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanBetChoiceLink" class="breadcrumb-link"> >> ({1}) {2} </span><span id="spanQuarterLink" class="breadcrumb-link"> >> {3} </span><span> >> {4}</span>';        
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, betChoice, quarter)                
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeagueOfBettypeBetChoiceQuarterGridEvents();

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
                    handleLeagueOfBettypeBetChoiceQuarterGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderLeagueOfBettypeBetChoiceQuarterGridBody = function (data) {      
        var bodyData = [];
        var row;

        $.each(data.Items, function (index, item) {           
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
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

    var renderLeagueOfBettypeBetChoiceQuarterGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColLeagueGroupName', Value: data.Total.LeagueGroupName },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    var handleLeagueOfBettypeBetChoiceQuarterGridEvents = function () {
        domElements.divLeaguePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('#spanBetChoiceLink').click(function () {
            domElements.divBetChoicePerformanceContainer.removeClass('display-none');
            domElements.divLeaguePerformanceContainer.addClass('display-none');
        });

        domElements.divLeaguePerformanceContainer.find('#spanQuarterLink').click(function () {
            domElements.divQuarterPerformanceContainer.removeClass('display-none');
            domElements.divLeaguePerformanceContainer.addClass('display-none');
        });
    }

    var getLeagueOfBettypeBetChoiceReport = function (isLive, betTypeId, betTypeName, betChoice) {
        var leagueParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? 1 : 0,
            Bettype: betTypeId,
            BetChoice: betChoice
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetLeagueOfBettypeBetChoice,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParams),
            success: function (result) {
                renderLeagueOfBettypeBetChoiceGrid(result, betTypeId, betTypeName, betChoice, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderLeagueOfBettypeBetChoiceGrid = function (data, betTypeId, betTypeName, betChoice, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length) {
            bodyData = renderLeagueOfBettypeBetChoiceGridBody(data);
            footerData = renderLeagueOfBettypeBetChoiceGridFooter(data);
        }

        domElements.divBetChoicePerformanceContainer.addClass('display-none');

        var gridOptions = renderLeagueOfBettypeBetChoiceGridOptions(betTypeId, betTypeName, betChoice, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeagueOfBettypeBetChoiceGridEvents();
    };

    var renderLeagueOfBettypeBetChoiceGridOptions = function (betTypeId, betTypeName, betChoice, isLive) {        
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanBetChoiceLink" class="breadcrumb-link"> >> ({1}) {2} </span><span> >> {3}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, betChoice)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeagueOfBettypeBetChoiceGridEvents(betTypeId, betTypeName);

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
                    handleLeagueOfBettypeBetChoiceGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    };

    var renderLeagueOfBettypeBetChoiceGridBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var bodyData = [];
        var row;

        $.each(data.Items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
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
    };

    var renderLeagueOfBettypeBetChoiceGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColLeagueGroupName', Value: data.Total.LeagueGroupName },
                { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                { Name: 'ColTurnover', Value: data.Total.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
                { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                { Name: 'ColBetCount', Value: data.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    };

    var handleLeagueOfBettypeBetChoiceGridEvents = function () {
        domElements.divLeaguePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('#spanBetChoiceLink').click(function () {
            domElements.divBetChoicePerformanceContainer.removeClass('display-none');
            domElements.divLeaguePerformanceContainer.addClass('display-none');
        });
    };

    var getTraderOfBettypeReport = function (betTypeId, betTypeName, isLive) {
        var traderParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Bettype: betTypeId,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? "1" : "0"
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderOfBettype,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderParams),
            success: function (result) {
                renderTraderOfBettypeGrid(result, betTypeId, betTypeName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderTraderOfBettypeGrid = function (data, betTypeId, betTypeName, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length > 0) {
            bodyData = renderTraderOfBettypeGridBody(data);
            footerData = renderTraderOfBettypeGridFooter(data);
        }

        domElements.divBetTypePerformanceContainer.addClass('display-none');

        var gridOptions = renderTraderOfBettypeGridOptions(betTypeId, betTypeName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        handleTraderOfBettypeGridEvents(betTypeId, betTypeName);
    };

    var renderTraderOfBettypeGridOptions = function (betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },         
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
            }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderOfBettypeGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderOfBettypeGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        return gridOptions;
    };

    var renderTraderOfBettypeGridBody = function (data) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}" data-is-live="{2}">{3}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';    
        var traderCol = '';       
        var noOfMatchesCol = '';
        var bodyData = [];
        var row;

        $.each(data.Items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.IsLive, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
           
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },               
                { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    };

    var renderTraderOfBettypeGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    };

    var handleTraderOfBettypeGridEvents = function (betTypeId, betTypeName) {       
        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();
            var isLive = $link.attr('data-is-live');

            getMatchOfBettypeTraderReport(betTypeId, betTypeName, traderId, traderName, isLive);
        });

        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });
    };

    var getMatchOfBettypeTraderReport = function (betTypeId, betTypeName, traderId, traderName, isLive) {
        var matchParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,            
            TraderId: traderId,
            Bettype: betTypeId,           
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? "1" : "0"
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchOfBettypeTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParams),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result.GroupList;
                cachedData.Total = result.Total;
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
                var temCounter = counter + group.Items.length - 1;
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

                    $.each(group.Items, function (index, item) {
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
        renderMatchOfBettypeTraderGrid(pageData, betTypeId, betTypeName, traderId, traderName, isLive);
    };

    var renderMatchOfBettypeTraderGrid = function (data, betTypeId, betTypeName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span> >> {3}</span>';

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
            }],
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
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                    { Name: 'ColTurnover', Value: group.Total.Turnover },
                    { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                    { Name: 'ColBetCount', Value: group.Total.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA) }],
                    SubRows: subRows
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                    { Name: 'ColTurnover', Value: cachedData.Total.Turnover },
                    { Name: 'ColWinLoss', Value: cachedData.Total.WinLoss },
                    { Name: 'ColBetCount', Value: cachedData.Total.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.Total.Margin, labels.NA) }]
            };
            footerData.push(row);
        }
        
        domElements.divTraderPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchOfBettypeTraderGridEvents();
    };

    var handleMatchOfBettypeTraderGridEvents = function () {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });
    };

    var getLeaguePerformanceOfBetTypeReport = function (betTypeId, betTypeName, isLive) {
        var leagueParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueName: parameters.LeagueName,
            LeagueGroupIds: parameters.LeagueGroupIds,
            Bettype: betTypeId,
            LiveType: isLive === 'true' ? "1" : "0"
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeagueOfBettype,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParams),
            success: function (result) {
                renderLeagueOfBetTypeGrid(result, betTypeId, betTypeName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderLeagueOfBetTypeGrid = function (data, betTypeId, betTypeName, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length > 0) {
            bodyData = renderLeagueOfBetTypeGridBody(data);
            footerData = renderLeagueOfBetTypeGridFooter(data);
        }

        domElements.divBetTypePerformanceContainer.addClass('display-none');

        var gridOptions = renderLeagueOfBetTypeGridOptions(betTypeId, betTypeName, isLive);

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeagueOfBetTypeGridEvents(betTypeId, betTypeName);
    };

    var renderLeagueOfBetTypeGridOptions = function (betTypeId, betTypeName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeagueOfBetTypeGridEvents(betTypeId, betTypeName);

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
                    handleLeagueOfBetTypeGridEvents(betTypeId, betTypeName);

                    return rows;
                }
            },
            showFooter: true
        };
        return gridOptions;
    };

    var renderLeagueOfBetTypeGridBody = function (data) {
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfBetChoicesFormat = '<span class="betchoices-link link" data-league-id="{0}" data-is-live="{1}" data-league-name="{2}" title="{3}">{4}</span>';
        var noOfTradersCol = '';
        var noOfBetChoicesCol = '';
        var bodyData = [];
        var row;      

        $.each(data.Items, function (index, item) {
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

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColLeagueGroupName', Value: item.LeagueGroupName },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColNoOfBetChoices', Value: noOfBetChoicesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    };

    var renderLeagueOfBetTypeGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColLeagueGroupName', Value: data.Total.LeagueGroupName },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColNoOfBetChoices', Value: '' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    };

    var handleLeagueOfBetTypeGridEvents = function (betTypeId, betTypeName) {
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

            getTraderOfBettypeLeagueReport(betTypeId, betTypeName, leagueId, leagueName, isLive);
        });

        domElements.divLeaguePerformanceGrid.find('span.betchoices-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league-id');
            var isLive = $link.attr('data-is-live');
            var leagueName = $link.attr('data-league-name');

            getBetChoiceOfBettypeLeagueReport(betTypeId, betTypeName, leagueId, leagueName, isLive);
        });
    };

    var getBetChoiceOfBettypeLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var betChoiceParams = {
            LiveType: isLive === 'true' ? "1" : "0",
            Bettype: betTypeId,
            LeagueId: leagueId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetChoiceOfBettypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoiceParams),
            success: function (result) {
                renderBetChoiceOfBettypeLeagueGrid(result, betTypeId, betTypeName, leagueId, leagueName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBetChoiceOfBettypeLeagueGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span title="{3}"> >> {4}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}">{3}</span>';
        var betChoiceFormat = '<span class="betchoice-link link" data-betchoice="{0}" data-is-live="{1}" title="{0}" data-bettype-id="{2}" data-league-id="{3}">{4}</span>';
        var trimLeagueName = leagueName.length > 150 ? leagueName.substring(0, 151) : leagueName;
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetChoice, Width: 300, Name: 'ColBetChoice', HeaderAlign: 'center', CellAlign: 'left' },
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetChoiceOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueName);

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
                    handleBetChoiceOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.Items.length > 0) {
            $.each(data.Items, function (index, item) {
                var betChoiceCol = data.IsBetTypeQuarter ? betChoiceFormat.format(item.BetChoice, item.IsLive, betTypeId, leagueId, item.BetChoice) : item.BetChoice;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBetChoice', Value: betChoiceCol },
                        { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                    { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.Total.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: common.GetNumWithLabel(data.Total.Turnover / data.Total.NoOfMatches, labels.NA) },
                    { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                    { Name: 'ColBetCount', Value: data.Total.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.WinLoss / data.Total.Turnover * 100, labels.NA) }]
            };

            footerData.push(row);
        }
        
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetChoicePerformanceGrid.fanexGrid(gridOptions);

        handleBetChoiceOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueName);
    };

    var handleBetChoiceOfBettypeLeagueGridEvents = function (betTypeId, betTypeName, leagueName) {
        domElements.divBetChoicePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divBetChoicePerformanceContainer.find('#spanLeagueLink').click(function () {
            domElements.divBetChoicePerformanceContainer.addClass('display-none');
            showLeaguePerformanceReport();
        });

        domElements.divBetChoicePerformanceContainer.find('span.betchoice-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');
            var betChoice = $link.attr('data-betchoice');
            var leagueId = $link.attr('data-league-id');

            getQuarterOfBettypeLeagueBetChoiceReport(betTypeId, betTypeName, leagueId, leagueName, betChoice, isLive);
        });
    };

    var getQuarterOfBettypeLeagueBetChoiceReport = function (betTypeId, betTypeName, leagueId, leagueName, betChoice, isLive) {
        var quarterParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueGroupIds: parameters.LeagueGroupIds,
            LeagueName: parameters.LeagueName,
            LiveType: isLive === 'true' ? 1 : 0,
            Bettype: betTypeId,
            LeagueId: leagueId,
            BetChoice: betChoice
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetQuarterOfBettypeLeagueBetChoice,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(quarterParams),
            success: function (result) {
                renderQuarterOfBettypeLeagueBetChoiceGrid(result, betTypeName, leagueName, betChoice, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderQuarterOfBettypeLeagueBetChoiceGrid = function (data, betTypeName, leagueName, betChoice, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length) {
            bodyData = renderQuarterOfBettypeLeagueBetChoiceGridBody(data);
            footerData = renderQuarterOfBettypeLeagueBetChoiceGridFooter(data);
        }

        domElements.divBetChoicePerformanceContainer.addClass('display-none');

        var gridOptions = renderQuarterOfBettypeLeagueBetChoiceGridOptions(betTypeName, leagueName, betChoice, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divQuarterPerformanceGrid.fanexGrid(gridOptions);

        handleQuarterOfBettypeLeagueBetChoiceGridEvents();
    }

    var renderQuarterOfBettypeLeagueBetChoiceGridOptions = function (betTypeName, leagueName, betChoice, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanBetChoiceLink" class="breadcrumb-link"> >> ({1}) {2} </span><span id="spanLeagueLink" class="breadcrumb-link"> >> {3}</span><span> >> {4}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Quarter, Width: 300, Name: 'ColQuarter', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },            
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
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, betChoice)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleQuarterOfBettypeLeagueBetChoiceGridEvents();

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
                    handleQuarterOfBettypeLeagueBetChoiceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderQuarterOfBettypeLeagueBetChoiceGridBody = function (data) {
        var bodyData = [];
        var row;

        $.each(data.Items, function (index, item) {
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColQuarter', Value: item.Quarter },
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

    var renderQuarterOfBettypeLeagueBetChoiceGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },            
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    var handleQuarterOfBettypeLeagueBetChoiceGridEvents = function () {
        domElements.divQuarterPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divQuarterPerformanceContainer.find('#spanLeagueLink').click(function () {            
            showBetChoicePerformanceReport();
        });

        domElements.divQuarterPerformanceContainer.find('#spanBetChoiceLink').click(function () {
            domElements.divBetChoicePerformanceContainer.addClass('display-none');
            showLeaguePerformanceReport();
        });
    }

    var getTraderOfBettypeLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var traderParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueId: leagueId,
            Bettype: betTypeId,
            LiveType: isLive === 'true' ? "1" : "0"
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderOfBettypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderParams),
            success: function (result) {
                renderTraderOfBettypeLeagueGrid(result, betTypeId, betTypeName, leagueId, leagueName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderTraderOfBettypeLeagueGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length > 0) {
            bodyData = renderTraderOfBettypeLeagueGridBody(data);
            footerData = renderTraderOfBettypeLeagueGridFooter(data);
        }
               
        var gridOptions = renderTraderOfBettypeLeagueGridOptions(betTypeId, betTypeName, leagueId, leagueName, isLive);

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        handleTraderOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);
    };

    var renderTraderOfBettypeLeagueGridOptions = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span title="{3}"> >> {4}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },         
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
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderOfBettypeLeagueGridEvents(betTypeId, betTypeName, leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    };

    var renderTraderOfBettypeLeagueGridBody = function (data) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}" data-is-live="{2}">{3}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';        
        var traderCol = '';    
        var noOfMatchesCol = '';
        var bodyData = [];
        var row;       

        $.each(data.Items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.IsLive, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));            

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    };

    var renderTraderOfBettypeLeagueGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    };

    var handleTraderOfBettypeLeagueGridEvents = function (betTypeId, betTypeName, leagueId, leagueName) {
        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();
            var isLive = $link.attr('data-is-live');

            getMatchOfBettypeLeagueTraderReport(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
        });
    };

    var getMatchOfBettypeLeagueTraderReport = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var matchParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueId: leagueId,
            TraderId: traderId,
            Bettype: betTypeId,
            LiveType: isLive === 'true' ? "1" : "0"
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetMatchOfBettypeLeagueTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParams),
            success: function (result) {
                renderMatchOfBettypeLeagueTraderGrid(result, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderMatchOfBettypeLeagueTraderGrid = function (data, betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var bodyData = [];
        var footerData = []; 

        if (data && data.Items.length > 0) {
            bodyData = renderMatchOfBettypeLeagueTraderGridBody(data);
            footerData = renderMatchOfBettypeLeagueTraderGridFooter(data);
        }

        domElements.divTraderPerformanceContainer.addClass('display-none');

        var gridOptions = renderMatchOfBettypeLeagueTraderGridOptions(betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);        

        handleMatchOfBettypeLeagueTraderGridEvents();
    };

    var renderMatchOfBettypeLeagueTraderGridOptions = function (betTypeId, betTypeName, leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link" title="{3}"> >> {4}</span>' +
            '<span> >> {5}</span>';
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
            }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.BetTypePerformance, isLive === 'true' ? labels.MarketLive : labels.MarketNonLive, betTypeName, leagueName, trimLeagueName, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchOfBettypeLeagueTraderGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        return gridOptions;
    };

    var renderMatchOfBettypeLeagueTraderGridBody = function (data) {
        var bodyData = [];
        var row;        

        $.each(data.Items, function (index, item) {
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: item.MatchName },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };
            bodyData.push(row);
        });

        return bodyData;
    };

    var renderMatchOfBettypeLeagueTraderGridFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    };

    var handleMatchOfBettypeLeagueTraderGridEvents = function () {
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

    var showBetTypePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBetChoicePerformanceContainer.addClass('display-none');
        domElements.divQuarterPerformanceContainer.addClass('display-none');
    };

    var showLeaguePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divQuarterPerformanceContainer.addClass('display-none');
    };

    var showBetChoicePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divBetChoicePerformanceContainer.removeClass('display-none');
        domElements.divQuarterPerformanceContainer.addClass('display-none');
    };

    var showTraderPerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divQuarterPerformanceContainer.addClass('display-none');
    };
        
    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
};
