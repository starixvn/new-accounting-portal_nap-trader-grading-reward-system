$(document).ready(function () {
    var monthPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.MonthPerformance();
    monthPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.RT3PerformanceDetail.MonthPerformance');
Fanex.NAP.TGRS.RT3PerformanceDetail.MonthPerformance = function () {
    var $this = this;

    var urls = {
        GetMonthPerformance: common.ResolveRootUrl('RT3PerformanceDetail/GetMonthPerformance'),
        ExportMonthPerformance: common.ResolveRootUrl('RT3PerformanceDetail/ExportMonthPerformance')
    };

    var domElements = {
        divMonthPerformanceFilter: null,
        ddlPeriodType: null,
        ddlLeagueGroup: null,
        btnGenerate: null,
        divMonthPerformanceContainer: null,
        divMonthPerformanceGrid: null        
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        LeagueGroupIds: null
    };

    var summaryPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance();
    summaryPerformance.InitPage();

    var cacheDOMElements = function () {
        domElements.divMonthPerformanceFilter = $('#divMonthPerformanceFilter');
        domElements.divDateRange = domElements.divMonthPerformanceFilter.find('#divDateRange');        
        domElements.ddlLeagueGroup = domElements.divMonthPerformanceFilter.find('#ddlLeagueGroup');
        domElements.btnGenerate = domElements.divMonthPerformanceFilter.find('#btnGenerate');
        domElements.divMonthPerformanceContainer = $('#divMonthPerformanceContainer');
        domElements.divMonthPerformanceGrid = $('#divMonthPerformanceGrid');      
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

        domElements.ddlPeriodType = domElements.divDateRange.find('#ddlPeriodType');
        domElements.divDateRange.find("span:contains('Date')").text('Month');
        domElements.ddlPeriodType.val(2).change();        

        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 140,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlLeagueGroup.next());
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divMonthPerformanceFilter, 'w')) {
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();                

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueGroupIds = selectedLeagueGroups != null ? selectedLeagueGroups.join(',') : selectedLeagueGroups;
                
                domElements.divMonthPerformanceContainer.addClass('display-none');
                getMonthPerformanceReport();
            }
        });           
    };   

    var getMonthPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMonthPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderMonthPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderMonthPerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = renderMonthPerformanceGridBody(data);
            footerData = renderMonthPerformanceGridFooter(data);
        }
        var gridOptions = renderMonthPerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMonthPerformanceGrid.fanexGrid(gridOptions);
        summaryPerformance.BindData(data.GrandTotal, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);      
    }

    var renderMonthPerformanceGridOptions = function () {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: labels.Month, Name: "ColMonth", MergeRowNumber: 2 },
                        { HeaderText: labels.Match, Name: "ColMatch", MergeRowNumber: 2 },
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
                { HeaderText: labels.Month, Width: 80, Name: "ColMonth", HeaderAlign: "center", CellAlign: "left", Sort: true },
                { HeaderText: labels.Match, Width: 85, Name: "ColMatch", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.BetCount, Width: 85, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.Turnover, Width: 120, Name: "ColVirtualTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.WinLoss, Width: 110, Name: "ColVirtualTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.Margin, Width: 75, Name: "ColVirtualTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.Turnover, Width: 120, Name: "ColVarianceTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 110, Name: "ColVarianceWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.Margin, Width: 75, Name: "ColVarianceMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.Turnover, Width: 120, Name: "ColRealTotalTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.WinLoss, Width: 110, Name: "ColRealTotalWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.Margin, Width: 75, Name: "ColRealTotalMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.Turnover, Width: 120, Name: "ColTotal8RMTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.WinLoss, Width: 110, Name: "ColTotal8RMWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.Margin, Width: 75, Name: "ColTotal8RMMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat , ThClass: 'dim' },
                { HeaderText: labels.Turnover, Width: 120, Name: "ColRealTotal8RMWLTurnover", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.WinLoss, Width: 110, Name: "ColRealTotal8RMWLWinLoss", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  },
                { HeaderText: labels.Margin, Width: 75, Name: "ColRealTotal8RMWLMargin", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat  }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportMonthPerformance();
                }
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    //handleMonthPerformanceGridEvents();
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
                    //handleMonthPerformanceGridEvents();
                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }

    var renderMonthPerformanceGridBody = function (data) {
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (index, item) {
            var currentRowData = [];          
            currentRowData.push(
                { Name: 'ColMonth', Value: item.Month, CssClass: 'bold' },
                { Name: 'ColMatch', Value: item.Match },
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

    var renderMonthPerformanceGridFooter = function (data) {
        return [{
            Columns: [{ Name: 'ColMonth', Value: labels.GrandTotal, CellAlign: 'right' },
                { Name: 'ColMatch', Value: data.GrandTotal.Match, CellAlign: 'right' },
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

    var exportMonthPerformance = function () {
        common.DownloadFile(urls.ExportMonthPerformance, parameters);
    }    
 
    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
}