$(document).ready(function () {
    var monthPerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.MonthPerformance();

    monthPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.AutomationTradingPerformance.MonthPerformance');
Fanex.NAP.TGRS.AutomationTradingPerformance.MonthPerformance = function () {
    var $this = this;

    var urls = {
        GetMonthPerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetMonthPerformance'),
        ExportMonthPerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportMonthPerformance')
    };

    var domElements = {
        divMonthPerformanceFilter: null,
        ddlPeriodType: null,
        ddlLeagueGroup: null,
        btnGenerate: null,
        divMonthPerformanceContainer: null,
        divMonthPerformanceGrid: null,
        divSummaryContainer: null
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        Model: null,
        LeagueGroupIds: null,
        TypeSiteIds: null,
        Measurements: null,
        MeasurementDescs: null,
        MeasurementHides: null
    };

    var summaryPerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.SummaryPerformance();
    summaryPerformance.InitPage();

    var cacheDOMElements = function () {
        domElements.divMonthPerformanceFilter = $('#divMonthPerformanceFilter');
        domElements.divDateRange = domElements.divMonthPerformanceFilter.find('#divDateRange');
        domElements.ddlModel = domElements.divMonthPerformanceFilter.find('#ddlModel');
        domElements.ddlLeagueGroup = domElements.divMonthPerformanceFilter.find('#ddlLeagueGroup');
        domElements.ddlSite = domElements.divMonthPerformanceFilter.find('#ddlSite');
        domElements.ddlMeasurement = domElements.divMonthPerformanceFilter.find('#ddlMeasurement');
        domElements.btnGenerate = domElements.divMonthPerformanceFilter.find('#btnGenerate');
        domElements.divMonthPerformanceContainer = $('#divMonthPerformanceContainer');
        domElements.divMonthPerformanceGrid = $('#divMonthPerformanceGrid');  
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

        domElements.ddlPeriodType = domElements.divDateRange.find('#ddlPeriodType');
        domElements.divDateRange.find("span:contains('Date')").text('Month');
        domElements.ddlPeriodType.val(2).change();

        setCacheForFilter(domElements.ddlLeagueGroup, getStorageFilter("RTMonthlySelectedLeagueGroups"));

        setCacheForFilter(domElements.ddlSite, getStorageFilter("RTMonthlySelectedSideIds"));

        setCacheForFilter(domElements.ddlMeasurement, getStorageFilter("RTMonthlySelectedMeasurements"));

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divMonthPerformanceFilter, 'w')) {
                domElements.divSummaryContainer.show();
                
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
                var selectedSideIds = domElements.ddlSite.val();
                var selectedMeasurements = domElements.ddlMeasurement.val();
                var selectedMeasurementDescs = [];
                domElements.ddlMeasurement.find('option:selected').each(function () { selectedMeasurementDescs.push($(this).text()); })

                setStorageFilter("RTMonthlySelectedLeagueGroups", selectedLeagueGroups);
                setStorageFilter("RTMonthlySelectedSideIds", selectedSideIds);
                setStorageFilter("RTMonthlySelectedMeasurements", selectedMeasurements);

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Model = domElements.ddlModel.val()
                parameters.LeagueGroupIds = selectedLeagueGroups != null ? selectedLeagueGroups.join(',') : selectedLeagueGroups;
                parameters.TypeSiteIds = selectedSideIds != null ? selectedSideIds.join(',') : "3,2,1";

                var notSelectMeasurements = [];
                domElements.ddlMeasurement.find('option').not(':selected').each(function () { notSelectMeasurements.push($(this).val()); })
                
                if (selectedMeasurements != null) {
                    parameters.Measurements = selectedMeasurements.join(',');
                    parameters.MeasurementHides = notSelectMeasurements != null ? notSelectMeasurements.join(',') : null;
                }
                else {
                    parameters.Measurements = notSelectMeasurements.join(',');
                    parameters.MeasurementHides = null;
                }
                parameters.MeasurementDescs = notSelectMeasurements.length > 0 && selectedMeasurementDescs.length > 0 ? selectedMeasurementDescs.join(',') : labels.All;

                getMonthPerformanceReport();
            }
        });
    };  

    var setCacheForFilter = function (ddlDomElement, cacheItem) {
        ddlDomElement.multiselect({
            selectedList: 1,
            minWidth: 190,
            height: 140,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 120 }).change(function () {
            validator.ClearError(ddlDomElement.next());
        });

        if (cacheItem != null) {
            $.each(cacheItem.split(","), function (index, element) {
                $("option[value='" + element + "']", ddlDomElement).prop("selected", true);
            });

            ddlDomElement.multiselect('refresh');
        } else {
            ddlDomElement.multiselect('checkAll');
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
            bodyData = generateMonthPerformanceGridBody(data);
            footerData = generateMonthPerformanceGridFooter(data);
        }
        var gridOptions = generateMonthPerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data) }];
        gridOptions.columns = generateColumns(data);

        domElements.divMonthPerformanceGrid.fanexGrid(gridOptions);

        summaryPerformance.BindData(data.Summary, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);      
    }   

    var generateHideColumns = function () {
        hideColumns = [];

        var selectedOptionMeasurements = domElements.ddlMeasurement.find('option:selected');

        if (selectedOptionMeasurements.length == 0) {
            return hideColumns;
        }

        var measurementNotSelecteds = domElements.ddlMeasurement.find('option').not(':selected');

        $.each(measurementNotSelecteds, function (index, option) {
            var arrValue = $(option).val().split('-');
            var groupHeaderName = arrValue[0];
            var measurement = arrValue[1];

            hideColumns.push({ GroupHeaderName: groupHeaderName, Measurement: measurement });
        })

        return hideColumns;
    }

    var generateMonthPerformanceGridOptions = function () {
        return {
            customizeHeader: true,
            showFooter: true,
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportMonthPerformance();
                }
            },
            showColumnsShowHide: false,
            autoResizeColumn: false,
            gridExpandHeight: 230,
            allowTruncate: true,
            defaultCollapseAllGroups: true,
            virtualScroller: true
        };
    }

    var generateColumnGroupHeaders = function (data) {
        var groupHeaderColumns = [
            { HeaderText: labels.Monthly, Name: "ColMonthly", MergeRowNumber: 2 },
            { HeaderText: labels.MatchCount, Name: "ColMatchCount", MergeRowNumber: 2 },
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
        if (data.GrandTotal.RobotTradingItemList != null && data.LeagueCount > 0) {
            var columns = [
                { HeaderText: labels.Monthly, Width: 120, Name: "ColMonthly", HeaderAlign: "center", CellAlign: "left", Sort: true },
                { HeaderText: labels.MatchCount, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
            ];

            var cssClass = data.GroupHeaderList.length % 2 == 0 ? '' : 'dim';
            var groupHeaderNameOld = '';

            $.each(data.GrandTotal.RobotTradingItemList, function (index, robotTradingItem) {

                if (groupHeaderNameOld != robotTradingItem.GroupHeaderName) {
                    cssClass = cssClass == 'dim' ? '' : 'dim';
                }

                if (!robotTradingItem.IsHideTurnover) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' T/O', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Turnover', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: cssClass });
                }

                if (!robotTradingItem.IsHideWinLoss) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' W/L', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'WinLoss', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                }

                if (!robotTradingItem.IsHideMargin) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' MAR %', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Margin', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                }

                groupHeaderNameOld = robotTradingItem.GroupHeaderName;
            })

            return columns;

        } else {
            return generateColumnsDefault();
        }
    }    

    var generateColumnsDefault = function () {
        var columns = [
            { HeaderText: labels.Monthly, Width: 120, Name: "ColMonthly", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.MatchCount, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];

        var selectedSites = domElements.ddlSite.find('option:selected');
        var selectedMeasurements = domElements.ddlMeasurement.val();
        var selectedOptionMeasurements = domElements.ddlMeasurement.find('option:selected');

        if (selectedSites.length == 0) {
            selectedSites = domElements.ddlSite.find('option').not(':selected');
        }

        if (selectedOptionMeasurements.length == 0) {
            selectedMeasurements = [];
            selectedOptionMeasurements = domElements.ddlMeasurement.find('option').not(':selected');
            selectedOptionMeasurements.each(function () { selectedMeasurements.push($(this).val()); })
        }
        var groupOld = '';
        var groups = [];

        $.each(selectedOptionMeasurements, function (index, group) {
            var groupHeader = $(group).attr('group-header');

            if (groupOld != groupHeader) {
                groups.push(groupHeader);
            }
            groupOld = groupHeader;
        })

        var cssClass = '';

        $.each(groups, function (indexGroup, group) {
            var colTurnover = group + '-' + 'Turnover';
            var colWinLoss = group + '-' + 'WinLoss';
            var colMargin = group + '-' + 'Margin';

            $.each(selectedSites, function (indexSite, site) {
                var siteName = $(site).text();

                if (selectedMeasurements.findIndex(x => x == colTurnover) >= 0) {
                    columns.push({ HeaderText: siteName + ' T/O', Width: 120, Name: 'Col' + group + siteName + 'Turnover', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: cssClass });
                }
                if (selectedMeasurements.findIndex(x => x == colWinLoss) >= 0) {
                    columns.push({ HeaderText: siteName + ' W/L', Width: 120, Name: 'Col' + group + siteName + 'WinLoss', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                }
                if (selectedMeasurements.findIndex(x => x == colMargin) >= 0) {
                    columns.push({ HeaderText: siteName + ' MAR %', Width: 120, Name: 'Col' + group + siteName + 'Margin', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                }
            })

            if (selectedMeasurements.findIndex(x => x == colTurnover) >= 0) {
                columns.push({ HeaderText: 'T/O', Width: 120, Name: 'Col' + group + 'Turnover', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: cssClass });
            }
            if (selectedMeasurements.findIndex(x => x == colWinLoss) >= 0) {
                columns.push({ HeaderText: 'W/L', Width: 120, Name: 'Col' + group + 'WinLoss', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
            }
            if (selectedMeasurements.findIndex(x => x == colMargin) >= 0) {
                columns.push({ HeaderText: 'MAR %', Width: 120, Name: 'Col' + group + 'Margin', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
            }

            cssClass = cssClass == 'dim' ? '' : 'dim';
        })

        return columns;
    } 

    var generateMonthPerformanceGridBody = function (data) {
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, monthlyItem) {
            var currentRowData = [
                { Name: 'ColMonthly', Value: monthlyItem.Monthly, CssClass: 'bold' },
                { Name: 'ColMatchCount', Value: monthlyItem.MatchCount },
                { Name: 'ColBetCount', Value: monthlyItem.BetCount }
            ];

            $.each(monthlyItem.RobotTradingItemList, function (indexRobotTradingItem, robotTradingItem) {

                if (!robotTradingItem.IsHideTurnover) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Turnover', Value: robotTradingItem.Turnover });
                }
                if (!robotTradingItem.IsHideWinLoss) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'WinLoss', Value: robotTradingItem.WinLoss });
                }
                if (!robotTradingItem.IsHideMargin) {
                    currentRowData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Margin', Value: common.GetNumWithLabel(robotTradingItem.Margin, labels.NA), CssClass: 'bold' });
                }
            })

            row = {
                Columns: currentRowData
            };

            bodyData.push(row);
        })

        return bodyData;
    }

    var generateMonthPerformanceGridFooter = function (data) {
        var footerData = [
            { Name: 'ColMonthly', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        $.each(data.GrandTotal.RobotTradingItemList, function (index, robotTradingItem) {

            if (!robotTradingItem.IsHideTurnover) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Turnover', Value: robotTradingItem.Turnover });
            }
            if (!robotTradingItem.IsHideWinLoss) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'WinLoss', Value: robotTradingItem.WinLoss });
            }
            if (!robotTradingItem.IsHideMargin) {
                footerData.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Margin', Value: common.GetNumWithLabel(robotTradingItem.Margin, labels.NA), CssClass: 'bold' });
            }
        })

        return [{
            Columns: footerData
        }];
    }

    var exportMonthPerformance = function () {
        common.DownloadFile(urls.ExportMonthPerformance, parameters);
    }    
 
    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
}