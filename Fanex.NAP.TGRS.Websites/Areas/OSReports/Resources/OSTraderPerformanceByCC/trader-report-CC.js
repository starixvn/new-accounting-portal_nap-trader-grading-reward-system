/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(function () {
    traderCCReports.Initialize();
});

var traderCCReports = (function ($) {
    var traderCCReports = {};

    var domElements = {
        divFilter: null,
        divDateRange: null,
        btnSearch: null,
        txtTraderName: null,
        ddlSport: null,
        ddlCustomerClass: null,
        ddlPeriodType: null,
        hdFullClassList: null,
        divTraderPerformanceCCContainer: null,
        divTraderPerformanceCCGrid: null,
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divFilter = $('#divReportFilterForm');
        domElements.ddlCustomerClass = domElements.divFilter.find('#ddlCustomerClass');   
        domElements.ddlSport = domElements.divFilter.find('#ddlSport');  
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.txtTraderName = $('#txtTraderName');
        domElements.hdClassList = $('#hdClassList'),
        domElements.divTraderPerformanceCCContainer = $('#divTraderPerformanceCCContainer');
        domElements.divTraderPerformanceCCGrid = $('#divTraderPerformanceCCGrid');
    };

    traderCCReports.Initialize = function () {  
        cacheDOMElements();
        loadFilter()
        registerEvent();
    };

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });
    };

    var loadFilter = function () {
        domElements.ddlSport.multiselect({
            selectedList: 1,
            minWidth: 280,
            height: 150,
            multiple: false
        }).multiselectfilter({ width: 160 });

        domElements.ddlCustomerClass.multiselect({
            menuWidth: 240,
            menuHeight: 260,
            selectedText: "# of # selected",
            noneSelectedText: "Select options",
            enableClickableOptGroups: true,
            includeSelectAllOption: true,
            groupsCollapsable: true,
            optGroupChecked: true
        }).multiselectfilter({
            width: 190,
            placeholder: '',
            label: '',
            selectAll: true
        }).change(function () {
            validator.ClearError(domElements.ddlCustomerClass.next());
        });

        initDatePicker();

        domElements.ddlPeriodType = $('#ddlPeriodType');
        //Date picker
        domElements.ddlPeriodType.val(1);
    }

    var registerEvent = function () {
        domElements.btnSearch.click(function () {
            if (validateCustomerClass()) {
                var criteria = {
                    TraderName: domElements.txtTraderName.val().trim(),
                    Fromdate: domElements.divDateRange.getFrom(),
                    ToDate: domElements.divDateRange.getTo(),
                    SportId: domElements.ddlSport.val(),
                    CustomerClassIds: domElements.ddlCustomerClass.val().toString(),
                    AllCustomerClassIds: domElements.hdClassList.val()
                };

                common.DisableInput();
                TraderReportCCService.GetTraderPerformanceCC(criteria, function (data) {
                    cachedData = data;
                    showTraderPerformanceReport();
                    renderTraderGrid(data);
                    domElements.divTraderPerformanceCCContainer.find('#btnExportdivTraderPerformanceCCGrid').click(function () { exportExcel() });
                });
            }
        });        
    };

    var validateCustomerClass = function () {
        var selectedClass = domElements.ddlCustomerClass.val();

        if (!selectedClass) {
            validator.ShowError(domElements.ddlCustomerClass.next(), "Required field!", 'w');

            return false;
        }

        return true;
    };

    function customSort(val1, val2, direction) {
        var parsedCol1Value = val1.toString().toLowerCase();
        var parsedCol2Value = val2.toString().toLowerCase();

        if (direction === 'asc') {
            return parsedCol1Value > parsedCol2Value ? 1 : -1;
        }
        else {
            return parsedCol1Value < parsedCol2Value ? 1 : -1;
        }
    }

    function renderTraderGrid(data, traderName) {
        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colClass', Value: item.CustomerClass },
                    { Name: 'colRealMargin', Value: item.MarginReal },
                    { Name: 'colRealTurnover', Value: item.TurnoverReal },
                    { Name: 'colRealWinloss', Value: item.WinLossReal },
                    { Name: 'colVirtualMargin', Value: item.Margin },
                    { Name: 'colVirtualTurnover', Value: item.Turnover },
                    { Name: 'colVirtualWinloss', Value: item.WinLoss },
                    { Name: 'colBetCount', Value: item.BetCount }
                ]
            }
        }

        var options = {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: "#", Name: 'colNum', MergeRowNumber: 2 },
                        { HeaderText: "Trader", Name: 'colTraderName', MergeRowNumber: 2 },                     
                        { HeaderText: "Customer Class", Name:'colClass', MergeRowNumber: 2 },                     
                        { HeaderText: "Real", Name: "colRealMargin", MergeColNumber: 3 },
                        { HeaderText: "Virtual", Name: "colVirtualMargin", MergeColNumber: 3 },
                        { HeaderText: "Bet Count", Name: 'colBetCount', MergeRowNumber: 2 }
                    ]
                }
            ],
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Customer Class', Width: 120, Name: 'colClass', HeaderAlign: 'center', CellAlign: 'left', Sort: true},
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'Margin', Width: 100, Name: 'colRealMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Turnover', Width: 100, Name: 'colRealTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Winloss', Width: 100, Name: 'colRealWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Margin', Width: 100, Name: 'colVirtualMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Turnover', Width: 100, Name: 'colVirtualTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Winloss', Width: 100, Name: 'colVirtualWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Bet Count', Width: 100, Name: 'colBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat, Sort: true }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 220,
            showTitle: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            },
            titleInfo:
            {
                showExcelButton: true
                //exportExcelFunction: exportExcel()
            },
        };

        domElements.divTraderPerformanceCCGrid.fanexGrid(options);
        domElements.divTraderPerformanceCCGrid.find('#divTraderPerformanceCCGrid_header_sort_colTraderName').find('.divSorter').addClass('asc');
        domElements.divTraderPerformanceCCGrid.find('#divTraderPerformanceCCGrid_header_sort_colClass').find('.divSorter').addClass('asc');
    }

    function showTraderPerformanceReport() {
        showHideReport("#divTraderPerformanceCCContainer");
    };

    function showHideReport(report) {
        var container =
            [
                "#divTraderPerformanceCCContainer"
            ];

        var $container = container.map(a => $(a));

        $container.filter($a => !$a.is(report)).forEach($c => $c.addClass("display-none"));

        $container.find($a => $a.is(report)).removeClass("display-none");
    }

    var exportExcel = function () {
        var url = common.ResolveRootUrl("OSReports/OSTraderPerformanceByCC/ExportExcel");
        
        var parameters = {
            TraderName: domElements.txtTraderName.val().trim(),
            Fromdate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
            SportId: domElements.ddlSport.val(),
            SportName: domElements.ddlSport.find('option:selected').text(),
            CustomerClassIds: domElements.ddlCustomerClass.val().toString(),
            AllCustomerClassIds: domElements.hdClassList.val(),
        };

        common.DownloadFile(url, parameters);
    };


    return traderCCReports;

})(jQuery);