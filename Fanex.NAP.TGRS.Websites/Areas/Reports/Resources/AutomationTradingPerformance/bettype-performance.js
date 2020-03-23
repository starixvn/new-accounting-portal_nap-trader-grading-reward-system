$(document).ready(function () {   
    var betTypePerformance = new Fanex.NAP.TGRS.AutomationTradingPerformance.BetTypePerformance();
    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.AutomationTradingPerformance.BetTypePerformance');
Fanex.NAP.TGRS.AutomationTradingPerformance.BetTypePerformance = function () {
    var $this = this;

    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetBetTypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportBetTypePerformance'),
        GetLeaguePerformanceOfBetType: common.ResolveRootUrl('AutomationTradingPerformance/GetLeaguePerformanceOfBetType'),
        ExportLeaguePerformanceOfBetType: common.ResolveRootUrl('AutomationTradingPerformance/ExportLeaguePerformanceOfBetType'),
        GetMatchPerformanceOfBetTypeLeague: common.ResolveRootUrl('AutomationTradingPerformance/GetMatchPerformanceOfBetTypeLeague'),
        ExportMatchPerformanceOfBetTypeLeague: common.ResolveRootUrl('AutomationTradingPerformance/ExportMatchPerformanceOfBetTypeLeague')
    };

    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlLeagueGroup: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null,
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
        LeagueGroupIds: null,
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
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlModel = domElements.divBetTypePerformanceFilter.find('#ddlModel');
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.ddlSite = domElements.divBetTypePerformanceFilter.find('#ddlSite');
        domElements.ddlMeasurement = domElements.divBetTypePerformanceFilter.find('#ddlMeasurement');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
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

        setCacheForFilter(domElements.ddlLeagueGroup, getStorageFilter("RTBetTypeSelectedLeagueGroups"));

        setCacheForFilter(domElements.ddlSite, getStorageFilter("RTBetTypeSelectedSideIds"));

        setCacheForFilter(domElements.ddlMeasurement, getStorageFilter("RTBetTypeSelectedMeasurements"));

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w')) {                
                var selectedLeagueGroups = domElements.ddlLeagueGroup.val();
                var selectedSideIds = domElements.ddlSite.val();
                var selectedMeasurements = domElements.ddlMeasurement.val();
                var selectedMeasurementDescs = [];
                domElements.ddlMeasurement.find('option:selected').each(function () { selectedMeasurementDescs.push($(this).text()); })

                setStorageFilter("RTBetTypeSelectedLeagueGroups", selectedLeagueGroups);
                setStorageFilter("RTBetTypeSelectedSideIds", selectedSideIds);
                setStorageFilter("RTBetTypeSelectedMeasurements", selectedMeasurements);

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

                domElements.divBetTypePerformanceContainer.addClass('display-none');

                hideAllReports();

                getBetTypePerformanceReport();

                domElements.divSummaryContainer.removeClass('display-none');
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

    var hideAllReports = function () {
        domElements.divSummaryContainer.addClass('display-none');
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
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
                generateBetTypePerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateBetTypePerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
            { HeaderText: labels.League, Name: "ColLeagueCount", MergeRowNumber: 2 },
            { HeaderText: labels.Match, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.BetType, Width: 120, Name: "ColBetType", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.League, Width: 120, Name: "ColLeagueCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.Match, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColBetType', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColLeagueCount', Value: data.GrandTotal.LeagueCount },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateBetTypePerformanceGridBody(data);
            footerData = generateBetTypePerformanceGridFooter(data, footerColumns);
        }

        var gridOptions = generateBetTypePerformanceGridOptions(data);
        gridOptions.titleInfo = {
            showExcelButton: true,
            exportExcelFunction: function () {
                common.DownloadFile(urls.ExportBetTypePerformance, parameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        domElements.divBetTypePerformanceGrid.fanexGrid(gridOptions);

        handleBetTypePerformanceGridEvents();

        summaryPerformance.BindData(data.Summary, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);
    }

    var generateBetTypePerformanceGridOptions = function () {
        return {
            customizeHeader: true,
            showFooter: true,
            showDistinctRow: true,
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

    var generateBetTypePerformanceGridBody = function (data) {
        var leagueFormat = '<span class="league-link link" title="{0}" data-league-ids="{1}" data-bettype-id="{2}" data-bettype-name="{3}">{4}</span>';
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {
            var leagueCountCol = leagueFormat.format(labels.LeaguePerformance, item.LeagueIdList, item.AutoTradingName2, item.AutoTradingName, item.LeagueCount);
            var currentRowData = [
                { Name: 'ColBetType', Value: item.AutoTradingName, CssClass: 'bold' },
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

    var generateBetTypePerformanceGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }

    var handleBetTypePerformanceGridEvents = function () {
        domElements.divBetTypePerformanceContainer.find('.league-link').click(function () {
            var link = $(this);
            var leagueIdList = link.attr('data-league-ids');
            var betTypeId = link.attr('data-bettype-id');
            var betTypeName = link.attr('data-bettype-name');

            getLeaguePerformanceOfBetTypeReport(leagueIdList, betTypeId, betTypeName);
        })
    }

    var getLeaguePerformanceOfBetTypeReport = function (leagueIdList, betTypeId, betTypeName) {
        leagueParameters = {
            LeagueIdList: leagueIdList,
            BetTypeId: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Model: parameters.Model,
            TypeSiteIds: parameters.TypeSiteIds,
            LeagueGroupIds: parameters.LeagueGroupIds,
            Measurements: parameters.Measurements,
            MeasurementHides: parameters.MeasurementHides,
            MeasurementDescs: parameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfBetType,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParameters),
            success: function (result) {
                generateLeagueOfBetTypeGrid(result, betTypeId, betTypeName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateLeagueOfBetTypeGrid = function (data, betTypeId, betTypeName) {
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
            bodyData = generateLeagueOfBetTypeGridBody(data);
            footerData = generateLeagueOfBetTypeGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var gridOptions = generateBetTypePerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.BetType, betTypeName),
            showExcelButton: true,
            exportExcelFunction: function () {
                leagueParameters.LeagueIdList = '';
                leagueParameters.ConditionKey = betTypeName;
                leagueParameters.Breadcrumb = labels.BetType + ':' + betTypeName;
                common.DownloadFile(urls.ExportLeaguePerformanceOfBetType, leagueParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        // Hide previous report.
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeaguePerformanceOfBetTypeGridEvents(betTypeId, betTypeName);
    }

    var generateLeagueOfBetTypeGridBody = function (data) {
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

    var generateLeagueOfBetTypeGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }   

    var handleLeaguePerformanceOfBetTypeGridEvents = function (betTypeId, betTypeName) {
        domElements.divLeaguePerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('.match-link').click(function () {
            var link = $(this);
            var matchIdList = link.attr('data-match-ids');
            var leagueName = link.attr('data-league-name');

            getMatchPerformanceOfBetTypeLeagueReport(matchIdList, betTypeId, betTypeName, leagueName);
        });
    }

    var showBetTypePerformanceReport = function () {
        domElements.divBetTypePerformanceContainer.removeClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    }

    var getMatchPerformanceOfBetTypeLeagueReport = function (matchIdList, betTypeId, betTypeName, leagueName) {
        matchParameters = {
            MatchIdList: matchIdList,
            BetTypeId: betTypeId,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate,
            Model: parameters.Model,
            TypeSiteIds: parameters.TypeSiteIds,
            LeagueGroupIds: parameters.LeagueGroupIds,
            Measurements: parameters.Measurements,
            MeasurementHides: parameters.MeasurementHides,
            MeasurementDescs: parameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfBetTypeLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParameters),
            success: function (result) {
                generateMatchOfBetTypeLeagueGrid(result, betTypeName, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateMatchOfBetTypeLeagueGrid = function (data, betTypeName, leagueName) {
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
            { Name: 'ColEventDate', Value: labels.GrandTotal, CellAlign: 'right', MergeColNumber: 2 },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateMatchOfBetTypeLeagueGridBody(data);
            footerData = generateMatchOfBetTypeLeagueGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanBetTypeLink" class="breadcrumb-link">{0}</span><span id="spanLeagueOfBetTypeLink" class="breadcrumb-link"> >> {1}</span><span> >> {2}</span>';
        var gridOptions = generateBetTypePerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.BetType, betTypeName, leagueName),
            showExcelButton: true,
            exportExcelFunction: function () {
                matchParameters.MatchIdList = '';
                matchParameters.ConditionKey = leagueName;
                matchParameters.Breadcrumb = labels.BetType + ":" + betTypeName + ";" + labels.League + ":" + leagueName;
                common.DownloadFile(urls.ExportMatchPerformanceOfBetTypeLeague, matchParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchRerformanceOfBetTypeLeagueGridEvents();
    }

    var generateMatchOfBetTypeLeagueGridBody = function (data) {
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

    var generateMatchOfBetTypeLeagueGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }

    var handleMatchRerformanceOfBetTypeLeagueGridEvents = function () {
        domElements.divMatchPerformanceContainer.find('#spanBetTypeLink').click(function () {
            showBetTypePerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanLeagueOfBetTypeLink').click(function () {
            showLeaguePerformanceOfBetTypeReport();
        });
    }

    var showLeaguePerformanceOfBetTypeReport = function () {
        domElements.divBetTypePerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    }

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
}