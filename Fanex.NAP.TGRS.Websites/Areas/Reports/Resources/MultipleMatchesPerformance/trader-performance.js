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
        ExportTraderPerformance: common.ResolveRootUrl('MultipleMatchesPerformance/ExportTraderPerformance'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('MultipleMatchesPerformance/GetMatchPerformanceOfTrader'),
        GetBettypeDetail: common.ResolveRootUrl('MultipleMatchesPerformance/GetBettypeTrader')
    };

    var parameters = {        
        FromDate: null,
        ToDate: null,
        GradeIds: null,
        TeamIds: null,
        Bettypes: null,
        MultipleMatches: null
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
            minWidth: 190,
            height: 200,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlGrade.next());
            });

        domElements.ddlTeam.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 200,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlTeam.next());
            });

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 100,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
            });

        domElements.ddlMultipleMatches.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 120,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlMultipleMatches.next());
            });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divTraderPerformanceFilter, 'w')) {
                var selectedGrades = domElements.ddlGrade.val();
                var optionGrades = domElements.ddlGrade.find('option');
                var selectedTeams = domElements.ddlTeam.val();
                var optionTeams = domElements.ddlTeam.find('option');
                var selectedBetTypes = domElements.ddlBetType.val();
                var optionBetTypes = domElements.ddlBetType.find('option');
                var selectedMultipleMatches = domElements.ddlMultipleMatches.val();
                var optionMultipleMatches = domElements.ddlMultipleMatches.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.GradeIds = selectedGrades.length === optionGrades.length ? ' ' : selectedGrades.join(',');
                parameters.TeamIds = selectedTeams.length === optionTeams.length ? ' ' : selectedTeams.join(',');
                parameters.Bettypes = selectedBetTypes.length === optionBetTypes.length ? ' ' : selectedBetTypes.join(',');
                parameters.MultipleMatches = selectedMultipleMatches.length === optionMultipleMatches.length ? ' ' : selectedMultipleMatches.join(',');

                hideAllReports();
                getTraderPerformanceReport();
            }
        });
    };

    var hideAllReports = function () {
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

        if (data && data.TotalItems > 0) {
            bodyData = renderTraderPerformanceGridBody(data);
            footerData = renderTraderPerformanceGridFooter(data);
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
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.MultipleMatches, Width: 100, Name: 'ColMultipleMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Count, Width: 100, Name: 'ColCount', HeaderAlign: 'center', CellAlign: 'right',
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
                    handleTraderPerformanceGridEvents();
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
                    handleTraderPerformanceGridEvents();
                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }    

    var renderTraderPerformanceGridBody = function (data) {
        var multipleMatchesFormat = '<span class="match-link link" data-trader-id="{0}" data-trader-name="{1}" data-match-ids="{2}">{3}</span>';
        var bodyData = [];
        var row;
        var multipleMatchesCol = '';

        $.each(data.GroupList, function (groupIndex, group) {
            var totalItems = group.ItemList.length;
            var mergeRowColumns = [];
            mergeRowColumns.push(
                { Name: 'ColNo', Value: groupIndex + 1, MergeRowNumber: totalItems },
                { Name: 'ColTrader', Value: group.TraderName, MergeRowNumber: totalItems },
                { Name: 'ColGrade', Value: group.Grade, MergeRowNumber: totalItems },
                { Name: 'ColTeam', Value: group.TeamName, MergeRowNumber: totalItems }
            );

            $.each(group.ItemList, function (itemIndex, item) {
                var itemColumns = itemIndex == 0 ? mergeRowColumns : [];
                multipleMatchesCol = multipleMatchesFormat.format(group.TraderId, group.TraderName, item.MatchList, item.MultipleMatches);
                row = {
                    Columns: itemColumns.concat([
                        { Name: 'ColMultipleMatches', Value: multipleMatchesCol },
                        { Name: 'ColCount', Value: item.Count },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]),
                    CssClass: ''
                };
                bodyData.push(row);
            })
        })

        return bodyData;
    }

    var renderTraderPerformanceGridFooter = function (data) {
        return [
            {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 5, CellAlign: 'right' },
                    { Name: 'ColCount', Value: data.GrandTotal.Count },
                    { Name: 'ColTurnover', Value: data.GrandTotal.Turnover },
                    { Name: 'ColWinLoss', Value: data.GrandTotal.WinLoss },
                    { Name: 'ColBetCount', Value: data.GrandTotal.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.GrandTotal.Margin, labels.NA) }]
            }
        ];
    }
    
    var handleTraderPerformanceGridEvents = function () {        
        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var link = $(this);
            var trader = link.closest('tr').find('span.trader');
            var traderId = link.attr('data-trader-id');
            var traderName = link.attr('data-trader-name');
            var matchIds = link.attr('data-match-ids');
            var multipleMatches = link.text();

            getMatchesPerformanceReport(traderId, matchIds, traderName, multipleMatches);
        });
    }

    // Export trader performance to excel.
    var exportTraderPerformance = function () {
        common.DownloadFile(urls.ExportTraderPerformance, parameters);
    };

    var getMatchesPerformanceReport = function (traderId, matchIds, traderName, multipleMatches) {
        var matchPerformanceParamrters = {
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Bettypes: parameters.Bettypes,
            CustId: traderId,
            MatchIds: matchIds
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
                reloadPage(cachedData.PageIndex, cachedData.PageSize, traderId, traderName, multipleMatches);
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
    var reloadPage = function (pageIndex, pageSize, traderId, traderName, multipleMatches) {
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
                        RangeDateValue: group.RangeDateValue,
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
        renderMatchPerformanceGrid(pageData, traderId, traderName, multipleMatches);
    }

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, traderId, traderName, multipleMatches) {
        var bodyData = [];
        var footerData = [];

        if (data && data.length > 0) {
            bodyData = renderMatchPerformanceGridBody(data, traderId, traderName, multipleMatches);
            footerData = renderMatchPerformanceGridFooter();
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceGridOptions(traderId, traderName, multipleMatches);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(traderId);
    };

    var renderMatchPerformanceGridOptions = function (traderId, traderName, multipleMatches) {
        var titleFormat = '<span id="spanTraderLink" class="breadcrumb-link">{0}</span><span> >> Multiple by {1} of {2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: labels.KOTime, Width: 140, Name: 'ColKOTime', HeaderAlign: 'center', CellAlign: 'center' },
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
                text: titleFormat.format(labels.MultipleMatchesPerformance, multipleMatches, traderName)
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
                    reloadPage(pageSize, pageIndex, traderId, traderName, multipleMatches);
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderMatchPerformanceGridBody = function (data, traderId, traderName, multipleMatches) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-trader-id="{1}" data-trader-name="{2}" data-match-id="{3}"';
        matchDetailFormat += 'data-multiple-matches="{4}">{5}</span>';
        matchDetailFormat += '<span class="">{6}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var subRows;
        var row;      
        var counter = 0;

        $.each(data, function (groupIndex, group) {
            subRows = [];
            
            $.each(group.Items, function (index, item) {   
                counter++;
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, traderId, traderName, item.MatchId, multipleMatches, item.MatchName, item.LeagueName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                        { Name: 'ColMatch', Value: matchDetailCol },
                        { Name: 'ColKOTime', Value: item.KOTime },
                        { Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColBetCount', Value: item.BetCount },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };
                subRows.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: group.RangeDateValue, MergeColNumber: 3, CellAlign: 'left' },
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

    var renderMatchPerformanceGridFooter = function () {
        return [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
            { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
            { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA) }]
        }];
    }

    var handleMatchPerformanceGridEvents = function (traderId) {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        })

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var link = $(this);
            var traderId = link.attr('data-trader-id');
            var traderName = link.attr('data-trader-name');
            var matchId = link.attr('data-match-id');
            var matchName = link.text();
            var multipleMatches = link.attr('data-multiple-matches');         

            getBettypeDetailReport(traderId, traderName, matchId, matchName, multipleMatches);
        })
    }

    var showTraderPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    var getBettypeDetailReport = function (traderId, traderName, matchId, matchName, multipleMatches) {
        var bettypeDetailParameters = {
            Bettypes: parameters.Bettypes,
            CustId: traderId,
            MatchId: matchId           
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeDetailGrid(result, traderId, traderName, matchId, matchName, multipleMatches);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    // Render Bettype of grid.
    var renderBettypeDetailGrid = function (data, traderId, traderName, matchId, matchName, multipleMatches) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = renderBettypeDetailGridBody(data);
            footerData = renderBettypeDetailGridFooter(data);
        }

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');
        var gridOptions = renderBettypeDetailGridOptions(traderName, multipleMatches, matchName);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);
        handleBettypeDetailGridEvents(traderId);
    }

    var renderBettypeDetailGridOptions = function (traderName, multipleMatches, matchName) {
        var titleFormat = '<span id="spanTraderLink"  class="breadcrumb-link"> {0}</span>' +
            '<span id="spanMatchLink"  class="breadcrumb-link"> >> Multiple by {1} of {2}</span>' +
            '<span title="{3}"> >> {4}</span>';
        var titleLength = labels.MultipleMatchesPerformance.length + traderName.length + 22;
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                }              
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.MultipleMatchesPerformance, multipleMatches, traderName, matchName, shortenName(95, titleLength, matchName))
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
            showPager: false,
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

        return gridOptions;
    }

    var renderBettypeDetailGridBody = function (data) {
        var bodyData = [];       
        var row;

        $.each(data.ItemList, function (index, item) {
            var currentRowData = [];
            currentRowData = [];
            currentRowData.push({ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColBettype', Value: item.TypeName },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) });
            row = {
                Columns: currentRowData
            };
            bodyData.push(row);
        })

        return bodyData;
    }

    var renderBettypeDetailGridFooter = function (data) {
        return [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    var handleBettypeDetailGridEvents = function () {
        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        })

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceReport();
        })
    }

    var showMatchPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    $this.InitPage = function () {
        cacheDOMElements(); 
        initializeFields();
    };
};