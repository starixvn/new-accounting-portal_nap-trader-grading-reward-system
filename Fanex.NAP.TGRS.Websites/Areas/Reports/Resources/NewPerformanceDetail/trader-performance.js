/* File Created: May 19, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, messages, datepickerSetting, forecastBettype */

////'use strict';
$(document).ready(function () {
    var traderPerformance = new Fanex.NAP.TGRS.NewPerformanceDetail.TraderPerformance();

    traderPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.NewPerformanceDetail.TraderPerformance');
Fanex.NAP.TGRS.NewPerformanceDetail.TraderPerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divTraderPerformanceFilter: null,
        divDateRange: null,
        ddlBetType: null,
        txtTrader: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };
    var urls = {
        GetInitializedData: common.ResolveRootUrl('NewPerformanceDetail/GetInitializedData'),
        GetTraderPerformance: common.ResolveRootUrl('NewPerformanceDetail/GetTraderPerformance'),
        ExportTraderPerformance: common.ResolveRootUrl('NewPerformanceDetail/ExportTraderPerformance'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('NewPerformanceDetail/GetTraderMatchPerformance'),
        GetBettypeDetail: common.ResolveRootUrl('NewPerformanceDetail/GetTraderMatchBettypePerformance')
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        Username: null,
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
    var gradeHistory;// = new Fanex.TGRS.PerformanceSummary.GradeHistory();
    var teamHistory;// = new Fanex.TGRS.PerformanceSummary.TeamHistory();
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTraderPerformanceFilter = $('#divTraderPerformanceFilter');
        domElements.divDateRange = domElements.divTraderPerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divTraderPerformanceFilter.find('#ddlBetType');
        domElements.txtTrader = domElements.divTraderPerformanceFilter.find('#txtTrader');
        domElements.txtMarginFrom = domElements.divTraderPerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divTraderPerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divTraderPerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divTraderPerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divTraderPerformanceFilter.find('#btnGenerate');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
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

        domElements.txtTrader.focusout(function () {
            var value = $.trim(domElements.txtTrader.val());

            domElements.txtTrader.val(value);
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
            if (validator.ValidateForm(domElements.divTraderPerformanceFilter, 'w')) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');

                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Username = domElements.txtTrader.val();
                parameters.BetTypes = '1,3,7,8'; // selectedBetTypes.length === betTypeOptions.length ? '0' : selectedBetTypes.join(',');
                parameters.MarginFrom = ''; // domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = ''; // domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.Turnover = ''; // domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.WinLoss = ''; // domElements.txtMinWinLoss.val().replace(/,/g, '');

                hideReports();
                getTraderPerformanceReport();
            }
        });
    };

    // Hide reports.
    var hideReports = function () {
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Get trader performance on a specific league.
    var getTraderPerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTraderPerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderTraderPerformanceGrid(result);
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
    var renderTraderPerformanceGrid = function (data) {
        var noOfMatchesFormat = '<span class="match-link link" title="{0}" data-cust-id="{1}" data-username="{2}">{3}</span>';
        var gradeFormat = '<span class="grade">{0}</span>';
        var teamFormat = '<span class="team">{0}</span>';
        var detailIcon = '<span class="detail-icon {0}" title="{1}"></span>';

        var traderCol = '';
        var gradeCol = '';
        var teamCol = '';
        var noOfMatchesCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Trader, Name: 'ColTrader', MergeRowNumber: 2 },
                                { HeaderText: labels.Grade, Name: 'ColGrade', MergeRowNumber: 2 },
                                { HeaderText: labels.Team, Name: 'ColTeam', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfLeagues, Name: 'ColNoOfLeagues', MergeRowNumber: 2 },
                                { HeaderText: labels.NoOfMatches, Name: 'ColNoOfMatches', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: 'ColBetCount', MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: 'ColScore', MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: labels.Grade, Width: 70, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center', AllowTruncate: true },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
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
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, SortDirection: 'desc', FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat, Sort: true
                      },
                      {
                          HeaderText: labels.Score, Width: 100, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, Sort: true, FormatNegative: '$'
                      }],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
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
            showPager: true,
            showNumberColumn: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleTraderPerformanceGridEvents();

                    return rows;
                }
            },
            showFooter: true
        };

        var bodyData = [];
        var footerData = [];
        var row;
        var totalTO = 0, totalJuice = 0, totalWL = 0, totalLeague = 0, totalMatch = 0, totalBetcount = 0;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                noOfMatchesCol = noOfMatchesFormat.format(labels.MatchPerformance, item.CustId, item.Username, numeral(item.MatchCount).format(common.Formats.IntegerFormat));

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTrader', Value: item.Username },
                              { Name: 'ColGrade', Value: item.Grade, CssClass: 'history' },
                              { Name: 'ColTeam', Value: item.TeamName, CssClass: 'history' },
                              { Name: 'ColNoOfLeagues', Value: item.LeagueCount },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColJuice', Value: item.Juice },
                              { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.JuiceMargin, labels.NA) },
                              { Name: 'ColLeftover', Value: item.Leftover },
                              { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.LeftoverMargin, labels.NA) },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalLeague += item.LeagueCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 4, CellAlign: 'right' },
                          { Name: 'ColNoOfLeagues', Value: numeral(totalLeague).format(common.Formats.IntegerFormat) },
                          { Name: 'ColNoOfMatches', Value: numeral(totalMatch).format(common.Formats.IntegerFormat) },
                          { Name: 'ColTurnover', Value: totalTO },
                          { Name: 'ColJuice', Value: totalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalJuice / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: totalWL - totalJuice },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(totalTO > 0 ? (totalWL - totalJuice) / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: totalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(totalTO > 0 ? totalWL / totalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: totalBetcount },
                          { Name: 'ColScore', Value: '' }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divTraderPerformanceGrid.fanexGrid(gridOptions);

        if (!common.HasViewScorePermission) {
            domElements.divTraderPerformanceGrid.fanexGrid("hideColumns", gridOptions, [14]);
        }

        handleTraderPerformanceGridEvents();
    };

    // Handle trander performance grid's events.
    var handleTraderPerformanceGridEvents = function () {
        domElements.divTraderPerformanceGrid.find('span.grade-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            gradeHistory.GetGradeHistory({
                CustId: traderId,
                Username: traderName,
                BetTypes: parameters.BetTypes,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate
            });
        });

        domElements.divTraderPerformanceGrid.find('span.team-column').click(function () {
            var $link = $(this);
            var $trader = $link.closest('tr').find('span.trader');
            var traderId = $trader.attr('data-cust-id');
            var traderName = $trader.text();

            teamHistory.GetTeamHistory({
                CustId: traderId,
                Username: traderName,
                BetTypes: parameters.BetTypes,
                FromDate: parameters.FromDate,
                ToDate: parameters.ToDate
            });
        });

        domElements.divTraderPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            var traderId = $link.attr('data-cust-id');
            var traderName = $link.attr('data-username');

            getMatchPerformanceReport(traderId, traderName);
        });
    };

    // Show trader performance report and hide other reports.
    var showTraderPerformanceReport = function () {
        domElements.divTraderPerformanceContainer.removeClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    // Export trader performance to excel.
    var exportTraderPerformance = function () {
        common.DownloadFile(urls.ExportTraderPerformance, parameters);
    };

    // Get match performance by trader.
    var getMatchPerformanceReport = function (traderId, traderName) {
        var matchPerformanceParameters = {
            CustId: traderId,
            BetTypes: parameters.BetTypes,
            FromDate: parameters.FromDate,
            ToDate: parameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetMatchPerformanceOfTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParameters),
            success: function (result) {
                cachedData.PageSize = common.Constants.PageSize;
                cachedData.PageIndex = 0;
                cachedData.MatchPerformance = result;
                reloadPage(cachedData.PageIndex, cachedData.PageSize, traderId, traderName);
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
    var reloadPage = function (pageIndex, pageSize, traderId, traderName) {
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
                var temCounter = counter + group.length - 1;
                var currentGroup = null;

                if (temCounter < startIndex || counter > endIndex) {
                    counter = temCounter + 1;
                } else {
                    currentGroup = {
                        LeagueId: group[0].LeagueId,
                        LeagueName: group[0].LeagueName,
                        Total: group.length,
                        ItemList: [],
                        groupTotalTO: 0, 
                        groupTotalJuice: 0, 
                        groupTotalWL: 0, 
                        groupBetCount: 0
                    };

                    $.each(group, function (index, item) {
                        currentGroup.groupTotalTO += item.Turnover;
                        currentGroup.groupTotalJuice += item.Juice;
                        currentGroup.groupTotalWL += item.WinLoss;
                        currentGroup.groupBetCount += item.BetCount;

                        if (counter >= startIndex && counter <= endIndex) {
                            item.Order = counter;
                            currentGroup.ItemList.push(item);
                        }

                        counter++;
                    });

                    pageData.push(currentGroup);
                }
            });

            cachedData.TotalItems = counter;
        }

        cachedData.PageIndex = pageIndex;
        cachedData.PageSize = pageSize;
        renderMatchPerformanceGrid(pageData, traderId, traderName);
    };

    // Render match performance of a specific trader grid.
    var renderMatchPerformanceGrid = function (data, traderId, traderName) {
        var titleFormat = '<span id="spanTraderLink" class="breadcrumb-link">{0}</span><span> >> {1}</span>';
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}">{2}</span>';
        var matchDetailCol = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.Match, Name: 'ColMatch', MergeRowNumber: 2 },
                                { HeaderText: labels.EventDate, Name: 'ColEventDate', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center', ShowCollapseExpand: true },
                      { HeaderText: labels.Match, Width: 400, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EventDate, Width: 100, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      }],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TraderPerformance, traderName)
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
                pagerSelectCallBack: function (pageSize, pageIndex) {
                    reloadPage(pageSize, pageIndex, traderId, traderName);
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var subRows = [];
        var row;
        var counter = 0;
        var grandTotalTO = 0, grandTotalJuice = 0, grandTotalWL = 0, grandBetCount = 0;

        if (data && data.length > 0) {
            $.each(data, function (groupIndex, group) {
                subRows = [];

                grandTotalTO += group.groupTotalTO;
                grandTotalJuice += group.groupTotalJuice;
                grandTotalWL += group.groupTotalWL;
                grandBetCount += group.groupBetCount;

                $.each(group.ItemList, function (index, item) {
                    counter++;

                    matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.MatchName);
                    row = {
                        Columns: [{ Name: 'ColNo', Value: item.Order + 1, CssClass: 'order-column' },
                                  { Name: 'ColMatch', Value: matchDetailCol },
                                  { Name: 'ColEventDate', Value: item.EventDateString },
                                  { Name: 'ColTurnover', Value: item.Turnover },
                                  { Name: 'ColJuice', Value: item.Juice },
                                  { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.Turnover > 0 ? item.Juice / item.Turnover * 100 : null, labels.NA) },
                                  { Name: 'ColLeftover', Value: (item.WinLoss - item.Juice) },
                                  { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.Turnover > 0 ? (item.WinLoss - item.Juice) / item.Turnover * 100 : null, labels.NA) },
                                  { Name: 'ColWinLoss', Value: item.WinLoss },
                                  { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                                  { Name: 'ColBetCount', Value: item.BetCount }]
                    };
                    subRows.push(row);
                });

                row = {
                    Columns: [{ Name: 'ColNo', Value: group.LeagueName, MergeColNumber: 3, CellAlign: 'left' },
                                { Name: 'ColTurnover', Value: group.groupTotalTO },
                                { Name: 'ColJuice', Value: group.groupTotalJuice },
                                { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(group.groupTotalTO > 0 ? group.groupTotalJuice / group.groupTotalTO * 100 : null, labels.NA) },
                                { Name: 'ColLeftover', Value: (group.groupTotalWL - group.groupTotalJuice) },
                                { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(group.groupTotalTO > 0 ? (group.groupTotalWL - group.groupTotalJuice) / group.groupTotalTO * 100 : null, labels.NA) },
                                { Name: 'ColWinLoss', Value: group.groupTotalWL },
                                { Name: 'ColMargin', Value: common.GetNumWithLabel(group.groupTotalTO > 0 ? group.groupTotalWL / group.groupTotalTO * 100 : null, labels.NA) },
                                { Name: 'ColBetCount', Value: group.groupBetCount }],
                    SubRows: subRows
                };
                bodyData.push(row);
            });
            
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: grandTotalTO },
                          { Name: 'ColJuice', Value: grandTotalJuice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(grandTotalTO > 0 ? grandTotalJuice / grandTotalTO * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: (grandTotalWL - grandTotalJuice) },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(grandTotalTO > 0 ? (grandTotalWL - grandTotalJuice) / grandTotalTO * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: grandTotalWL },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(grandTotalTO > 0 ? grandTotalWL / grandTotalTO * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: grandBetCount }]
            };
            footerData.push(row);
        }

        // Hide previous report.
        domElements.divTraderPerformanceContainer.addClass('display-none');
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.divMatchPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceGridEvents(traderId, traderName);
    };

    // Handle match performance grid's events.
    var handleMatchPerformanceGridEvents = function (traderId, traderName) {
        domElements.divMatchPerformanceGrid.find('span.forecast').click(function () {
        });

        domElements.divMatchPerformanceContainer.find('#spanTraderLink').click(function () {
            showTraderPerformanceReport();
        });

        domElements.divMatchPerformanceContainer.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            getBettypeDetailReport(traderId, traderName, matchId, matchName);
        });
    };

    //Bettype Detail
    var getBettypeDetailReport = function (traderId, traderName, matchId, matchName) {
        var bettypeDetailParameters = {
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
                renderBettypeDetailGrid(result, matchId, matchName, traderId, traderName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBettypeDetailGrid = function (data, matchId, matchName, traderId, traderName) {
        var titleFormat = '<span id="spanTraderLink"  class="breadcrumb-link"> {0}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        //length of >>: 8
        var titleLength = 8 + labels.TraderPerformance.length + traderName.length;
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                     {
                         Columns: [
                                { HeaderText: labels.No, Name: 'ColNo', MergeRowNumber: 2 },
                                { HeaderText: labels.BetType, Name: 'ColBetType', MergeRowNumber: 2 },
                                { HeaderText: labels.Turnover, Name: 'ColTurnover', MergeRowNumber: 2 },
                                { HeaderText: "Juice", Name: "ColJuice", MergeColNumber: 2 },
                                { HeaderText: "Leftover", Name: "ColLeftover", MergeColNumber: 2 },
                                { HeaderText: "Total", Name: "ColWinLoss", MergeColNumber: 2 },
                                { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 },
                                { HeaderText: labels.Score, Name: "ColScore", MergeRowNumber: 2 }
                         ]
                     }
            ],
            columns: [
                { HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 180, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                {
                    HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColJuice', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColJuiceMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.WinLoss, Width: 120, Name: 'ColLeftover', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColLeftoverMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 90, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.BetCount, Width: 90, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Score, Width: 110, Name: 'ColScore', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ],
            gridExpandHeight: 200,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.TraderPerformance, traderName, matchName, shortenName(common.HasViewScorePermission ? 120 : 100, titleLength, matchName))
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
            Juice: 0,
            WinLoss: 0,
            BetCount: 0
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                            { Name: 'ColBetType', Value: item.TypeName },
                            { Name: 'ColTurnover', Value: item.Turnover },
                            { Name: 'ColJuice', Value: item.Juice },
                            { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(item.Turnover > 0 ? item.Juice / item.Turnover * 100 : null, labels.NA) },
                            { Name: 'ColLeftover', Value: (item.WinLoss - item.Juice) },
                            { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(item.Turnover > 0 ? (item.WinLoss - item.Juice) / item.Turnover * 100 : null, labels.NA) },
                            { Name: 'ColWinLoss', Value: item.WinLoss },
                            { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                            { Name: 'ColBetCount', Value: item.BetCount },
                            { Name: 'ColScore', Value: common.GetNumWithLabel(common.HasViewScorePermission ? item.Score : labels.NA, labels.NA) }]
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.Juice += item.Juice;
                total.WinLoss += item.WinLoss;
                total.BetCount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColJuice', Value: total.Juice },
                          { Name: 'ColJuiceMargin', Value: common.GetNumWithLabel(total.Turnover > 0 ? total.Juice / total.Turnover * 100 : null, labels.NA) },
                          { Name: 'ColLeftover', Value: (total.WinLoss - total.Juice) },
                          { Name: 'ColLeftoverMargin', Value: common.GetNumWithLabel(total.Turnover > 0 ? (total.WinLoss - total.Juice) / total.Turnover * 100 : null, labels.NA) },
                          { Name: 'ColWinLoss', Value: total.WinLoss },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Turnover > 0 ? total.WinLoss / total.Turnover * 100 : null, labels.NA) },
                          { Name: 'ColBetCount', Value: total.BetCount },
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
            domElements.divBettypeDetailGrid.fanexGrid("hideColumns", gridOptions, [10]);
        }

        handleBettypeDetailGridEvents();
    };

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    // Handle grid's events.
    var handleBettypeDetailGridEvents = function () {
        domElements.divBettypeDetailContainer.find('span.forecast-icon').click(function () {
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
        domElements.divMatchPerformanceContainer.removeClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };

    $this.InitPage = function () {
        cacheDOMElements();
        performanceDetailHelper.IntializeFilterData();
        initializeFields();
    };
};