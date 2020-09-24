$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.OSReports.BasketballPerformace();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.OSReports.BasketballPerformace');
Fanex.NAP.TGRS.OSReports.BasketballPerformace = function () {
    var $this = this;

    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetBettypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/ExportBettypePerformance'),
        GetLeagueOfBetType: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetLeagueOfBetType'),
        GetTraderOfBetTypeLeague: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetTraderOfBetTypeLeague'),
        GetMatchOfBetTypeLeagueTrader: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetMatchOfBetTypeLeagueTrader')
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
        Bettypes: null
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
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
                
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Bettypes = selectedBetTypes.join(',');
                parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null;
                parameters.LeagueName = domElements.txtLeague.val();
                parameters.LiveType = domElements.ddlLiveType.val();                

                domElements.divBetTypePerformanceContainer.addClass('display-none');
                getBetTypePerformanceReport();
            }
        });
    };

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
        return footerData = [
            {
                Columns: [
                    { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                    { Name: 'ColMarket', Value: 'Live' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemLive.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                    { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) }]
            },
            {
                Columns: [
                    { Name: 'ColMarket', Value: 'Non-Live' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemNonLive.NoOfTraders).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfLeagues', Value: numeral(data.TotalItemNonLive.NoOfLeagues).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemNonLive.NoOfMatches },
                    { Name: 'ColTurnover', Value: data.TotalItemNonLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches) },
                    { Name: 'ColWinLoss', Value: data.TotalItemNonLive.WinLoss },
                    { Name: 'ColBetCount', Value: data.TotalItemNonLive.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin, labels.NA) }]
            }
        ];
    };

    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getLeaguePerformanceOfBetTypeReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);           
            var betTypeId = $link.attr('data-bettype');
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getTraderPerformanceReport(betTypeId, betTypeName, isLive);
        });

        domElements.divBetTypePerformanceGrid.find('span.bettype-link').click(function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype');            
            var betTypeName = $link.attr('data-bettype-name');
            var isLive = $link.attr('data-is-live');

            getBetChoicePerformanceReport(betTypeId, betTypeName, isLive);
        });
    };

    var getLeaguePerformanceOfBetTypeReport = function (betTypeId, betTypeName, isLive) {
        var leagueParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueName: parameters.LeagueName,
            LeagueGroupIds: parameters.LeagueGroupIds,            
            BetType: betTypeId,
            IsLive: isLive
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeagueOfBetType,
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
            //showBetTypePerformanceReport();
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
            //var $link = $(this);
            //var leagueId = $link.attr('data-league-id');
            //var isLive = $link.attr('data-is-live');
            //var leagueName = $link.attr('data-league-name');

            //getBetChoiceOfBetTypeLeagueReport(betTypeId, betTypeName, leagueId, leagueName, isLive);
        });
    };

    var getTraderOfBettypeLeagueReport = function (betTypeId, betTypeName, leagueId, leagueName, isLive) {
        var traderParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LeagueId: leagueId,
            BetType: betTypeId,
            IsLive: isLive
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderOfBetTypeLeague,
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

        return gridOptions;
    };

    var renderTraderOfBettypeLeagueGridBody = function (data) {
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
    };

    var renderTraderOfBettypeLeagueGridFooter = function (data) {
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
    };

    var handleTraderOfBettypeLeagueGridEvents = function (betTypeId, betTypeName, leagueId, leagueName) {
        domElements.divTraderPerformanceContainer.find('#spanBetTypeLink').click(function () {
            //showBetTypePerformanceReport();
        });

        domElements.divTraderPerformanceContainer.find('#spanLeagueLink').click(function () {
            //showLeaguePerformanceReport();
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

        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetMatchOfBetTypeLeagueTrader,
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
        
    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
};
