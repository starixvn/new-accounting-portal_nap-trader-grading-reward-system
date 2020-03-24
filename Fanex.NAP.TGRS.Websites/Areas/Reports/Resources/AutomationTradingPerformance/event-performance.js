$(document).ready(function () {
    var eventPerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance();
    eventPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance');
Fanex.NAP.TGRS.AutomationTradingPerformance.EventPerformance = function () {
    var $this = this;

    var urls = {
        GetEventPerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetEventPerformance'),
        ExportEventPerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportEventPerformance'),
        GetLeaguePerformanceOfEvent: common.ResolveRootUrl('AutomationTradingPerformance/GetLeaguePerformanceOfEvent'),        
        ExportLeaguePerformanceOfEvent: common.ResolveRootUrl('AutomationTradingPerformance/ExportLeaguePerformanceOfEvent'),
        ExportEventLeaguePerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportEventLeaguePerformance'),
        GetMatchPerformanceOfEventLeague: common.ResolveRootUrl('AutomationTradingPerformance/GetMatchPerformanceOfEventLeague'),
        ExportMatchPerformanceOfEventLeague: common.ResolveRootUrl('AutomationTradingPerformance/ExportMatchPerformanceOfEventLeague')        
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
    var leagueParameters = {};
    var matchParameters = {};

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

                getParammeters();

                domElements.divEventPerformanceContainer.addClass('display-none');               

                hideAllReports();
                getEventPerformanceReport();
            }
        });

        domElements.btnExport.click(function () {
            getParammeters();
            common.DownloadFile(urls.ExportEventLeaguePerformance, parameters);
        })
    }

    var getParammeters = function () {
        if (validator.ValidateForm(domElements.divEventPerformanceFilter, 'w')) {           
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
        }
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

    var hideAllReports = function () {
        domElements.divEventPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');        
    };

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
        var groupHeaderColumns = [
            { HeaderText: labels.Event, Name: "ColEventName", MergeRowNumber: 2 },
            { HeaderText: labels.League, Name: "ColLeagueCount", MergeRowNumber: 2 },
            { HeaderText: labels.Match, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.Event, Width: 120, Name: "ColEventName", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.League, Width: 120, Name: "ColLeagueCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColEventName', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColLeagueCount', Value: data.GrandTotal.LeagueCount },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateEventPerformanceGridBody(data);
            footerData = generateEventPerformanceGridFooter(data, footerColumns);
        }

        var gridOptions = generateEventPerformanceGridOptions(data);
        gridOptions.titleInfo = {
            showExcelButton: true,
            exportExcelFunction: function () {
                common.DownloadFile(urls.ExportEventPerformance, parameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

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
            showNumberColumn: false,
        };
    }

    var generateColumnGroupHeaders = function (data, groupHeaderColumns) {      
        var cssClass = '';

        $.each(data.GroupHeaderList, function (index, group) {
            cssClass = index % 2 == 0 ? '' : 'dim';

            groupHeaderColumns.push({ HeaderText: group.HeaderText, HeaderAlign: "center", Name: group.ColumnName, MergeColNumber: group.MergeColumnNumber, ThClass: cssClass });
        })

        return groupHeaderColumns;
    }

    var generateColumns = function (data, columns) {
        if (data.GrandTotal.RobotTradingItemList != null && data.LeagueCount > 0) {           
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
            return generateColumnsDefault(columns);
        }
    }

    var generateColumnsDefault = function (columns) {
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
        var leagueFormat = '<span class="league-link link" title="{0}" data-league-ids="{1}" data-league-group-name="{2}">{3}</span>';
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {
            var leagueCountCol = leagueFormat.format(labels.LeaguePerformance, item.LeagueIdList, item.AutoTradingName, item.LeagueCount);

            var currentRowData = [
                { Name: 'ColEventName', Value: item.AutoTradingName, CssClass: 'bold' },
                { Name: 'ColLeagueCount', Value: leagueCountCol },
                { Name: 'ColMatchCount', Value: item.MatchCount },
                { Name: 'ColBetCount', Value: item.BetCount }
            ];
            
            row = {
                Columns: generateRobotTradingItemList(item.RobotTradingItemList, currentRowData)
            };

            bodyData.push(row);
        })

        return bodyData;
    }

    var generateRobotTradingItemList = function (robotTradingItemList, columns) {
        $.each(robotTradingItemList, function (indexRobotTradingItem, robotTradingItem) {

            if (!robotTradingItem.IsHideTurnover) {
                columns.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Turnover', Value: robotTradingItem.Turnover });
            }
            if (!robotTradingItem.IsHideWinLoss) {
                columns.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'WinLoss', Value: robotTradingItem.WinLoss });
            }
            if (!robotTradingItem.IsHideMargin) {
                columns.push({ Name: 'Col' + robotTradingItem.GroupHeaderName + robotTradingItem.TypeSiteDesc + 'Margin', Value: common.GetNumWithLabel(robotTradingItem.Margin, labels.NA), CssClass: 'bold' });
            }
        })

        return columns;
    }

    var generateEventPerformanceGridFooter = function (data, columns) {        
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }   

    var handleEventPerformanceGridEvents = function () {
        domElements.divEventPerformanceContainer.find('.league-link').click(function () {
            var link = $(this);
            var leagueIdList = link.attr('data-league-ids');
            var leagueGroupName = link.attr('data-league-group-name');

            getLeaguePerformanceOfEventReport(leagueIdList, leagueGroupName);
        })
    }

    var getLeaguePerformanceOfEventReport = function (leagueIdList, leagueGroupName) {
        leagueParameters = {
            LeagueIdList: leagueIdList,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Model: parameters.Model,
            TypeSiteIds: parameters.TypeSiteIds,
            Measurements: parameters.Measurements,
            MeasurementHides: parameters.MeasurementHides,
            MeasurementDescs: parameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfEvent,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParameters),
            success: function (result) {
                generateLeagueOfEventGrid(result, leagueGroupName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateLeagueOfEventGrid = function (data, leagueGroupName) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.League, Name: "ColLeagueName", MergeRowNumber: 2 },            
            { HeaderText: labels.Match, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.League, Width: 240, Name: "ColLeagueName", HeaderAlign: "center", CellAlign: "left", Sort: true },            
            { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColLeagueName', Value: labels.GrandTotal, CellAlign: 'right' },            
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateLeagueOfEventGridBody(data);
            footerData = generateLeagueOfEventGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanEventLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var gridOptions = generateEventPerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.Event, leagueGroupName),
            showExcelButton: true,
            exportExcelFunction: function () {
                leagueParameters.LeagueIdList = '';
                leagueParameters.CacheKey = leagueGroupName;
                common.DownloadFile(urls.ExportLeaguePerformanceOfEvent, leagueParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        // Hide previous report.
        domElements.divEventPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeaguePerformanceOfEventGridEvents(leagueGroupName);
    }

    var generateLeagueOfEventGridBody = function (data) {
        var matchCountFormat = '<span class="match-link link" title="{0}" data-match-ids="{1}" data-league-name="{2}">{3}</span>';
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {
            var matchCountCol = matchCountFormat.format(labels.MatchPerformance, item.MatchIdList, item.AutoTradingName, item.MatchCount);

            var currentRowData = [
                { Name: 'ColLeagueName', Value: item.AutoTradingName, CssClass: 'bold' },
                { Name: 'ColMatchCount', Value: matchCountCol },
                { Name: 'ColBetCount', Value: item.BetCount }
            ];

            row = {
                Columns: generateRobotTradingItemList(item.RobotTradingItemList, currentRowData)
            };

            bodyData.push(row);
        })

        return bodyData;
    }

    var generateLeagueOfEventGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }   

    var handleLeaguePerformanceOfEventGridEvents = function (leagueGroupName) {
        domElements.divLeaguePerformanceContainer.find('#spanEventLink').click(function () {
            showEventPerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('.match-link').click(function () {
            var link = $(this);
            var matchIdList = link.attr('data-match-ids');
            var leagueName = link.attr('data-league-name');

            getMatchPerformanceOfEventLeagueReport(matchIdList, leagueGroupName, leagueName);
        });
    }

    var showEventPerformanceReport = function () {
        domElements.divEventPerformanceContainer.removeClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');     
    };

    var getMatchPerformanceOfEventLeagueReport = function (matchIdList, leagueGroupName, leagueName) {
        matchParameters = {
            MatchIdList: matchIdList,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Model: parameters.Model,
            TypeSiteIds: parameters.TypeSiteIds,
            Measurements: parameters.Measurements,
            MeasurementHides: parameters.MeasurementHides,
            MeasurementDescs: parameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfEventLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParameters),
            success: function (result) {
                generateMatchOfEventLeagueGrid(result, leagueGroupName, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateMatchOfEventLeagueGrid = function (data, leagueGroupName, leagueName) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.EventDate, Name: "ColEventDate", MergeRowNumber: 2 },
            { HeaderText: labels.Match, Name: "ColMatchName", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.EventDate, Width: 120, Name: "ColEventDate", HeaderAlign: "center", CellAlign: "center", Sort: true },
            { HeaderText: labels.Match, Width: 240, Name: "ColMatchName", HeaderAlign: "center", CellAlign: "center", Sort: true },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColEventDate', Value: labels.GrandTotal, CellAlign: 'right', MergeColNumber: 2  },            
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateMatchOfEventLeagueGridBody(data);
            footerData = generateMatchOfEventLeagueGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanEventLink" class="breadcrumb-link">{0}</span><span id="spanLeagueOfEventLink" class="breadcrumb-link"> >> {1}</span><span> >> {2}</span>';
        var gridOptions = generateEventPerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.Event, leagueGroupName, leagueName),
            showExcelButton: true,
            exportExcelFunction: function () {
                matchParameters.MatchIdList = '';
                matchParameters.CacheKey = leagueName;
                common.DownloadFile(urls.ExportMatchPerformanceOfEventLeague, matchParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);
        
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchRerformanceOfEventLeagueGridEvents();
    }

    var generateMatchOfEventLeagueGridBody = function (data) {     
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {           
            var currentRowData = [
                { Name: 'ColEventDate', Value: item.AutoTradingName },
                { Name: 'ColMatchName', Value: item.AutoTradingName2 },
                { Name: 'ColBetCount', Value: item.BetCount }
            ];

            row = {
                Columns: generateRobotTradingItemList(item.RobotTradingItemList, currentRowData)
            };

            bodyData.push(row);
        })

        return bodyData;
    }

    var generateMatchOfEventLeagueGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }

    var handleMatchRerformanceOfEventLeagueGridEvents = function () {
        domElements.divMatchPerformanceContainer.find('#spanEventLink').click(function () {
            showEventPerformanceReport();
        });  

        domElements.divMatchPerformanceContainer.find('#spanLeagueOfEventLink').click(function () {
            showLeaguePerformanceOfEventReport();
        });
    }

    var showLeaguePerformanceOfEventReport = function () {
        domElements.divEventPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    }

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };

}