$(document).ready(function () {
    var modelPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.ModelPerformance();
    modelPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.RT3PerformanceDetail.ModelPerformance');
Fanex.NAP.TGRS.RT3PerformanceDetail.ModelPerformance = function () {
    var $this = this;

    var urls = {
        GetModelPerformance: common.ResolveRootUrl('RT3PerformanceDetail/GetModelPerformance'),
        ExportModelPerformance: common.ResolveRootUrl('RT3PerformanceDetail/ExportModelPerformance')
    };

    var domElements = {
        divModelPerformanceFilter: null,
        ddlDataType: null,
        btnGenerate: null,
        divModelPerformanceContainer: null,
        divModelPerformanceGrid: null,
        divSummaryContainer: null
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        DataType: null
    };

    var summaryPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance();
    summaryPerformance.InitPage();
    var chartPerforamnce = new Fanex.TGRS.RT3PerformanceDetail.ChartPerformance();
    chartPerforamnce.InitPage();

    var cacheDOMElements = function () {
        domElements.divModelPerformanceFilter = $('#divModelPerformanceFilter');
        domElements.divDateRange = domElements.divModelPerformanceFilter.find('#divDateRange');
        domElements.ddlDataType = domElements.divModelPerformanceFilter.find('#ddlDataType');
        domElements.btnGenerate = domElements.divModelPerformanceFilter.find('#btnGenerate');
        domElements.divModelPerformanceContainer = $('#divModelPerformanceContainer');
        domElements.divModelPerformanceGrid = $('#divModelPerformanceGrid');
        domElements.divSummaryContainer = $('#divSummaryContainer');
    }

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
        
        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divModelPerformanceFilter, 'w')) {
                domElements.divSummaryContainer.show();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.DataType = domElements.ddlDataType.val();

                domElements.divModelPerformanceContainer.addClass('display-none');
                getModelPerformanceReport();
            }
        });
    }

    var getModelPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetModelPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderModelPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderModelPerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = generateModelPerformanceGridBody(data);
            footerData = generateModelPerformanceGridFooter(data);
        }
        var gridOptions = generateModelPerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divModelPerformanceGrid.fanexGrid(gridOptions);

        summaryPerformance.BindData(data.GrandTotal, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);

        chartPerforamnce.BindData(data);
        chartPerforamnce.Display(true);
    }

    var generateModelPerformanceGridOptions = function () {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: getGroupHeaderColumns()
                }
            ],
            columns: getHeaderColumns(),
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportModelPerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {                    
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
                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }

    var getGroupHeaderColumns = function () {
        if (parameters.DataType == labels.Number) {
            return [
                { HeaderText: labels.Model, Name: "ColModel", MergeRowNumber: 2 },
                { HeaderText: labels.Match, Name: "ColMatchCount", MergeRowNumber: 2 },
                { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                { HeaderText: labels.VirtualTotal, Name: "ColVirtualTotalTurnover", MergeColNumber: 3 },
                { HeaderText: labels.Variance, Name: "ColVarianceTurnover", MergeColNumber: 3, ThClass: 'dim' },
                { HeaderText: labels.RealTotal, Name: "ColRealTotalTurnover", MergeColNumber: 3 },
                { HeaderText: labels.Total8RM, Name: "ColTotal8RMTurnover", MergeColNumber: 3, ThClass: 'dim' },
                { HeaderText: labels.RealTotal8RMWL, Name: "ColRealTotal8RMWLTurnover", MergeColNumber: 3 }
            ]
        } else {
            return [
                { HeaderText: labels.Model, Name: "ColModel", MergeRowNumber: 2 },
                { HeaderText: labels.Match + " %", Name: "ColMatchCount", MergeRowNumber: 2 },
                { HeaderText: labels.BetCount + " %", Name: "ColBetCount", MergeRowNumber: 2 },
                { HeaderText: labels.VirtualTotal, Name: "ColVirtualTotalTurnover", MergeColNumber: 3 },
                { HeaderText: labels.Variance, Name: "ColVarianceTurnover", MergeColNumber: 3, ThClass: 'dim' },
                { HeaderText: labels.RealTotal, Name: "ColRealTotalTurnover", MergeColNumber: 3 },
                { HeaderText: labels.Total8RM, Name: "ColTotal8RMTurnover", MergeColNumber: 3, ThClass: 'dim' },
                { HeaderText: labels.RealTotal8RMWL, Name: "ColRealTotal8RMWLTurnover", MergeColNumber: 3 }
            ]
        }
    }

    var getHeaderColumns = function () {
        if (parameters.DataType == labels.Number) {
            return [
                { HeaderText: labels.Model, Width: 165, Name: "ColModel", HeaderAlign: "center", CellAlign: "left", Sort: false },
                { HeaderText: labels.Match, Width: 60, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: false, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.BetCount, Width: 70, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: false, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.Turnover, Width: 112, Name: "ColVirtualTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 112, Name: "ColVirtualTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColVirtualTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Turnover, Width: 112, Name: "ColVarianceTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 112, Name: "ColVarianceWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColVarianceMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Turnover, Width: 112, Name: "ColRealTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 112, Name: "ColRealTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColRealTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Turnover, Width: 112, Name: "ColTotal8RMTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 112, Name: "ColTotal8RMWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColTotal8RMMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Turnover, Width: 112, Name: "ColRealTotal8RMWLTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 112, Name: "ColRealTotal8RMWLWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColRealTotal8RMWLMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' }
            ]
        } else {
            return [
                { HeaderText: labels.Model, Width: 160, Name: "ColModel", HeaderAlign: "center", CellAlign: "left", Sort: false },
                { HeaderText: labels.Match + " %", Width: 60, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: false, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.BetCount + " %", Width: 75, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: false, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.Turnover + " %", Width: 112, Name: "ColVirtualTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss + " %", Width: 112, Name: "ColVirtualTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColVirtualTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Turnover + " %", Width: 112, Name: "ColVarianceTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss + " %", Width: 112, Name: "ColVarianceWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColVarianceMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Turnover + " %", Width: 112, Name: "ColRealTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss + " %", Width: 112, Name: "ColRealTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColRealTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Turnover + " %", Width: 112, Name: "ColTotal8RMTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim' },
                { HeaderText: labels.WinLoss + " %", Width: 112, Name: "ColTotal8RMWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColTotal8RMMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: 'dim', FormatNegative: '$' },
                { HeaderText: labels.Turnover + " %", Width: 112, Name: "ColRealTotal8RMWLTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss + " %", Width: 112, Name: "ColRealTotal8RMWLWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 72, Name: "ColRealTotal8RMWLMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' }
            ]
        }
    }

    var generateModelPerformanceGridBody = function (data) {
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (index, item) {
            var currentRowData = [];
            currentRowData.push(
                { Name: 'ColModel', Value: item.ModelName, CssClass: 'bold' },
                { Name: 'ColMatchCount', Value: item.MatchCount },
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

    var generateModelPerformanceGridFooter = function (data) {
        if (parameters.DataType == labels.Number) {
            return [{
                Columns: [{ Name: 'ColModel', Value: labels.GrandTotal, CellAlign: 'right' },
                { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
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
                ]
            }];
        } else {
            return [{
                Columns: [{ Name: 'ColModel', Value: labels.GrandTotal, CellAlign: 'right' },
                { Name: 'ColMatchCount', Value: '' },
                { Name: 'ColBetCount', Value: '' },
                { Name: 'ColVirtualTotalTurnover', Value: common.GetNumWithLabel(data.GrandTotal.VirtualTotalMargin, labels.NA), MergeColNumber: 3, CellAlign: 'right', FormatNegative: '$' },
                { Name: 'ColVarianceTurnover', Value: common.GetNumWithLabel(data.GrandTotal.VarianceMargin, labels.NA), MergeColNumber: 3, CellAlign: 'right', FormatNegative: '$' },
                { Name: 'ColRealTotalTurnover', Value: common.GetNumWithLabel(data.GrandTotal.RealTotalMargin, labels.NA), MergeColNumber: 3, CellAlign: 'right', FormatNegative: '$' },
                { Name: 'ColTotal8RMTurnover', Value: common.GetNumWithLabel(data.GrandTotal.Total8RMMargin, labels.NA), MergeColNumber: 3, CellAlign: 'right', FormatNegative: '$' },
                { Name: 'ColRealTotal8RMWLTurnover', Value: common.GetNumWithLabel(data.GrandTotal.Total8RMWLMargin, labels.NA), MergeColNumber: 3, CellAlign: 'right', FormatNegative: '$' }
                ]
            }];
        }
    } 

    var exportModelPerformance = function () {
        common.DownloadFile(urls.ExportModelPerformance, parameters);
    }

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
}