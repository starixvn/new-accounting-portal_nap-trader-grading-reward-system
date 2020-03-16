$(document).ready(function () {
    var eventPerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance();
    eventPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance');
Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance = function () {
    var $this = this;

    var urls = {
        GetEventPerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetEventPerformance'),
        GetLeaguePerformanceOfEvent: common.ResolveRootUrl('AutomationTradingPerformance/GetLeaguePerformanceOfEvent'),
        ExportEventPerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportEventPerformance'),
        ExportEventLeagueGroupPerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportEventLeagueGroupPerformance')
    };

    var domElements = {
        divEventPerformanceFilter: null,
        btnGenerate: null,
        btnExport: null,
        divEventPerformanceContainer: null,
        divEventPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divSummaryContainer: null
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        Model: null,
        TypeSiteIds: null,
        Measurements: null,
        MeasurementDescs: null,
        MeasurementHides: null
    };

    var summaryPerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.SummaryPerformance();
    summaryPerformance.InitPage();

    var cacheDOMElements = function () {
        domElements.divEventPerformanceFilter = $('#divEventPerformanceFilter');
        domElements.divDateRange = domElements.divEventPerformanceFilter.find('#divDateRange');
        domElements.ddlModel = domElements.divEventPerformanceFilter.find('#ddlModel');
        domElements.ddlSite = domElements.divEventPerformanceFilter.find('#ddlSite');
        domElements.ddlMeasurement = domElements.divEventPerformanceFilter.find('#ddlMeasurement');
        domElements.btnGenerate = domElements.divEventPerformanceFilter.find('#btnGenerate');
        domElements.btnExport = domElements.divEventPerformanceFilter.find('#btnExport');
        domElements.divEventPerformanceContainer = $('#divEventPerformanceContainer');
        domElements.divEventPerformanceGrid = $('#divEventPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
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

        setCacheForFilter(domElements.ddlSite, getStorageFilter("RTBetTypeSelectedSideIds"));

        setCacheForFilter(domElements.ddlMeasurement, getStorageFilter("RTBetTypeSelectedMeasurements"));

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divEventPerformanceFilter, 'w')) {
                domElements.divSummaryContainer.show();

                var selectedSideIds = domElements.ddlSite.val();
                var selectedMeasurements = domElements.ddlMeasurement.val();
                var selectedMeasurementDescs = [];
                domElements.ddlMeasurement.find('option:selected').each(function () { selectedMeasurementDescs.push($(this).text()); })

                setStorageFilter("RTBetTypeSelectedSideIds", selectedSideIds);
                setStorageFilter("RTBetTypeSelectedMeasurements", selectedMeasurements);

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Model = domElements.ddlModel.val()
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

                domElements.divEventPerformanceContainer.addClass('display-none');

                getEventPerformanceReport();
            }
        });

        domElements.btnExport.click(function () {
            common.DownloadFile(urls.ExportEventPerformance, parameters);
        })
    }

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

    var getEventPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetEventPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                generateEventPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        })
    }

    var generateEventPerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = generateEventPerformanceGridBody(data);
            footerData = generateEventPerformanceGridFooter(data);
        }
        var gridOptions = generateEventPerformanceGridOptions(data);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data) }];
        gridOptions.columns = generateColumns(data);

        domElements.divEventPerformanceGrid.fanexGrid(gridOptions);

        handleEventPerformanceGridEvents();

        summaryPerformance.BindData(data.Summary, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);        
    }

    var generateEventPerformanceGridOptions = function () {
        return {
            customizeHeader: true,
            showFooter: true,
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportEventPerformance();
                }
            },
            showNumberColumn: false,
            showFooter: true
        };
    }

    var generateColumnGroupHeaders = function (data) {
        var groupHeaderColumns = [
            { HeaderText: labels.Event, Name: "ColEventName", MergeRowNumber: 2 },
            { HeaderText: labels.League, Name: "ColLeagueCount", MergeRowNumber: 2 },
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
        if (data.GrandTotal.RobotTradingItemList != null && data.LeagueCount > 0) {
            var columns = [
                { HeaderText: labels.BetType, Width: 120, Name: "ColEventName", HeaderAlign: "center", CellAlign: "left", Sort: true },
                { HeaderText: labels.League, Width: 120, Name: "ColLeagueCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
                { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
            ];

            var cssClass = 'dim';
            var groupHeaderNameOld = '';

            $.each(data.GrandTotal.RobotTradingItemList, function (index, robotTradingItem) {

                if (groupHeaderNameOld != robotTradingItem.GroupHeaderName) {
                    cssClass = cssClass == 'dim' ? '' : 'dim';
                }

                if (!robotTradingItem.IsHideTurnover) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' T/O', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Turnover', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, ThClass: cssClass });
                    groupHeaderNameOld = robotTradingItem.GroupHeaderName;
                }

                if (!robotTradingItem.IsHideWinLoss) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' W/L', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'WinLoss', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                    groupHeaderNameOld = robotTradingItem.GroupHeaderName;
                }

                if (!robotTradingItem.IsHideMargin) {
                    columns.push({ HeaderText: robotTradingItem.TypeSiteDesc + ' MAR %', Width: 120, Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Margin', HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', ThClass: cssClass });
                    groupHeaderNameOld = robotTradingItem.GroupHeaderName;
                }
            })

            return columns;

        } else {
            return generateColumnsDefault();
        }
    }

    var generateColumnsDefault = function () {
        var columns = [
            { HeaderText: labels.BetType, Width: 120, Name: "ColEventName", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.League, Width: 120, Name: "ColLeagueCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
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

    var generateEventPerformanceGridBody = function (data) {
        var leagueFormat = '<span class="league-link link" title="{0}" data-league-group-id="{1}">{2}</span>';
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {
            var leagueCountCol = leagueFormat.format(labels.LeaguePerformance, 1, item.LeagueCount);

            var currentRowData = [
                { Name: 'ColEventName', Value: item.AutoTradingName, CssClass: 'bold' },
                { Name: 'ColLeagueCount', Value: leagueCountCol },
                { Name: 'ColMatchCount', Value: item.MatchCount },
                { Name: 'ColBetCount', Value: item.BetCount }
            ];

            $.each(item.RobotTradingItemList, function (indexRobotTradingItem, robotTradingItem) {

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

    var generateEventPerformanceGridFooter = function (data) {
        var footerData = [
            { Name: 'ColEventName', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColLeagueCount', Value: data.GrandTotal.LeagueCount },
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

    var exportEventPerformance = function () {
        common.DownloadFile(urls.ExportEventLeagueGroupPerformance, parameters);
    }

    var handleEventPerformanceGridEvents = function () {
        domElements.divEventPerformanceContainer.find('.league-link').click(function () {
            var link = $(this);
            var leagueGroupId = link.attr('data-league-group-id');

            getLeaguePerformanceReport(leagueGroupId);
        })
    }

    var getLeaguePerformanceReport = function (leagueGroupId) {
        var leagueParameters = {
            LeagueGroupId: leagueGroupId
        }

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfEvent,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                generateLeagueGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateLeagueGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && data.ItemList.length > 0) {
            bodyData = generateEventPerformanceGridBody(data);
            footerData = generateEventPerformanceGridFooter(data);
        }

        var gridOptions = generateEventPerformanceGridOptions(data);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data) }];
        gridOptions.columns = generateColumns(data);

        // Hide previous report.
        domElements.divEventPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
    }   

    var generateLeagueGridBody = function () {

    }

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
}