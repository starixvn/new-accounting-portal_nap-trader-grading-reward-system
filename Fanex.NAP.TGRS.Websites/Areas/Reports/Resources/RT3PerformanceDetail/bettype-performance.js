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
        divSummaryContainer: null
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        Model: null,
        LeagueGroupIds: null,
        TypeSiteIds: null,
        Measurements: null
    };  
   
    var hideColumns = [];

    var summaryPerformance = new Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance();
    summaryPerformance.InitPage();

    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlModel = domElements.divBetTypePerformanceFilter.find('#ddlModel');
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.ddlSite = domElements.divBetTypePerformanceFilter.find('#ddlSite');
        domElements.ddlMeasurement = domElements.divBetTypePerformanceFilter.find('#ddlMeasurement');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
        domElements.divSummaryContainer = $('#divSummaryContainer');
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
        }).multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlLeagueGroup.next());
            });     
                
        setCacheForFilter(domElements.ddlLeagueGroup, getStorageFilter("RTBetTypeSelectedLeagueGroups"));
       
        domElements.ddlSite.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 140,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlSite.next());
            });  
                          
        setCacheForFilter(domElements.ddlSite, getStorageFilter("RTBetTypeSelectedSideIds"));

        domElements.ddlMeasurement.multiselect({
            selectedList: 2,
            minWidth: 190,
            height: 140,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(domElements.ddlMeasurement.next());
            });
        
        setCacheForFilter(domElements.ddlMeasurement, getStorageFilter("RTBetTypeSelectedMeasurements"));

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {
                domElements.divSummaryContainer.show();

                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
                var selectedSideIds = domElements.ddlSite.val();
                var selectedMeasurements = domElements.ddlMeasurement.val()

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Model = domElements.ddlModel.val()
                parameters.LeagueGroupIds = selectedLeagueGroups != null ? selectedLeagueGroups.join(',') : selectedLeagueGroups;
                parameters.TypeSiteIds = selectedSideIds != null ? selectedSideIds.join(',') : "1,2,3";
                parameters.Measurements = selectedMeasurements != null ? selectedMeasurements.join(',') : selectedMeasurements;

                domElements.divBetTypePerformanceContainer.addClass('display-none');

                setStorageFilter("RTBetTypeSelectedLeagueGroups", selectedLeagueGroups);
                setStorageFilter("RTBetTypeSelectedSideIds", selectedSideIds);
                setStorageFilter("RTBetTypeSelectedMeasurements", selectedMeasurements);

                getBetTypePerformanceReport();
            }
        });
    };

    var setCacheForFilter = function (ddlDomElement, cacheItem) {
        if (cacheItem != null) {
            $.each(cacheItem.split(","), function (index, element) {
                $("option[value='" + element + "']", ddlDomElement).prop("selected", true);
            });
            ddlDomElement.multiselect('refresh');
        }
    }

    var setStorageFilter = function (key, value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(key, value);
        }
    }

    var getStorageFilter = function (key) {
        if (typeof (Storage) !== "undefined") {
            var value = localStorage.getItem(key);
            return value;
        }

        return '';
    }

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

        generateHideColumns(data);

        if (data && data.ItemList.length > 0) {
            bodyData = generateBetTypePerformanceGridBody(data);
            footerData = generateBetTypePerformanceGridFooter(data);
        }
        var gridOptions = generateBetTypePerformanceGridOptions(data);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data) }];
        gridOptions.columns = generateColumns(data);

        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);

        summaryPerformance.BindData(data.Summary, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);
    }    

    var generateBetTypePerformanceGridOptions = function (data) {
        var gridOptions = {
            customizeHeader: true,
            showFooter: true,          
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportBetTypePerformance();
                }
            },
            showColumnsShowHide: false,
            autoResizeColumn: true,
            columnsNeedHide: [],
            gridExpandHeight: 230,
            allowTruncate: true,
            defaultCollapseAllGroups: true,
            virtualScroller: true
        };

        return gridOptions;
    }

    var generateColumnGroupHeaders = function (data) {
        var groupHeaderColumns = [
            { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
            { HeaderText: labels.Match, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];

        var cssClass = '';

        $.each(data.GroupHeaderList, function (index, group) {
            cssClass = index % 2 == 0 ? '' : 'dim';

            groupHeaderColumns.push({ HeaderText: group.HeaderText, HeaderAlign: "center", Name: group.ColumnName, MergeColNumber: group.MergeColumnNumber, ThClass: cssClass });
        })
        
        return groupHeaderColumns;
    }

    var generateColumns = function (data) {
        var columns = [
            { HeaderText: labels.BetType, Width: 120, Name: "ColBetType", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];

        var cssClass = data.GroupHeaderList.length % 2 == 0 ? '' : 'dim';
        var groupHeaderNameOld = '';

        $.each(data.GrandTotal.RobotTradingItemList, function (index, robotTradingItem) {

            if (groupHeaderNameOld != robotTradingItem.GroupHeaderName) {
                cssClass = cssClass == 'dim' ? '' : 'dim';
            }

            if (checkExitItem(robotTradingItem, labels.Turnover)) {
                columns.push({ HeaderText: robotTradingItem.TypeSideDesc + ' T/O', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Turnover', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: cssClass });
            }

            if (checkExitItem(robotTradingItem, labels.WinLoss)) {
                columns.push({ HeaderText: robotTradingItem.TypeSideDesc + ' W/L', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'WinLoss', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
            }

            if (checkExitItem(robotTradingItem, labels.Margin)) {
                columns.push({ HeaderText: robotTradingItem.TypeSideDesc + ' MAR', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Margin', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
            }

            groupHeaderNameOld = robotTradingItem.GroupHeaderName;
        })
        
        return columns;
    }

    var generateHideColumns = function (data) {   
        hideColumns = [];
        var measurementNotSelecteds = domElements.ddlMeasurement.find('option').not(':selected');     

        $.each(measurementNotSelecteds, function (index, option) {
            var groupHeaderName = $(option).attr('group-header');          
            var itemName = $(option).attr('item-name');

            hideColumns.push({ GroupHeaderName: groupHeaderName, ItemName: itemName });           
        })
    }

    var generateBetTypePerformanceGridBody = function (data) {
        var bodyData = [];
        var row;       

        $.each(data.ItemList, function (indexItem, betTypeItem) {
            var currentRowData = [
                { Name: 'ColBetType', Value: betTypeItem.BetTypeName, CssClass: 'bold' },
                { Name: 'ColMatchCount', Value: betTypeItem.MatchCount },
                { Name: 'ColBetCount', Value: betTypeItem.BetCount }                
            ];

            $.each(betTypeItem.RobotTradingItemList, function (indexRobotTradingItem, robotTradingItem) {

                if (hideColumns.findIndex(x => x.GroupHeaderName == robotTradingItem.GroupHeaderName && x.ItemName == labels.Turnover) < 0) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Turnover', Value: robotTradingItem.Turnover });
                }
                if (hideColumns.findIndex(x => x.GroupHeaderName == robotTradingItem.GroupHeaderName && x.ItemName == labels.WinLoss) < 0) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'WinLoss', Value: robotTradingItem.WinLoss });
                }
                if (hideColumns.findIndex(x => x.GroupHeaderName == robotTradingItem.GroupHeaderName && x.ItemName == labels.Margin) < 0) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Margin', Value: common.GetNumWithLabel(robotTradingItem.Margin, labels.NA), CssClass: 'bold' });
                }
            })

            row = {
                Columns: currentRowData
            };

            bodyData.push(row);
        })

        return bodyData;
    }

    var generateBetTypePerformanceGridFooter = function (data) {
        var footerData = [
            { Name: 'ColBetType', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];
       
        $.each(data.GrandTotal.RobotTradingItemList, function (index, robotTradingItem) {

            if (checkExitItem(robotTradingItem, labels.Turnover)) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Turnover', Value: robotTradingItem.Turnover });
            }   
            if (checkExitItem(robotTradingItem, labels.WinLoss)) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'WinLoss', Value: robotTradingItem.WinLoss });
            }
            if (checkExitItem(robotTradingItem, labels.Margin)) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc + 'Margin', Value: common.GetNumWithLabel(robotTradingItem.Margin, labels.NA), CssClass: 'bold' });
            }            
        })
        
        return [{
            Columns: footerData
        }];
    } 

    var checkExitItem = function (item, itemName) {
        return hideColumns.findIndex(x => x.GroupHeaderName == item.GroupHeaderName && x.ItemName == itemName) < 0;
    }

    var exportBetTypePerformance = function () {
        common.DownloadFile(urls.ExportBetTypePerformance, parameters);
    }

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
}