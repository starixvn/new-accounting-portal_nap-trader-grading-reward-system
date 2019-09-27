/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, datepickerSetting, messages */

////'use strict';
$(document).ready(function () {
    var gradePerformance = new Fanex.NAP.TGRS.PerformanceDetail.GradePerformance();

    gradePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.GradePerformance');
Fanex.NAP.TGRS.PerformanceDetail.GradePerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divGradePerformanceFilter: null,
        divDateRange: null,
        ddlMarket: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divGradePerformanceContainer: null,
        divGradePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divTraderPerformanceByLeagueContainer: null,
        divTraderPerformanceByLeagueGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };
    var urls = {
        GetGradePerformance: common.ResolveRootUrl('PerformanceDetail/GetGradePerformance'),
        ExportGradePerformance: common.ResolveRootUrl('PerformanceDetail/ExportGradePerformance'),
        GetTraderPerformanceOfGrade: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfGrade'),
        GetTraderPerformanceOfGradeByLeague: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformanceOfGradeByLeague'),
        GetLeaguePerformanceOfGrade: common.ResolveRootUrl('PerformanceDetail/GetLeaguePerformanceOfGrade'),
        GetMatchPerformanceOfGradeTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfGradeTrader'),
        GetBettypeDetail: common.ResolveRootUrl('PerformanceDetail/GetBettypeDetailGrade'),
        GetMatchPerformanceOfGradeLeagueTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfGradeLeagueTrader')
    };
    var parameters = {
        MarketFilter: null,
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLoss: null
    };
    var cachedData = {
        MatchPerformance: null,
        GrandTotal: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };

    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divGradePerformanceFilter = $('#divGradePerformanceFilter');
        domElements.ddlMarket = domElements.divGradePerformanceFilter.find('#ddlMarket');
        domElements.divDateRange = domElements.divGradePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divGradePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divGradePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divGradePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divGradePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divGradePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divGradePerformanceFilter.find('#btnGenerate');
        domElements.divGradePerformanceContainer = $('#divGradePerformanceContainer');
        domElements.divGradePerformanceGrid = $('#divGradePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divTraderPerformanceByLeagueContainer = $('#divTraderPerformanceByLeagueContainer');
        domElements.divTraderPerformanceByLeagueGrid = $('#divTraderPerformanceByLeagueGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');
    };

    // Bind event handlers.
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

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            create: function () {
                performanceDetailHelper.SelectDefaultBettypes(domElements.ddlBetType, performanceDetailHelper.GetDefaultBettypes());
            }
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
        });

        domElements.txtMarginFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginFrom.val());

            domElements.txtMarginFrom.val(value);
            validator.ClearError(domElements.txtMarginFrom);
        });

        domElements.txtMarginTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginTo.val());

            domElements.txtMarginTo.val(value);
            validator.ClearError(domElements.txtMarginTo);
        });

        domElements.txtMinTurnover.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinTurnover.val());

            domElements.txtMinTurnover.val(value);
            validator.ClearError(domElements.txtMinTurnover);
        });

        domElements.txtMinWinLoss.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinWinLoss.val());

            domElements.txtMinWinLoss.val(value);
            validator.ClearError(domElements.txtMinWinLoss);
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divGradePerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.MarketFilter = domElements.ddlMarket.val();
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.BetTypes = selectedBetTypes.join(',');
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

                hideAllReports();
                getGradePerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divGradePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceByLeagueContainer.addClass('display-none');
    };

    // Validate filter form.
    var validateFilterForm = function () {
        return validateValueRange(domElements.txtMarginFrom, domElements.txtMarginTo) &&
            validateBetType();
    };

    // Validate From/To values.
    var validateValueRange = function ($from, $to) {
        var fromValue = $from.val();
        var toValue = $to.val();
        var isValid = true;

        if (fromValue !== '' && toValue !== '') {
            fromValue = fromValue.replace(/,/g, '');
            toValue = toValue.replace(/,/g, '');

            isValid = $.isNumeric(fromValue) && $.isNumeric(toValue) && parseFloat(fromValue) <= parseFloat(toValue);
        }

        if (!isValid) {
            validator.ShowError($to, messages.InvalidValue, 'w');
        }

        return isValid;
    };

    // Validate Bet Type field.
    var validateBetType = function () {
        var selectedBetTypes = domElements.ddlBetType.val();

        if (!selectedBetTypes) {
            validator.ShowError(domElements.ddlBetType.next(), messages.RequiredField, 'w');

            return false;
        } else {
            return true;
        }
    };

    // Get grade performance on a specific league.
    var getGradePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetGradePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderGradePerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render grade performance of a specific league grid.
    var renderGradePerformanceGrid = function (data) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderGradePerformanceGridToBody(data);
            footerData = renderGradePerformanceGridToFooter(data);
        }
        var gridOptions = renderGradePerformanceGridOptions();
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divGradePerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divGradePerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleGradePerformanceGridEvents();
    };

    var renderGradePerformanceGridOptions = function () {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
            { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat//, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true, SortDirection: 'desc'
                , FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat//, Sort: true
                , FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportGradePerformance();
                }
            },
            showTree: true,
            showDistinctRow: false,
            sortOption: {
                afterGridSorted: function (rows) {
                    handleGradePerformanceGridEvents();

                    return rows;
                }
            },
            showNumberColumn: false,
            showFooter: true
        };

        return gridOptions;
    }

    var renderGradePerformanceGridToBody = function (data) {
        var nonLiveData = [];
        var liveData = [];

        if (data.ItemNonLiveList.length > 0) {
            nonLiveData = addGradePerformanceToRowsBody(data.ItemNonLiveList, labels.MarketNonLive);
        }

        if (data.ItemLiveList.length > 0) {
            liveData = addGradePerformanceToRowsBody(data.ItemLiveList, labels.MarketLive);
        }

        var bodyData = liveData.concat(nonLiveData);

        return bodyData;
    }

    var addGradePerformanceToRowsBody = function (items, groupName) {
        var noOfTradersFormat = '<span class="trader-link link" data-grade="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfLeaguesFormat = '<span class="league-link link" data-grade="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfTradersCol = '';
        var noOfLeaguesCol = '';
        var subRows = [];
        var rows = [];
        var row;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.Grade,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));

            noOfLeaguesCol = noOfLeaguesFormat.format(
                item.Grade,
                item.IsLive,
                labels.LeaguePerformance,
                numeral(item.NoOfLeagues).format(common.Formats.IntegerFormat));

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColGrade', Value: item.Grade },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfLeagues', Value: noOfLeaguesCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
            };

            subRows.push(row);
        });

        row = {
            Columns: [
                { Name: 'ColNo', Value: groupName, CellAlign: 'left', MergeColNumber: 11 }
            ],
            SubRows: subRows
        }
        rows.push(row);

        return rows;
    }

    var renderGradePerformanceGridToFooter = function (data) {
        return footerData = [
            {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
                { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
                { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                { Name: 'ColTurnover', Value: data.Total.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
                { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                { Name: 'ColBetCount', Value: data.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
                { Name: 'ColScore', Value: '' }]
            }
        ];
    }

    // Handle grade performance grid's events.
    var handleGradePerformanceGridEvents = function () {
        domElements.divGradePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var grade = $link.attr('data-grade');
            var isLive = $link.attr('data-is-live');

            getTraderPerformanceReport(grade, isLive);
        });

        domElements.divGradePerformanceGrid.find('span.league-link').click(function () {
            var $link = $(this);
            var grade = $link.attr('data-grade');
            var isLive = $link.attr('data-is-live');

            getLeaguePerformanceReport(grade, isLive);
        });
    };

    // Show grade performance report and hide other reports.
    var showGradePerformanceReport = function () {
        domElements.divGradePerformanceContainer.removeClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceByLeagueContainer.addClass('display-none');
    };

    // Export grade performance to excel.
    var exportGradePerformance = function () {
        common.DownloadFile(urls.ExportGradePerformance, parameters);
    };

    // Get league performance on a specific bet type.
    var getLeaguePerformanceReport = function (grade, isLive) {
        var leaguePerformance = {
            IsLive: isLive,
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeaguePerformanceOfGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leaguePerformance),
            success: function (result) {
                renderLeaguePerformanceGrid(result, grade, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render league performance grid.
    var renderLeaguePerformanceGrid = function (data, grade, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {           
            bodyData = renderLeaguePerformanceGridToBody(data);
            footerData = renderLeaguePerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divGradePerformanceContainer.addClass('display-none');
        var gridOptions = renderLeaguePerformanceGridOptions(grade, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divLeaguePerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents(grade);
    };

    var renderLeaguePerformanceGridOptions = function (grade, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}: {3}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.League, Width: 300, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.NoOfTraders, Width: 100, Name: 'ColNoOfTraders', HeaderAlign: 'center', CellAlign: 'right' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleLeaguePerformanceGridEvents(grade);

                    return rows;
                }
            },
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleLeaguePerformanceGridEvents(grade);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderLeaguePerformanceGridToBody = function (data) {       
        var noOfTradersFormat = '<span class="trader-link link" data-league-id="{0}" data-is-live="{1}" title="{2}">{3}</span>';
        var noOfTradersCol = '';
        var bodyData = [];
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            noOfTradersCol = noOfTradersFormat.format(
                item.LeagueId,
                item.IsLive,
                labels.TraderPerformance,
                numeral(item.NoOfTraders).format(common.Formats.IntegerFormat));
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColLeague', Value: item.LeagueName, CssClass: 'league-name' },
                { Name: 'ColNoOfTraders', Value: noOfTradersCol },
                { Name: 'ColNoOfMatches', Value: item.NoOfMatches },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderLeaguePerformanceGridToFooter = function (data) {
        return footerData  = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
            { Name: 'ColNoOfTraders', Value: numeral(data.Total.NoOfTraders).format(common.Formats.IntegerFormat) },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];
    }

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function (grade) {
        domElements.divLeaguePerformanceContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });

        domElements.divLeaguePerformanceGrid.find('span.trader-link').click(function () {
            var $link = $(this);
            var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $leagueName.attr('title');
            var isLive = $link.attr('data-is-live');

            leagueName = leagueName || $leagueName.text();

            getTraderPerformanceReportByLeague(grade, leagueId, leagueName, isLive);
        });
    };

    // Get trader performance on a specific grade.
    var getTraderPerformanceReportByLeague = function (grade, leagueId, leagueName, isLive) {
        var traderPerformance = {
            IsLive: isLive,
            Grade: grade,
            LeagueId: leagueId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfGradeByLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformance),
            success: function (result) {
                renderTraderPerformanceByLeagueGrid(result, grade, leagueId, leagueName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific league grid.
    var renderTraderPerformanceByLeagueGrid = function (data, grade, leagueId, leagueName, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {            
            bodyData = renderTraderPerformanceByLeagueGridToBody(data, leagueName);
            footerData = renderTraderPerformanceByLeagueGridToFooter(data);            
        }

        // Hide previous report.
        domElements.divLeaguePerformanceContainer.addClass('display-none');

        var gridOptions = renderTraderPerformanceByLeagueGridOptions(grade, leagueId, leagueName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceByLeagueGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceByLeagueGrid.fanexGrid("hideColumns", gridOptions, [9]);
        }

        handleTraderPerformanceByLeagueGridEvents(grade, leagueId, leagueName);
    };

    var renderTraderPerformanceByLeagueGridOptions = function (grade, leagueId, leagueName, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}: {3}</span>' +
            '<span title="{4}"> >> {5}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            //{ HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade, leagueName, trimLeagueName)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceByLeagueGridEvents(grade, leagueId, leagueName);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceByLeagueGridEvents(grade, leagueId, leagueName);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderTraderPerformanceByLeagueGridToBody = function (data, leagueName) {
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" data-is-live="{0}" title="{1}">{2}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';        
        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';
        var bodyData = [];     
        var row;
        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(item.IsLive, labels.MatchPerformance, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
            gradeCol = gradeFormat.format(item.Grade);
            teamCol = teamFormat.format(item.TeamName);

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                //{ Name: 'ColGrade', Value: gradeCol, CssClass: 'history' },
                { Name: 'ColTeam', Value: teamCol, CssClass: 'history' },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderTraderPerformanceByLeagueGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
            { Name: 'ColScore', Value: '' }]
        }];       
    }

    var handleTraderPerformanceByLeagueGridEvents = function (grade, leagueId, leagueName) {
        domElements.divTraderPerformanceByLeagueContainer.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var isLive = $link.attr('data-is-live');
            var traderName = $trader.text();

            getMatchPerformanceOfGradeLeagueTraderReport(grade, leagueId, leagueName, traderId, traderName, isLive);
        });

        domElements.divTraderPerformanceByLeagueContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });

        domElements.divTraderPerformanceByLeagueContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });
    };

    // Show league performance report and hide other reports.
    var showLeaguePerformanceReport = function () {
        domElements.divTraderPerformanceByLeagueContainer.addClass('display-none');
        domElements.divLeaguePerformanceContainer.removeClass('display-none');
    };

    // Get trader performance on a specific grade.
    var getTraderPerformanceReport = function (grade, isLive) {
        var traderPerformance = {
            IsLive: isLive,
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformanceOfGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(traderPerformance),
            success: function (result) {
                renderTraderPerformanceGrid(result, grade, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render trader performance of a specific grade grid.
    var renderTraderPerformanceGrid = function (data, grade, isLive) {
        var bodyData = [];
        var footerData = [];

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderTraderPerformanceGridToBody(data);
            footerData = renderTraderPerformanceGridToFooter(data);
        }

        // Hide previous report.
        domElements.divGradePerformanceContainer.addClass('display-none');
        var gridOptions = renderTraderPerformanceGridOptions(grade, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleTraderPerformanceGridEvents(grade);
    };

    var renderTraderPerformanceGridOptions = function (grade, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span><span> >> ({1}) {2}: {3}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
            {
                HeaderText: labels.NoOfLeagues, Width: 100, Name: 'ColNoOfLeagues', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.AvgTurnoverPerMatch, Width: 130, Name: 'ColAvgTurnoverPerMatch', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat, Sort: true
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
            },
            {
                HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade)
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleTraderPerformanceGridEvents(grade);

                    return rows;
                }
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents(grade);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderTraderPerformanceGridToBody = function (data) {        
        var traderFormat = '<span class="trader" data-cust-id="{0}" data-team-id="{1}">{2}</span>';
        var noOfMatchesFormat = '<span class="match-link link" title="{0}" data-is-live="{1}">{2}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';
        var traderCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';
        var bodyData = [];
        var row;

        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            traderCol = traderFormat.format(item.TraderId, item.TeamId, item.TraderName);
            noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, item.IsLive, numeral(item.NoOfMatches).format(common.Formats.IntegerFormat));
            teamCol = teamFormat.format(item.TeamName);
            teamCol += item.HasTeamHistory ? detailIcon.format('team-column', labels.TeamHistoryDetail) : '';

            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColTrader', Value: traderCol },
                { Name: 'ColTeam', Value: teamCol, CssClass: 'history' },
                { Name: 'ColNoOfLeagues', Value: item.NoOfLeagues },
                { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColAvgTurnoverPerMatch', Value: (item.Turnover / item.NoOfMatches) },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderTraderPerformanceGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColNoOfLeagues', Value: data.Total.NoOfLeagues },
            { Name: 'ColNoOfMatches', Value: numeral(data.Total.NoOfMatches).format(common.Formats.IntegerFormat) },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColAvgTurnoverPerMatch', Value: (data.Total.Turnover / data.Total.NoOfMatches) },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) },
            { Name: 'ColScore', Value: '' }]
        }];
    }

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function (grade) {
        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var isLive = $link.attr('data-is-live');
            var traderName = $trader.text();

            getMatchPerformanceReport(grade, traderId, traderName, isLive);
        });

        domElements.divTraderPerformanceContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divGradePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (grade, traderId, traderName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
            CustId: traderId,
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfGradeTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result.GroupList;
                cachedData.GrandTotal = result.GrandTotal;
                cachedData.TotalItems = result.TotalItems;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, grade, traderId, traderName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Customize reloading page.
    var reloadPage = function (pageIndex, pageSize, grade, traderId, traderName, isLive) {
        var pageData = [];
        var startIndex = 0;
        var endIndex = 0;
        var counter = 0;

        if (cachedData.MatchPerformance && cachedData.MatchPerformance.length > 0) {
            pageIndex = parseInt(pageIndex);
            pageSize = parseInt(pageSize);
            startIndex = pageIndex * pageSize;
            endIndex = startIndex + pageSize - 1;

            $.each(cachedData.MatchPerformance, function (groupIndex, group) {
                var items = group.ItemLiveList.length > 0 ? group.ItemLiveList : group.ItemNonLiveList;
                var temCounter = counter + items.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        LeagueId: group.LeagueId,
                        LeagueName: group.LeagueName,
                        Total: group.Total,
                        Items: []
                    };

                    $.each(items, function (index, item) {
                        if (counter >= startIndex && counter <= endIndex) {
                            item.Order = counter;
                            currentGroup.Items.push(item);
                        }

                        counter++;
                    });

                    pageData.push(currentGroup);
                }
            });
        }

        cachedData.PageIndex = pageIndex;
        cachedData.PageSize = pageSize;
        renderMatchPerformanceGrid(pageData, grade, traderId, traderName, isLive);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, grade, traderId, traderName, isLive) {
        var bodyData = [];
        var footerData = [];        

        if (data && data.length > 0) {            
            bodyData = renderMatchPerformanceGridToBody(data);
            footerData = renderMatchPerformanceGridToFooter(grade, traderId, traderName);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceGridOptions(grade, traderId, traderName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(grade, traderId, traderName);
    };

    var renderMatchPerformanceGridOptions = function (grade, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link"> >> ({1}) {2}: {3}</span>' +
            '<span> >> {4}</span>';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade, traderName)
            },
            showTree: true,
            showDistinctRow: false,
            showPager: true,
            customPager: true,
            pagerOption: {
                currentPage: cachedData.PageIndex,
                itemsPerPage: cachedData.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                totalItem: cachedData.TotalItems,
                pagerSelectCallBack: function (pageIndex, pageSize) {
                    reloadPage(pageIndex, pageSize, grade, traderId, traderName);
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderMatchPerformanceGridToBody = function (data) {       
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];
        var footerData = [];
        var subRows;
        var row;
        var counter = 0;

        $.each(data, function (groupIndex, group) {
            subRows = [];            

            $.each(group.Items, function (index, item) {
                counter++;
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);
                row = {
                    Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                    { Name: 'ColMatch', Value: matchDetailCol },
                    { Name: 'ColEventDate', Value: item.EventDate },
                    { Name: 'ColTurnover', Value: item.Turnover },
                    { Name: 'ColWinLoss', Value: item.WinLoss },
                    { Name: 'ColBetCount', Value: item.BetCount },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
                };
                subRows.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                { Name: 'ColTurnover', Value: group.Total.Turnover },
                { Name: 'ColWinLoss', Value: group.Total.WinLoss },
                { Name: 'ColBetCount', Value: group.Total.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(group.Total.Margin, labels.NA) }],
                SubRows: subRows
            };
            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceGridToFooter = function () {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: cachedData.GrandTotal.Turnover },
            { Name: 'ColWinLoss', Value: cachedData.GrandTotal.WinLoss },
            { Name: 'ColBetCount', Value: cachedData.GrandTotal.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(cachedData.GrandTotal.Margin, labels.NA) }]
        }];       
    }

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function (grade, traderId, traderName) {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var isLive = $link.attr('data-is-live');
            var matchName = $link.text();
            getBettypeDetailReport(grade, traderId, traderName, matchId, matchName, isLive);
        });
    };

    //Bettype Detail
    var getBettypeDetailReport = function (grade, traderId, traderName, matchId, matchName, isLive) {
        var bettypeDetailParameters = {
            IsLive: isLive,
            Grade: grade,
            CustId: traderId,
            MatchId: matchId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeDetailGrid(result, matchId, matchName, grade, traderId, traderName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render bettype performance grid.
    var renderBettypeDetailGrid = function (data, matchId, matchName, grade, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanTraderLink" class="breadcrumb-link"> >> ({1}) {2}: {3}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {4}</span>' +
                          '<span title="{5}"> >> {6}</span>';
        //length of >>: 14
        var titleLength = 14 + labels.GradePerformance.length + labels.Grade.length + traderName.length + grade.toString().length;
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                {
                    HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.BetCount, Width: 80, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Margin, Width: 90, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade, traderName, matchName, shortenName(common.HasViewScorePermission ? 119 : 99, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showNumberColumn: false,
            showDistinctRow: false,
            showHighlightRow: false,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypeDetailGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var total = {
            Turnover: 0,
            WinLoss: 0,
            BetCount: 0,
            Margin: null
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push({ Name: 'ColNo', Value: index + 1 },
                                        { Name: 'ColBettype', Value: item.TypeName },
                                        { Name: 'ColTurnover', Value: item.Turnover },
                                        { Name: 'ColWinLoss', Value: item.WinLoss },
                                        { Name: 'ColBetCount', Value: item.BetCount },
                                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                        { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.WinLoss;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0) {
                total.Margin = total.WinLoss / total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColWinLoss', Value: total.WinLoss },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [6]);
        }

        handleBettypeDetailGridEvents();
    };

    // Handle grid's events.
    var handleBettypeDetailGridEvents = function () {
        domElements.divBettypeDetailContainer.find('#spanGradeLink').click(function () {
            showGradePerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceReport();
        });
    };

    // Show trader performance report and hide other reports.
    var showMatchPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divGradePerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    var getMatchPerformanceOfGradeLeagueTraderReport = function (grade, leagueId, leagueName, traderId, traderName, isLive) {
        var matchPerformanceParamrters = {
            IsLive: isLive,
            CustId: traderId,
            LeagueId: leagueId,
            Grade: grade,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfGradeLeagueTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                renderMatchPerformanceOfGradeLeagueTraderGrid(result, grade, leagueId, leagueName, traderId, traderName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderMatchPerformanceOfGradeLeagueTraderGrid = function (data, grade, leagueId, leagueName, traderId, traderName, isLive) {                       
        var bodyData = [];
        var footerData = [];    

        if (data && (data.ItemLiveList.length > 0 || data.ItemNonLiveList.length > 0)) {
            bodyData = renderMatchPerformanceOfGradeLeagueTraderGridToBody(data);
            footerData = renderMatchPerformanceOfGradeLeagueTraderGridToFooter(data);            
        }

        // Hide previous report.
        domElements.divTraderPerformanceByLeagueContainer.addClass('display-none');
        var gridOptions = renderMatchPerformanceOfGradeLeagueTraderGridOptions(grade, leagueId, leagueName, traderId, traderName, isLive);
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfGradeLeagueTraderGridEvents(grade, leagueId, leagueName, traderId, traderName);
    };

    var renderMatchPerformanceOfGradeLeagueTraderGridOptions = function (grade, leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}: {3}</span>' +
            '<span id="spanTraderLink" class="breadcrumb-link" title="{4}"> >> {5}</span>' +
            '<span> >> {6}</span>';
        var trimLeagueName = leagueName.length > 80 ? leagueName.substring(0, 81) : leagueName;

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.Turnover, Width: 120, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade, leagueName, trimLeagueName, traderName)
            },
            showPager: true,
            sortOption: {
                afterGridSorted: function (rows) {
                    handleMatchPerformanceOfGradeLeagueTraderGridEvents(grade, leagueId, leagueName, traderId, traderName);

                    return rows;
                }
            },
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceOfGradeLeagueTraderGridEvents(grade, leagueId, leagueName, traderId, traderName);

                    return rows;
                }
            },
            showFooter: true
        };

        return gridOptions;
    }

    var renderMatchPerformanceOfGradeLeagueTraderGridToBody = function (data) {
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-is-live="{2}">{3}</span>';
        var matchDetailCol = '';
        var bodyData = [];        
        var row;

        var items = data.ItemLiveList.length > 0 ? data.ItemLiveList : data.ItemNonLiveList;

        $.each(items, function (index, item) {
            matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.IsLive, item.MatchName);
            row = {
                Columns: [{ Name: 'ColNo', Value: index + 1 },
                { Name: 'ColMatch', Value: matchDetailCol },
                { Name: 'ColEventDate', Value: item.EventDate },
                { Name: 'ColTurnover', Value: item.Turnover },
                { Name: 'ColWinLoss', Value: item.WinLoss },
                { Name: 'ColBetCount', Value: item.BetCount },
                { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]
            };

            bodyData.push(row);
        });

        return bodyData;
    }

    var renderMatchPerformanceOfGradeLeagueTraderGridToFooter = function (data) {
        return footerData = [{
            Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
            { Name: 'ColTurnover', Value: data.Total.Turnover },
            { Name: 'ColWinLoss', Value: data.Total.WinLoss },
            { Name: 'ColBetCount', Value: data.Total.BetCount },
            { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
        }];        
    }

    var handleMatchPerformanceOfGradeLeagueTraderGridEvents = function (grade, leagueId, leagueName, traderId, traderName) {
        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divTraderPerformanceByLeagueContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('#spanLeagueLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divLeaguePerformanceContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('#spanGradeLink').click(function () {
            domElements.divMatchPerformanceContainer.addClass('display-none');
            domElements.divGradePerformanceContainer.removeClass('display-none');
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var isLive = $link.attr('data-is-live');
            var matchName = $link.text();

            getBettypeDetailOfGradeLeagueReport(grade, leagueId, leagueName, traderId, traderName, matchId, matchName, isLive);
        });
    };

    var getBettypeDetailOfGradeLeagueReport = function (grade, leagueId, leagueName, traderId, traderName, matchId, matchName, isLive) {
        var bettypeDetailParameters = {
            IsLive: isLive,
            LeagueId: leagueId,
            CustId: traderId,
            MatchId: matchId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBettypeDetail,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeDetailOfGradeLeagueGrid(result, grade, matchId, matchName, leagueId, leagueName, traderId, traderName, isLive);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBettypeDetailOfGradeLeagueGrid = function (data, grade, matchId, matchName, leagueId, leagueName, traderId, traderName, isLive) {
        var titleFormat = '<span id="spanGradeLink" class="breadcrumb-link">{0}</span>' +
                            '<span id="spanLeagueLink" class="breadcrumb-link"> >> ({1}) {2}: {3}</span>' +
                            '<span id="spanTraderLink" class="breadcrumb-link" title="{4}"> >> {5}</span>' +
                            '<span id="spanMatchLink"  class="breadcrumb-link"> >> {6}</span>' +
                            '<span title="{7}"> >> {8}</span>';

        //length of >>: 14
        var trimLeagueName = leagueName.length > 40 ? leagueName.substring(0, 41) : leagueName;
        var titleLength = 14 + labels.GradePerformance.length + trimLeagueName.length + traderName.length + grade.toString().length + labels.Grade.length;
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 180, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                {
                    HeaderText: labels.Turnover,
                    Width: 100,
                    Name: 'ColTurnover',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss,
                    Width: 100,
                    Name: 'ColWinLoss',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                },
                {
                    HeaderText: labels.BetCount,
                    Width: 80,
                    Name: 'ColBetCount',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Margin,
                    Width: 90,
                    Name: 'ColMargin',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                },
                {
                    HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.GradePerformance, isLive == 'true' ? labels.MarketLive : labels.MarketNonLive, labels.Grade, grade,
                    leagueName, trimLeagueName, traderName, matchName, shortenName(common.HasViewScorePermission ? 109 : 89, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeDetailOfGradeLeagueGridEvents();

                    return rows;
                }
            },
            showNumberColumn: false,
            showDistinctRow: false,
            showHighlightRow: false,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleBettypeDetailOfGradeLeagueGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        var total = {
            Turnover: 0,
            WinLoss: 0,
            BetCount: 0,
            Margin: null
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [];
                currentRowData = [];
                currentRowData.push({ Name: 'ColNo', Value: index + 1 },
                                        { Name: 'ColBettype', Value: item.TypeName },
                                        { Name: 'ColTurnover', Value: item.Turnover },
                                        { Name: 'ColWinLoss', Value: item.WinLoss },
                                        { Name: 'ColBetCount', Value: item.BetCount },
                                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                        { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) });
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.WinLoss;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0) {
                total.Margin = total.WinLoss / total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColWinLoss', Value: total.WinLoss },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        // Hide previous report.
        domElements.divMatchPerformanceContainer.addClass('display-none');

        domElements.divBettypeDetailGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [6]);
        }

        handleBettypeDetailOfGradeLeagueGridEvents();
    };

    var handleBettypeDetailOfGradeLeagueGridEvents = function () {
        domElements.divBettypeDetailContainer.find('#spanTraderLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divTraderPerformanceByLeagueContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanLeagueLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divLeaguePerformanceContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanGradeLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divGradePerformanceContainer.removeClass('display-none');
        });

        domElements.divBettypeDetailContainer.find('#spanMatchLink').click(function () {
            domElements.divBettypeDetailContainer.addClass('display-none');
            domElements.divMatchPerformanceContainer.removeClass('display-none');
        });
    };

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    $this.InitPage = function () {
        cacheDOMElements();
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};