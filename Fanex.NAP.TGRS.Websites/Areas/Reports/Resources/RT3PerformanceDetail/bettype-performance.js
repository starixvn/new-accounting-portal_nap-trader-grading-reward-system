$(document).ready(function () {   
    var betTypePerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance();
    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance');
Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance = function () {
    var $this = this;

    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('RT3PerformanceDetail/GetBetTypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('RT3PerformanceDetail/ExportBetTypePerformance')
    };

    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlLeagueGroup: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null,       
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        LeagueGroupIds: null
    };

    var summaryPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance();
    summaryPerformance.InitPage();

    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
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
        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 140,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlLeagueGroup.next());
            });        

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
               
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueGroupIds = selectedLeagueGroups != null ? selectedLeagueGroups.join(',') : selectedLeagueGroups;

                hideAllReports();
                getBetTypePerformanceReport();
            }
        });
    };

    var hideAllReports = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
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
    }

    var renderBetTypePerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = renderBetTypePerformanceGridBody(data);
            footerData = renderBetTypePerformanceGridFooter(data);
        }
        var gridOptions = renderBetTypePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);
        summaryPerformance.BindDataInfoSummary(data.GrandTotal, data.LeagueCount, data.MatchCount);
        summaryPerformance.DisplayInfoSummary(true);        
    }

    var renderBetTypePerformanceGridOptions = function () {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
                        { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                        { HeaderText: labels.VirtualTotal, Name: "ColVirtualTotalTurnover", MergeColNumber: 3 },
                        { HeaderText: labels.Variance, Name: "ColVarianceTurnover", MergeColNumber: 3, ThClass: 'dim' },
                        { HeaderText: labels.RealTotal, Name: "ColRealTotalTurnover", MergeColNumber: 3 },
                        { HeaderText: labels.Total8RM, Name: "ColTotal8RMTurnover", MergeColNumber: 3, ThClass: 'dim' },
                        { HeaderText: labels.RealTotal8RMWL, Name: "ColRealTotal8RMWLTurnover", MergeColNumber: 3 }
                    ]
                }
            ],
            columns: [
                { HeaderText: labels.BetType, Width: 115, Name: "ColBetType", HeaderAlign: "center", CellAlign: "left", Sort: true },
                { HeaderText: labels.BetCount, Width: 115, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.Turnover, Width: 115, Name: "ColVirtualTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 115, Name: "ColVirtualTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.Margin, Width: 80, Name: "ColVirtualTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.Turnover, Width: 115, Name: "ColVarianceTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 115, Name: "ColVarianceWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.Margin, Width: 80, Name: "ColVarianceMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.Turnover, Width: 115, Name: "ColRealTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 115, Name: "ColRealTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.Margin, Width: 80, Name: "ColRealTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat},
                { HeaderText: labels.Turnover, Width: 115, Name: "ColTotal8RMTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 115, Name: "ColTotal8RMWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.Margin, Width: 80, Name: "ColTotal8RMMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.Turnover, Width: 115, Name: "ColRealTotal8RMWLTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 115, Name: "ColRealTotal8RMWLWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.Margin, Width: 80, Name: "ColRealTotal8RMWLMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat }
            ],
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
                    //handleBetTypePerformanceGridEvents();
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
                    //handleBetTypePerformanceGridEvents();
                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }

    var renderBetTypePerformanceGridBody = function (data) {
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (index, item) {
            var currentRowData = [];          
            currentRowData.push(
                { Name: 'ColBetType', Value: item.BetTypeName, CssClass: 'bold' },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColVirtualTotalTurnover', Value: item.VirtualTotalTurnover },
                { Name: 'ColVirtualTotalWinLoss', Value: item.VirtualTotalWinLoss },
                { Name: 'ColVirtualTotalMargin', Value: common.GetNumWithLabel(item.VirtualTotalMargin, labels.NA), CssClass: 'bold' },
                { Name: 'ColVarianceTurnover', Value: item.VarianceTurnover },
                { Name: 'ColVarianceWinLoss', Value: item.VarianceWinLoss },
                { Name: 'ColVarianceMargin', Value: common.GetNumWithLabel(item.VarianceMargin, labels.NA), CssClass: 'bold' },
                { Name: 'ColRealTotalTurnover', Value: item.RealTotalTurnover },
                { Name: 'ColRealTotalWinLoss', Value: item.RealTotalWinLoss },
                { Name: 'ColRealTotalMargin', Value: common.GetNumWithLabel(item.RealTotalMargin, labels.NA), CssClass: 'bold' },
                { Name: 'ColTotal8RMTurnover', Value: item.Total8RMTurnover },
                { Name: 'ColTotal8RMWinLoss', Value: item.Total8RMWinLoss },
                { Name: 'ColTotal8RMMargin', Value: common.GetNumWithLabel(item.Total8RMMargin, labels.NA), CssClass: 'bold' },
                { Name: 'ColRealTotal8RMWLTurnover', Value: item.Total8RMWLTurnover },
                { Name: 'ColRealTotal8RMWLWinLoss', Value: item.Total8RMWLWinLoss },
                { Name: 'ColRealTotal8RMWLMargin', Value: common.GetNumWithLabel(item.Total8RMWLMargin, labels.NA), CssClass: 'bold' }
            );
            row = {
                Columns: currentRowData
            };
            bodyData.push(row);
        })

        return bodyData;
    }

    var renderBetTypePerformanceGridFooter = function (data) {
        return [{
            Columns: [{ Name: 'ColBetType', Value: labels.GrandTotal, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: data.GrandTotal.BetCount },
                { Name: 'ColVirtualTotalTurnover', Value: data.GrandTotal.VirtualTotalTurnover },
                { Name: 'ColVirtualTotalWinLoss', Value: data.GrandTotal.VirtualTotalWinLoss },
                { Name: 'ColVirtualTotalMargin', Value: common.GetNumWithLabel(data.GrandTotal.VirtualTotalMargin, labels.NA) },
                { Name: 'ColVarianceTurnover', Value: data.GrandTotal.VarianceTurnover },
                { Name: 'ColVarianceWinLoss', Value: data.GrandTotal.VarianceWinLoss },
                { Name: 'ColVarianceMargin', Value: common.GetNumWithLabel(data.GrandTotal.VarianceMargin, labels.NA) },
                { Name: 'ColRealTotalTurnover', Value: data.GrandTotal.RealTotalTurnover },
                { Name: 'ColRealTotalWinLoss', Value: data.GrandTotal.RealTotalWinLoss },
                { Name: 'ColRealTotalMargin', Value: common.GetNumWithLabel(data.GrandTotal.RealTotalMargin, labels.NA) },
                { Name: 'ColTotal8RMTurnover', Value: data.GrandTotal.Total8RMTurnover },
                { Name: 'ColTotal8RMWinLoss', Value: data.GrandTotal.Total8RMWinLoss },
                { Name: 'ColTotal8RMMargin', Value: common.GetNumWithLabel(data.GrandTotal.Total8RMMargin, labels.NA) },
                { Name: 'ColRealTotal8RMWLTurnover', Value: data.GrandTotal.Total8RMWLTurnover },
                { Name: 'ColRealTotal8RMWLWinLoss', Value: data.GrandTotal.Total8RMWLWinLoss },
                { Name: 'ColRealTotal8RMWLMargin', Value: common.GetNumWithLabel(data.GrandTotal.Total8RMWLMargin, labels.NA) }
            ]}];
    } 

    var exportBetTypePerformance = function () {
        common.DownloadFile(urls.ExportBetTypePerformance, parameters);
    }    

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
}