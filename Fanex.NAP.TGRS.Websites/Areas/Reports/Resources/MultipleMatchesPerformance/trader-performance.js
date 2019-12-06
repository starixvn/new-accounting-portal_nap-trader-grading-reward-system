////'use strict';
$(document).ready(function () {
    var traderPerformance = new Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance();

    traderPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance');
Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance = function () {
    var $this = this;
    var domElements = {
        divTraderPerformanceFilter: null,       
        divDateRange: null,
        ddlGrade: null,
        ddlTeam: null,
        ddlBetType: null,
        ddlMultipleMatches: null,
        btnGenerate: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };
    var urls = {        
        GetTraderPerformance: common.ResolveRootUrl('MultipleMatchesPerformance/GetTraderPerformance'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('MultipleMatchesPerformance/GetMatchPerformanceOfTrader'),
    };

    var parameters = {        
        FromDate: null,
        ToDate: null       
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
        domElements.divTraderPerformanceFilter = $('#divTraderPerformanceFilter');
        domElements.divDateRange = domElements.divTraderPerformanceFilter.find('#divDateRange');
        domElements.ddlGrade = domElements.divTraderPerformanceFilter.find('#ddlGrade');
        domElements.ddlTeam = domElements.divTraderPerformanceFilter.find('#ddlTeam');
        domElements.ddlBetType = domElements.divTraderPerformanceFilter.find('#ddlBetType');
        domElements.ddlMultipleMatches = domElements.divTraderPerformanceFilter.find('#ddlMultipleMatches');
        domElements.btnGenerate = domElements.divTraderPerformanceFilter.find('#btnGenerate');
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

        domElements.ddlGrade.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlGrade.next());
            });

        domElements.ddlTeam.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlTeam.next());
            });

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
            });

        domElements.ddlMultipleMatches.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlMultipleMatches.next());
            });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divTraderPerformanceFilter, 'w')) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');
                
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();

                hideReports();
                getTraderPerformanceReport();
            }
        });
    };

    // Hide reports.
    var hideReports = function () {
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    var getTraderPerformanceReport = function () {
        common.DisableInput();        
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderTraderPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    // Render trader performance of grid.
    var renderTraderPerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = renderTraderPerformanceGridToBody(data);
            footerData = renderTraderPerformanceGridToFooter(data);
        }
        var gridOptions = renderTraderPerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        handleTraderPerformanceGridEvents();
    }

    var renderTraderPerformanceGridOptions = function () {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right' },
            { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.MultipleMatches, Width: 100, Name: 'ColNoOfTimes', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },           
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
                , FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
                , FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: labels.MultipleMatchesPerformance,
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportTraderPerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    //handleTraderPerformanceGridEvents();
                    return rows;
                }
            },
            showPager: false,
            showTree: true,
            showDistinctRow: false,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    //handleTraderPerformanceGridEvents();
                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }

    var renderTraderPerformanceGridToBody = function (data) {        
        var multipleMatchesFormat = '<span class="match-link link" data-trader-id="{0}" title="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var bodyData = [];
        var row;
        var evenClass = '';
        var traderId = '';
        var multipleMatchesCol = '';
        var traderIndex = 0;
       
        $.each(data.ItemList, function (index, item) {
            multipleMatchesCol = multipleMatchesFormat.format(item.TraderId, item.NoOfTimes, item.NoOfTimes);
            var currentColumms = [];
            traderIndex = traderId !== item.TraderId ? traderIndex + 1 : traderIndex;
            
            if (item.FrequencyCust > 1 && (traderId !== item.TraderId)) {
                currentColumms.push(
                    { Name: 'ColNo', Value: traderIndex, MergeRowNumber: item.FrequencyCust },
                    { Name: 'ColTrader', Value: item.TraderName, MergeRowNumber: item.FrequencyCust },
                    { Name: 'ColGrade', Value: item.Grade, MergeRowNumber: item.FrequencyCust },
                    { Name: 'ColTeam', Value: item.TeamName, MergeRowNumber: item.FrequencyCust }
                );                
            } else if (item.FrequencyCust == 1) {
                currentColumms.push(
                    { Name: 'ColNo', Value: traderIndex },
                    { Name: 'ColTrader', Value: item.TraderName },
                    { Name: 'ColGrade', Value: item.Grade },
                    { Name: 'ColTeam', Value: item.TeamName }
                );              
            }
            row = {
                Columns: currentColumms.concat([
                    { Name: 'ColNoOfTimes', Value: multipleMatchesCol },
                    { Name: 'ColNoOfMatches', Value: item.NoOfMatches },                               
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]),
                CssClass: evenClass
            };
            bodyData.push(row);
            traderId = item.TraderId;
        })

        return bodyData;
    }

    var renderTraderPerformanceGridToFooter = function (data) {
        return [
            {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 5, CellAlign: 'right' },
                { Name: 'ColNoOfMatches', Value: data.Total.NoOfLeagues },
                { Name: 'ColTurnover', Value: data.Total.Turnover },
                { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                { Name: 'ColBetCount', Value: data.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
            }
        ];
    }
    
    var handleTraderPerformanceGridEvents = function () {        
        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var link = $(this);
            var trader = link.closest('tr').find('span.trader');
            var traderId = link.attr('data-trader-id');          

            getMatchesPerformanceReport(traderId);
        });
    }

    // Get matches performance by trader
    var getMatchesPerformanceReport = function (traderId) {
        var matchPerformanceParamrters = {
            CustId: traderId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result.GroupList;
                cachedData.GrandTotal = result.GrandTotal;
                cachedData.TotalItems = result.TotalItems;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, traderId);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    // Customize reloading page.
    var reloadPage = function (pageIndex, pageSize, traderId) {
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
                var items = group.ItemList;
                var temCounter = counter + items.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        MatchGroup: group.MatchGroup,                        
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
        renderMatchPerformanceGrid(pageData, traderId);
    }

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, traderId) {
        var bodyData = [];
        var footerData = [];

        if (data && data.length > 0) {
            bodyData = renderMatchPerformanceGridToBody(data);
            footerData = renderMatchPerformanceGridToFooter();
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceGridOptions(traderId);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(traderId);
    };

    var renderMatchPerformanceGridOptions = function (traderId) {
        var titleFormat = '<span id="spanTraderLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
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
                text: labels.TraderPerformance
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
                pagerSelectCallBack: function (pageSize, pageIndex) {
                    reloadPage(pageSize, pageIndex, traderId);
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderMatchPerformanceGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}">{2}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var subRows;
        var row;
        var counter = 0;

        $.each(data, function (groupIndex, group) {
            subRows = [];

            $.each(group.Items, function (index, item) {
                counter++;
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1, CssClass: 'order-column' },
                    { Name: 'ColMatch', Value: matchDetailCol },
                    { Name: 'ColEventDate', Value: item.EventDate },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };
                subRows.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: groupIndex + 1, MergeColNumber: 3, CellAlign: 'left' },
                { Name: 'ColTurnover', Value: group.Total.Turnover },
                { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                { Name: 'ColBetCount', Value: group.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA) }],
                SubRows: subRows
            };
            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceGridToFooter = function () {
        return [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
            { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
            { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA) }]
        }];
    }

    var handleMatchPerformanceGridEvents = function (traderId) {

    }

    $this.InitPage = function () {
        cacheDOMElements(); 
        initializeFields();
    };
};