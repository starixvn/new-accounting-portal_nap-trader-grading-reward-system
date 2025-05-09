$(document).ready(function () {
    var leaguePerformance = new Fanex.NAP.TGRS.OSReports.BasketballPerformace.League();

    leaguePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.OSReports.BasketballPerformace.League');
Fanex.NAP.TGRS.OSReports.BasketballPerformace.League = function () {
    var $this = this;

    var urls = {
        GetLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetLeaguePerformance'),
        ExportLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/ExportLeaguePerformance'),
        GetMatchOfLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetMatchOfLeaguePerformance'),
        ExportMatchOfLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/ExportMatchOfLeaguePerformance'),
        GetBetTypeOfLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/GetBetTypeOfLeaguePerformance'),
        ExportBetTypeOfLeaguePerformance: common.ResolveRootUrl('OSReports/OSBasketballPerformance/ExportBetTypeOfLeaguePerformance'),
    };

    var domElements = {
        divLeaguePerformanceFilter: null,
        ddlLiveType: null,
        divDateRange: null,
        ddlBetType: null,
        ddlLeagueGroup: null,
        txtLeague: null,
        btnGenerate: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null
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
        domElements.divLeaguePerformanceFilter = $('#divLeaguePerformanceFilter');
        domElements.ddlLiveType = domElements.divLeaguePerformanceFilter.find('#ddlLiveType');
        domElements.divDateRange = domElements.divLeaguePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divLeaguePerformanceFilter.find('#ddlBetType');
        domElements.ddlLeagueGroup = domElements.divLeaguePerformanceFilter.find('#ddlLeagueGroup');
        domElements.txtLeague = domElements.divLeaguePerformanceFilter.find('#txtLeague');
        domElements.btnGenerate = domElements.divLeaguePerformanceFilter.find('#btnGenerate');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
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
            if (validator.ValidateForm(domElements.divLeaguePerformanceFilter, 'w') && validateBetType() && validateLeagueGroup()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Bettypes = selectedBetTypes.join(',');
                parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null;
                parameters.LeagueName = domElements.txtLeague.val().trim();
                parameters.LiveType = domElements.ddlLiveType.val();

                hideAllReports();
                getLeaguePerformanceReport();
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
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBetTypePerformanceContainer.addClass('display-none');
    };

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

    var renderLeaguePerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.Items.length > 0) {
            bodyData = renderLeaguePerformanceGridBody(data);
            footerData = renderLeaguePerformanceGridFooter(data);
        }

        var gridOptions = renderLeaguePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents();
    };

    var renderLeaguePerformanceGridOptions = function () {
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: labels.Market, Width: 90, Name: 'ColMarket', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.LeagueGroup, Width: 100, Name: 'ColLeagueGroupName', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
                {
                    HeaderText: labels.NoOfMatches, Width: 110, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
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
                },
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatchAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, Sort: true
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true
                }
            ],
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                        { HeaderText: labels.League, Name: "ColLeague", MergeRowNumber: 2 },
                        { HeaderText: labels.Market, Name: "ColMarket", MergeRowNumber: 2 },
                        { HeaderText: labels.LeagueGroup, Name: "ColLeagueGroupName", MergeRowNumber: 2 },
                        { HeaderText: labels.NoOfTraders, Name: "ColNoOfTraders", MergeRowNumber: 2 },
                        { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
                        { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                        { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 4 },
                        { HeaderText: "Real", Name: "ColTurnoverAR", MergeColNumber: 4 }
                ] }
            ],
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
            showFooter: true,
            customizeHeader: true
        };

        return gridOptions;
    };

    var exportLeaguePerformance = function () {
        common.DownloadFile(urls.ExportLeaguePerformance, parameters);
    };

    var renderLeaguePerformanceGridBody = function (data) {
        var noOfMatchesFormat = '<span class="match-link link" data-league="{0}" data-is-live="{1}" title="{2}" data-league-name="{3}">{4}</span>';
        var bodyData = [];
        var row;
        var leagueId = '';
        var evenClass = '';
        var rowIndex = 1;

        $.each(data.Items, function (_, item) {
            noOfMatchCol = noOfMatchesFormat.format(item.LeagueId, item.IsLive, item.LeagueName, item.LeagueName, numeral(item.MatchCount).format(common.Formats.IntegerFormat));
            var currentColumms = [];

            if (leagueId !== item.LeagueId) {
                evenClass = evenClass === 'freegrid-even' ? '' : 'freegrid-even';
            }

            row = {
                Columns: currentColumms.concat([
                    { Name: 'ColNo', Value: rowIndex++ },
                    { Name: 'ColLeague', Value: item.LeagueName },
                    { Name: 'ColMarket', Value: item.IsLive ? labels.MarketLive : labels.MarketNonLive },
                    { Name: 'ColLeagueGroupName', Value: item.GroupName },
                    { Name: 'ColNoOfTraders', Value: item.TraderCount },
                    { Name: 'ColNoOfMatches', Value: noOfMatchCol },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.MatchCount) },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                    { Name: 'ColTurnoverAR', Value: item.Turnover_AR },
                    { Name: 'ColAvgTurnoverPerMatchAR', Value: (item.Turnover_AR / item.MatchCount) },
                    { Name: 'ColWinLossAR', Value: item.WinLoss_AR },
                    { Name: 'ColMarginAR', Value: common.GetNumWithLabel(item.Margin_AR, labels.NA) }]),
                CssClass: evenClass
            };

            bodyData.push(row);
            leagueId = item.LeagueId;
        });

        return bodyData;
    };

    var renderLeaguePerformanceGridFooter = function (data) {
        var footerData = [];
        var itemLive = {
            Columns: [
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                { Name: 'ColMarket', Value: 'Live' },
                { Name: 'ColLeagueGroupName', Value: '' },
                { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.TraderCount).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfMatches', Value: data.TotalItemLive.MatchCount },
                { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemLive.MatchCount !== 0 ? (data.TotalItemLive.Turnover / data.TotalItemLive.MatchCount) : 0 },
                { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) },
                { Name: 'ColTurnoverAR', Value: data.TotalItemLive.Turnover_AR },
                { Name: 'ColAvgTurnoverPerMatchAR', Value: data.TotalItemLive.MatchCount !== 0 ? (data.TotalItemLive.Turnover_AR / data.TotalItemLive.MatchCount) : 0 },
                { Name: 'ColWinLossAR', Value: data.TotalItemLive.WinLoss_AR },
                { Name: 'ColMarginAR', Value: common.GetNumWithLabel(data.TotalItemLive.Margin_AR, labels.NA) }]
        };

        var itemNonLive = {
            Columns: [
                { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, MergeRowNumber: 2, CellAlign: 'right' },
                { Name: 'ColMarket', Value: 'Non-Live' },
                { Name: 'ColLeagueGroupName', Value: '' },
                { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemNonLive.TraderCount).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfMatches', Value: data.TotalItemNonLive.MatchCount },
                { Name: 'ColBetCount', Value: data.TotalItemNonLive.BetCount },
                { Name: 'ColTurnover', Value: data.TotalItemNonLive.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemNonLive.MatchCount !== 0 ? (data.TotalItemNonLive.Turnover / data.TotalItemNonLive.MatchCount) : 0 },
                { Name: 'ColWinLoss', Value: data.TotalItemNonLive.WinLoss },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin, labels.NA) },
                { Name: 'ColTurnoverAR', Value: data.TotalItemNonLive.Turnover_AR },
                { Name: 'ColAvgTurnoverPerMatchAR', Value: data.TotalItemNonLive.MatchCount !== 0 ? (data.TotalItemNonLive.Turnover_AR / data.TotalItemNonLive.MatchCount) : 0 },
                { Name: 'ColWinLossAR', Value: data.TotalItemNonLive.WinLoss_AR },
                { Name: 'ColMarginAR', Value: common.GetNumWithLabel(data.TotalItemNonLive.Margin_AR, labels.NA) }]
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
                    { Name: 'ColLeagueGroupName', Value: '' },
                    { Name: 'ColNoOfTraders', Value: numeral(data.TotalItemLive.TraderCount).format(common.Formats.IntegerFormat) },
                    { Name: 'ColNoOfMatches', Value: data.TotalItemLive.MatchCount },
                    { Name: 'ColBetCount', Value: data.TotalItemLive.BetCount },
                    { Name: 'ColTurnover', Value: data.TotalItemLive.Turnover },
                    { Name: 'ColAvgTurnoverPerMatch', Value: data.TotalItemLive.MatchCount !== 0 ? (data.TotalItemLive.Turnover / data.TotalItemLive.MatchCount) : 0 },
                    { Name: 'ColWinLoss', Value: data.TotalItemLive.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.TotalItemLive.Margin, labels.NA) },
                    { Name: 'ColTurnoverAR', Value: data.TotalItemLive.Turnover_AR },
                    { Name: 'ColAvgTurnoverPerMatchAR', Value: data.TotalItemLive.MatchCount !== 0 ? (data.TotalItemLive.Turnover_AR / data.TotalItemLive.MatchCount) : 0 },
                    { Name: 'ColWinLossAR', Value: data.TotalItemLive.WinLoss_AR },
                    { Name: 'ColMarginAR', Value: common.GetNumWithLabel(data.TotalItemLive.Margin_AR, labels.NA) }]
            });
        }

        return footerData;
    };

    var handleLeaguePerformanceGridEvents = function () {
        domElements.divLeaguePerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var leagueId = $link.attr('data-league');
            var leagueName = $link.attr('data-league-name');
            var isLive = $link.attr('data-is-live');

            getMatchOfLeaguePerformanceReport(leagueId, leagueName, isLive);
        });
    };

    var getMatchOfLeaguePerformanceReport = function (leagueId, leagueName, isLive) {
        var betChoiceParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LiveType: isLive === 'true' ? "1" : "0",
            LeagueId: leagueId,
            LeagueGroupIds: parameters.LeagueGroupIds,
            Bettypes: parameters.Bettypes
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetMatchOfLeaguePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betChoiceParams),
            success: function (result) {
                renderMatchOfLeaguePerformanceGrid(result, leagueId, leagueName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderMatchOfLeaguePerformanceGrid = function (result, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span><span> >> {1} {2}</span>';

        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.Match, Width: 300, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
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
                },
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ],
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                        { HeaderText: labels.Match, Name: "ColMatch", MergeRowNumber: 2 },
                        { HeaderText: labels.EventDate, Name: "ColEventDate", MergeRowNumber: 2 },
                        { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                        { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                        { HeaderText: "Real", Name: "ColTurnoverAR", MergeColNumber: 3 }
                    ]
                }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == 'true' ? "(Live)" : "(Non-Live)", leagueName),
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportMatchOfLeaguePerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleMatchOfLeaguePerformanceGridEvents(leagueId, leagueName);

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
                    handleMatchOfLeaguePerformanceGridEvents(leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true,
            customizeHeader: true,
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var data = isLive === 'true' ? result.ItemLiveList : result.ItemNonLiveList;
        var noOfMatchesFormat = '<span class="bettype-link link" data-match="{0}" data-is-live="{1}" title="{2}" data-match-name="{3}" data-league="{4}" data-league-name="{5}">{3}</span>';
        if (data.length > 0) {
            $.each(data, function (index, item) {
                var noOfMatchCol = noOfMatchesFormat.format(item.MatchId, isLive, item.MatchName, item.MatchName, leagueId, leagueName);
                row = {
                    Columns: [
                        { Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColMatch', Value: noOfMatchCol },
                        { Name: 'ColEventDate', Value: item.EventDate },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                        { Name: 'ColTurnoverAR', Value: item.Turnover_AR },
                        { Name: 'ColWinLossAR', Value: item.WinLoss_AR },
                        { Name: 'ColMarginAR', Value: common.GetNumWithLabel(item.Margin_AR, labels.NA) }
                    ]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [
                    { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                    { Name: 'ColBetCount', Value: result.Total.BetCount },
                    { Name: 'ColTurnover', Value: result.Total.Turnover },
                    { Name: 'ColWinLoss', Value: result.Total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(result.Total.Margin, labels.NA) },
                    { Name: 'ColTurnoverAR', Value: result.Total.Turnover_AR },
                    { Name: 'ColWinLossAR', Value: result.Total.WinLoss_AR },
                    { Name: 'ColMarginAR', Value: common.GetNumWithLabel(result.Total.Margin_AR, labels.NA) }
                ]
            };

            footerData.push(row);
        }

        domElements.divLeaguePerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchOfLeaguePerformanceGridEvents();
    };

    var exportMatchOfLeaguePerformance = function () {
        common.DownloadFile(urls.ExportMatchOfLeaguePerformance, parameters);
    };

    var handleMatchOfLeaguePerformanceGridEvents = function () {
        domElements.divMatchPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
        domElements.divMatchPerformanceContainer.find('span.bettype-link').click(function () {
            var $link = $(this);
            var isLive = $link.attr('data-is-live');
            var match = $link.attr('data-match');
            var matchName = $link.attr('data-match-name');
            var leagueId = $link.attr('data-league');
            var leagueName = $link.attr('data-league-name');

            getBetTypeOfLeaguePerformanceReport(leagueId, leagueName, match, matchName, isLive);
        });
    };

    var getBetTypeOfLeaguePerformanceReport = function (leagueId, leagueName, matchId, matchName, isLive) {
        var betTypeParams = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            LiveType: isLive === 'true' ? "1" : "0",
            LeagueId: leagueId,
            MatchId: matchId,
            Bettypes: parameters.Bettypes
        };

        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetBetTypeOfLeaguePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(betTypeParams),
            success: function (result) {
                renderBetTypeOfLeaguePerformanceGrid(result, leagueName, matchName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBetTypeOfLeaguePerformanceGrid = function (result, leagueName, matchName, isLive) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span><span id="spanMatchLink" class="breadcrumb-link"> >> {1} {2}</span><span> >> {3}</span>';

        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.EventDate, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
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
                },
                {
                    HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnoverAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLossAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginAR', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ],
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                        { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
                        { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                        { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 },
                        { HeaderText: "Real", Name: "ColTurnoverAR", MergeColNumber: 3 }
                    ]
                }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguePerformance, isLive == "true" ? "(Live)" : "(Non-Live)", leagueName, matchName),
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportBetTypeOfLeaguePerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBetTypeOfLeaguePerformanceGridEvents();

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
                    handleBetTypeOfLeaguePerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true,
            customizeHeader: true,
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var data = isLive === 'true' ? result.ItemLiveList : result.ItemNonLiveList;
        if (data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [
                        { Name: 'ColNo', Value: index + 1 },
                        { Name: 'ColBetType', Value: item.BetTypeName },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                        { Name: 'ColTurnoverAR', Value: item.Turnover_AR },
                        { Name: 'ColWinLossAR', Value: item.WinLoss_AR },
                        { Name: 'ColMarginAR', Value: common.GetNumWithLabel(item.Margin_AR, labels.NA) }
                    ]
                };

                bodyData.push(row);
            });

            row = {
                Columns: [
                    { Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                    { Name: 'ColBetCount', Value: result.Total.BetCount },
                    { Name: 'ColTurnover', Value: result.Total.Turnover },
                    { Name: 'ColWinLoss', Value: result.Total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(result.Total.Margin, labels.NA) },
                    { Name: 'ColTurnoverAR', Value: result.Total.Turnover_AR },
                    { Name: 'ColWinLossAR', Value: result.Total.WinLoss_AR },
                    { Name: 'ColMarginAR', Value: common.GetNumWithLabel(result.Total.Margin_AR, labels.NA) }
                ]
            };

            footerData.push(row);
        }

        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);

        handleBetTypeOfLeaguePerformanceGridEvents();
    };

    var exportBetTypeOfLeaguePerformance = function () {
        common.DownloadFile(urls.ExportBetTypeOfLeaguePerformance, parameters);
    };

    var handleBetTypeOfLeaguePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceReport();
        });

        domElements.divBetTypePerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    var showMatchPerformanceReport = function () {
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
    };

    var showLeaguePerformanceReport = function () {
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
    };

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
};
