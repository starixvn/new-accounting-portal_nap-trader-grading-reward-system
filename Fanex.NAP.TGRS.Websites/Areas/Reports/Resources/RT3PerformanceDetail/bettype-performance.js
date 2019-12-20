$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance');
Fanex.NAP.TGRS.RT3PerformanceDetail.BetTypePerformance = function () {
    var $this = this;

    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('RT3PerformanceDetail/GetBetTypePerformance')
    };

    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlLeague: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null
    };

    var parameters = {
        FromDate: null,
        ToDate: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlLeague = domElements.divBetTypePerformanceFilter.find('#ddlLeague');
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

        domElements.ddlLeague.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 100,
            allSelectedText: labels.All
        }).multiselect("checkAll").multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlLeague.next());
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {
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
            //data: JSON.stringify(parameters),
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

        if (data) {
            bodyData = renderBetTypePerformanceGridBody(data);
            footerData = renderBetTypePerformanceGridFooter(data);
        }
        var gridOptions = renderBetTypePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);

        handleBetTypePerformanceGridEvents();
    }

    var renderBetTypePerformanceGridOptions = function () {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: "Group Header 1", Name: "No", MergeColNumber: 2 },
                        { HeaderText: "Header 3", Name: "Number1", MergeRowNumber: 2 },
                        { HeaderText: "Header 4", Name: "Number2", MergeRowNumber: 2 },
                        { HeaderText: "Group Header 2", Name: "Number3", MergeColNumber: 5 },
                        { HeaderText: "Header 10", Name: "Number5", MergeRowNumber: 2 }
                    ]
                }
            ],
            columns: [
                {
                    HeaderText: "Header 1", Width: 70, Name: "No", HeaderAlign: "center", CellAlign: "center", CanResize: true,
                    CalResizeFunction: function (value) {
                        return value.toString().length * 20;
                    }
                },
                { HeaderText: "Header 2", Width: 10, Name: "Text1", HeaderAlign: "center", CellAlign: "right", CanResize: true },
                { HeaderText: "Header 3", Width: 10, Name: "Number1", HeaderAlign: "center", CellAlign: "right", CanResize: true },
                { HeaderText: "Header 4", Width: 70, Name: "Number2", HeaderAlign: "center", CellAlign: "right", CanResize: true, PixelsPerCharacter: 25 },
                { HeaderText: "Header 5", Width: 70, Name: "Number3", HeaderAlign: "center", CellAlign: "right", CanResize: true },
                { HeaderText: "Header 6", Width: 10, Name: "Text2", CanResize: true, PixelsPerCharacter: 7 },
                { HeaderText: "Header 7", Width: 10, Name: "Text3", CanResize: true },
                { HeaderText: "Header 8", Width: 70, Name: "Text4", CanResize: true },
                { HeaderText: "Header 9", Width: 70, Name: "Number4", HeaderAlign: "center", CellAlign: "right", CanResize: true },
                { HeaderText: "Header 10", Width: 10, Name: "Number5", HeaderAlign: "center", CellAlign: "right", CanResize: true }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: labels.RT3PerformanceDetail,
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

    var renderBetTypePerformanceGridBody = function (data) {

    }

    var renderBetTypePerformanceGridFooter = function (data) {

    }

    var handleBetTypePerformanceGridEvents = function () { }

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
}