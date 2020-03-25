$(document).ready(function () {
    var period = new Fanex.NAP.TGRS.AutomationTradingPerformance.PeriodPerformance();

    period.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.AutomationTradingPerformance.PeriodPerformance');
Fanex.NAP.TGRS.AutomationTradingPerformance.PeriodPerformance = function () {
    var $this = this;

    var urls = {
        GetWeekPerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetWeekPerformance'),
        GetMonthPerformance: common.ResolveRootUrl('AutomationTradingPerformance/GetMonthPerformance'),        
        ExportPeriodPerformance: common.ResolveRootUrl('AutomationTradingPerformance/ExportPeriodPerformance'),
        GetLeaguePerformanceOfPeriod: common.ResolveRootUrl('AutomationTradingPerformance/GetLeaguePerformanceOfPeriod'),
        ExportLeaguePerformanceOfPeriod: common.ResolveRootUrl('AutomationTradingPerformance/ExportLeaguePerformanceOfPeriod'),
        GetMatchPerformanceOfPeriodLeague: common.ResolveRootUrl('AutomationTradingPerformance/GetMatchPerformanceOfPeriodLeague'),
        ExportMatchPerformanceOfPeriodLeague: common.ResolveRootUrl('AutomationTradingPerformance/ExportMatchPerformanceOfPeriodLeague') 
    };

    var domElements = {
        divMonthPerformanceFilter: null,
        ddlViewBy: null,
        ddlPeriodType: null,
        ddlLeagueGroup: null,
        btnGenerate: null,
        divPeriodPerformanceContainer: null,
        divPeriodPerformanceGrid: null,
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
        ViewBy: null,
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
        domElements.divMonthPerformanceFilter = $('#divMonthPerformanceFilter');
        domElements.ddlViewBy = $('#ddlViewBy');
        domElements.divDateRange = domElements.divMonthPerformanceFilter.find('#divDateRange');
        domElements.ddlModel = domElements.divMonthPerformanceFilter.find('#ddlModel');
        domElements.ddlLeagueGroup = domElements.divMonthPerformanceFilter.find('#ddlLeagueGroup');
        domElements.ddlSite = domElements.divMonthPerformanceFilter.find('#ddlSite');
        domElements.ddlMeasurement = domElements.divMonthPerformanceFilter.find('#ddlMeasurement');
        domElements.btnGenerate = domElements.divMonthPerformanceFilter.find('#btnGenerate');
        domElements.divPeriodPerformanceContainer = $('#divPeriodPerformanceContainer');
        domElements.divPeriodPerformanceGrid = $('#divPeriodPerformanceGrid');
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
            labelCss: 'col_5',
            isGenerateOptionWeek: true
        });

        domElements.ddlPeriodType = domElements.divDateRange.find('#ddlPeriodType');
        domElements.divDateRange.find("span:contains('" + labels.Date + "')").text('Month');
        domElements.ddlPeriodType.val(2).change();

        setCacheForFilter(domElements.ddlLeagueGroup, getStorageFilter("RTMonthlySelectedLeagueGroups"));

        setCacheForFilter(domElements.ddlSite, getStorageFilter("RTMonthlySelectedSideIds"));

        setCacheForFilter(domElements.ddlMeasurement, getStorageFilter("RTMonthlySelectedMeasurements"));

        domElements.ddlViewBy.change(function () {
            domElements.ddlPeriodType = domElements.divDateRange.find('#ddlPeriodType');
            var instance = domElements.divDateRange.find("span:contains('" + labels.Date + "')");

            if (domElements.ddlViewBy.val() == labels.Week) {
                if (instance.length == 0) {
                    instance = domElements.divDateRange.find("span:contains('" + labels.Month + "')");
                }
                if (instance.length > 0) {
                    instance.text(labels.Week);
                }
                domElements.ddlPeriodType.val(4).change();
            } else {
                if (instance.length == 0) {
                    instance = domElements.divDateRange.find("span:contains('" + labels.Week + "')");
                }  
                if (instance.length > 0) {
                    instance.text(labels.Month);
                }
                domElements.ddlPeriodType.val(2).change();
            }
        });

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

                parameters.ViewBy = domElements.ddlViewBy.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();                
                parameters.Model = domElements.ddlModel.val();                
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

                hideAllReports();
                getPeriodPerformanceReport();
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
        domElements.divPeriodPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    var getPeriodPerformanceReport = function () {
        common.DisableInput();

        var url = domElements.ddlViewBy.val() == labels.Week ? urls.GetWeekPerformance : urls.GetMonthPerformance;

        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                generatePeriodPerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generatePeriodPerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.Period, Name: "ColPeriod", MergeRowNumber: 2 },
            { HeaderText: labels.League, Name: "ColLeagueCount", MergeRowNumber: 2 },
            { HeaderText: labels.MatchCount, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.Period, Width: 190, Name: "ColPeriod", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.League, Width: 120, Name: "ColLeagueCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.MatchCount, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColPeriod', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColLeagueCount', Value: data.GrandTotal.LeagueCount },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generatePeriodPerformanceGridBody(data);
            footerData = generatePeriodPerformanceGridFooter(data, footerColumns);
        }
        var gridOptions = generatePeriodPerformanceGridOptions();
        gridOptions.titleInfo = {
            showExcelButton: true,
            exportExcelFunction: function () {
                common.DownloadFile(urls.ExportPeriodPerformance, parameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        domElements.divPeriodPerformanceGrid.fanexGrid(gridOptions);

        handlePeriodPerformanceGridEvents();

        summaryPerformance.BindData(data.Summary, data.LeagueCount, data.MatchCount);
        summaryPerformance.Display(true);
    }

    var generatePeriodPerformanceGridOptions = function () {
        return {
            customizeHeader: true,
            showFooter: true,
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            showNumberColumn: false
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

    var generatePeriodPerformanceGridBody = function (data) {
        var leagueFormat = '<span class="league-link link" title="{0}" data-league-ids="{1}" data-period="{2}" data-range-date="{3}">{4}</span>';       
        var bodyData = [];
        var row;

        $.each(data.ItemList, function (indexItem, item) {
            var leagueCountCol = leagueFormat.format(labels.LeaguePerformance, item.LeagueIdList, item.AutoTradingName, item.AutoTradingName2, item.LeagueCount);

            var currentRowData = [
                { Name: 'ColPeriod', Value: item.AutoTradingName, CssClass: 'bold' },
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

    var generatePeriodPerformanceGridFooter = function (data, columns) {       
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }

    var handlePeriodPerformanceGridEvents = function () {
        domElements.divPeriodPerformanceContainer.find('.league-link').click(function () {
            var link = $(this);
            var leagueIdList = link.attr('data-league-ids');            
            var period = link.attr('data-period');
            var rangeDate = link.attr('data-range-date');

            getLeaguePerformanceOfPeriodReport(leagueIdList, rangeDate, period);
        })
    }

    var getLeaguePerformanceOfPeriodReport = function (leagueIdList, rangeDate, period) {
        var arrRangeDate = rangeDate.split(';');

        leagueParameters = {
            LeagueIdList: leagueIdList,
            FromDate: arrRangeDate[0],
            ToDate: arrRangeDate[1],
            Model: parameters.Model,
            TypeSiteIds: parameters.TypeSiteIds,
            Measurements: parameters.Measurements,
            MeasurementHides: parameters.MeasurementHides,
            MeasurementDescs: parameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfPeriod,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leagueParameters),
            success: function (result) {
                generateLeagueOfPeriodGrid(result, period);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateLeagueOfPeriodGrid = function (data, period) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.League, Name: "ColLeagueName", MergeRowNumber: 2 },
            { HeaderText: labels.MatchCount, Name: "ColMatchCount", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.League, Width: 240, Name: "ColLeagueName", HeaderAlign: "center", CellAlign: "left", Sort: true },
            { HeaderText: labels.MatchCount, Width: 120, Name: "ColMatchCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColLeagueName', Value: labels.GrandTotal, CellAlign: 'right' },
            { Name: 'ColMatchCount', Value: data.GrandTotal.MatchCount },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateLeagueOfPeriodGridBody(data);
            footerData = generateLeagueOfPeriodGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanPeriodLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var gridOptions = generatePeriodPerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.Period, period),
            showExcelButton: true,
            exportExcelFunction: function () {
                common.DownloadFile(urls.ExportLeaguePerformanceOfPeriod, leagueParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        // Hide previous report.
        domElements.divPeriodPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);

        handleLeaguePerformanceOfPeriodGridEvents(period);
    }

    var generateLeagueOfPeriodGridBody = function (data) {
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

    var generateLeagueOfPeriodGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }   

    var handleLeaguePerformanceOfPeriodGridEvents = function (period) {
        domElements.divLeaguePerformanceContainer.find('#spanPeriodLink').click(function () {
            showPeriodPerformanceReport();
        });

        domElements.divLeaguePerformanceContainer.find('.match-link').click(function () {
            var link = $(this);
            var matchIdList = link.attr('data-match-ids');
            var leagueName = link.attr('data-league-name');

            getMatchPerformanceOfPeriodLeagueReport(matchIdList, period, leagueName);
        });
    }

    var showPeriodPerformanceReport = function () {
        domElements.divPeriodPerformanceContainer.removeClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    };

    var getMatchPerformanceOfPeriodLeagueReport = function (matchIdList, period, leagueName) {
        matchParameters = {
            MatchIdList: matchIdList,
            FromDate: leagueParameters.FromDate,
            ToDate: leagueParameters.ToDate,
            Model: leagueParameters.Model,
            TypeSiteIds: leagueParameters.TypeSiteIds,
            Measurements: leagueParameters.Measurements,
            MeasurementHides: leagueParameters.MeasurementHides,
            MeasurementDescs: leagueParameters.MeasurementDescs
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfPeriodLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchParameters),
            success: function (result) {
                generateMatchOfPeriodLeagueGrid(result, period, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var generateMatchOfPeriodLeagueGrid = function (data, period, leagueName) {
        var bodyData = [];
        var footerData = [];
        var groupHeaderColumns = [
            { HeaderText: labels.EventDate, Name: "ColEventDate", MergeRowNumber: 2 },
            { HeaderText: labels.MatchCount, Name: "ColMatchName", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];
        var headerColumns = [
            { HeaderText: labels.EventDate, Width: 120, Name: "ColEventDate", HeaderAlign: "center", CellAlign: "center", Sort: true },
            { HeaderText: labels.MatchCount, Width: 240, Name: "ColMatchName", HeaderAlign: "center", CellAlign: "center", Sort: true },
            { HeaderText: labels.BetCount, Width: 120, Name: "ColBetCount", HeaderAlign: "center", CellAlign: "right", Sort: true, FormatNumber: common.Formats.IntegerFormat }
        ];
        var footerColumns = [
            { Name: 'ColEventDate', Value: labels.GrandTotal, CellAlign: 'right', MergeColNumber: 2 },
            { Name: 'ColBetCount', Value: data.GrandTotal.BetCount }
        ];

        if (data && data.ItemList.length > 0) {
            bodyData = generateMatchOfPeriodLeagueGridBody(data);
            footerData = generateMatchOfPeriodLeagueGridFooter(data, footerColumns);
        }

        var titleFormat = '<span id="spanPeriodLink" class="breadcrumb-link">{0}</span><span id="spanLeagueOfPeriodLink" class="breadcrumb-link"> >> {1}</span><span> >> {2}</span>';
        var gridOptions = generatePeriodPerformanceGridOptions(data);
        gridOptions.titleInfo = {
            text: titleFormat.format(labels.Period, period, leagueName),
            showExcelButton: true,
            exportExcelFunction: function () {
                common.DownloadFile(urls.ExportMatchPerformanceOfPeriodLeague, matchParameters);
            }
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        gridOptions.groupHeaderRows = [{ Columns: generateColumnGroupHeaders(data, groupHeaderColumns) }];
        gridOptions.columns = generateColumns(data, headerColumns);

        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);

        handleMatchRerformanceOfPeriodLeagueGridEvents();
    }

    var generateMatchOfPeriodLeagueGridBody = function (data) {
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

    var generateMatchOfPeriodLeagueGridFooter = function (data, columns) {
        return [{
            Columns: generateRobotTradingItemList(data.GrandTotal.RobotTradingItemList, columns)
        }];
    }

    var handleMatchRerformanceOfPeriodLeagueGridEvents = function () {
        domElements.divMatchPerformanceContainer.find('#spanPeriodLink').click(function () {
            showPeriodPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanLeagueOfPeriodLink').click(function () {
            showLeaguePerformanceOfPeriodReport();
        });
    }

    var showLeaguePerformanceOfPeriodReport = function () {
        domElements.divPeriodPerformanceContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
    }

    $this.InitPage = function () {
        cacheDOMElements();

        initializeFields();
    };
}