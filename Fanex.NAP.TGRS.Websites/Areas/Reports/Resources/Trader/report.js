Namespace.Register("Fanex.TGRS.Reports.Trader");
Fanex.TGRS.Reports.Trader = function () {
    var $this = this,
        linkAction = null;
    var domElements = {
        divDateRange: null,
        btnSearch: null,
        divGeneralInfo: null,
        divTopTrader: null,
        divBottomTrader: null,
        teamWinlossContainer: null
    };

    var filterParameters = {
        Trader: null,
        ReportType: null,
        FromDate: null,
        ToDate: null
    };

    var ChartOptions = null;
    var ChartType = {
        _2D: 2,
        _3D: 3
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.divDatePair = $('#divDatePair');
        domElements.divFromMonthContainer = $('#divFromMonthContainer');
        domElements.divFromMonth = $('#divFromMonth');
        domElements.divToMonthContainer = $('#divToMonthContainer');
        domElements.divToMonth = $('#divToMonth');
        domElements.ddlYear = $('#ddlYear');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.divGeneralInfo = $('#divGeneralInfo');
        domElements.teamWinlossContainer = $('#teamWinlossContainer');
        domElements.lblWinLoss = $("#lblWinLoss", domElements.divGeneralInfo);
        domElements.lblMargin = $("#lblMargin", domElements.divGeneralInfo);
        domElements.lblTurnOver = $("#lblTurnOver", domElements.divGeneralInfo);
        domElements.lblMatches = $("#lblMatches", domElements.divGeneralInfo);
        domElements.BetTypePerformanceGrid = $('#divBettypePerformanceGrid');
        domElements.LeaguesPerformanceGrid = $('#divLeaguesPerformanceGrid');
        domElements.MatchesPerformanceGrid = $('#divMatchesPerformanceGrid');
        domElements.BettypesPerformanceGrid = $('#divBettypesPerformanceGrid');
        domElements.LeaguesPerformanceContainer = $('#LeaguesPerformanceContainer');
        domElements.MatchesPerformanceContainer = $('#MatchesPerformanceContainer');
        domElements.BettypesPerformanceContainer = $('#BettypesPerformanceContainer');
        domElements.divTrader = $('#txtUserName');
    };

    $('#chkMonth').on('change', function () {
        var monthType = 2;
        getChartData(monthType);
    });
    $('#chkDay').on('change', function () {
        var dayType = 1;
        getChartData(dayType);
    });

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_3'
        });
    };

    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.on('click', function () {
            filterParameters.Trader = domElements.divTrader.val();
            filterParameters.FromDate = domElements.divDateRange.getFrom();
            filterParameters.ToDate = domElements.divDateRange.getTo();
            filterParameters.ReportType = domElements.divDateRange.getPeriodType();
            if (linkAction) {
                getReports(linkAction);
            }

            domElements.MatchesPerformanceContainer.addClass('display-none');
            domElements.BettypesPerformanceContainer.addClass('display-none');
        });
    };

    function getReports(link) {
        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: link,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderReports(result, filterParameters.ReportType);
                    if (filterParameters.ReportType === 1) {
                        $('input:radio[id=chkDay]').prop('checked', true)
                    }
                    else {
                        $('input:radio[id=chkMonth]').prop('checked', true)
                    }
                    $('#switchChart').show();
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    function getChartData(type) {
        filterParameters.ReportType = type;
        $.ajax({
            type: 'POST',
            url: common.ResolveRootUrl('Reports/Trader/ReloadChart'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderChart(result, type);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    var renderReports = function (data, type) {
        renderGeneralInfo(data.GeneralInfo);
        renderChart(data.WinlossTurnover, type);
        renderBetTypePerformance(data.BetTypePerformances);
        renderLeaguesPerformance(data.LeaguesPerformance);
        common.EnableInput();
    };

    var renderGeneralInfo = function (data) {
        if (data != null) {
            domElements.divGeneralInfo.css({ display: "block" });
            domElements.lblWinLoss.text(numeral(data.Winlost).format(common.Formats.DecimalFormat));
            if (data.Margin != null) {
                domElements.lblMargin.text(numeral(data.Margin).format(common.Formats.DecimalFormat) + "%");
            }
            else {
                domElements.lblMargin.text(labels.NA);
            }
            domElements.lblTurnOver.text(numeral(data.Turnover).format(common.Formats.DecimalFormat));
            domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));
        }
    };

    var renderBetTypePerformance = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: 'Bet Type', Width: 250, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left'
                      },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 150, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.BetTypePerformance
            },
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                itemsPerPage: 5,
                maxItemsPerPage: 50,
                currentPage: 0,
                totalItem: 50,
                startPerPage: 5,
                pageStep: 5
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var total = {
            Turnover: 0,
            WinLoss: 0,
            BetCount: 0,
            Margin: null
        };
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo' },
                              { Name: 'ColBetType', Value: item.TypeName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.Winlost;
                total.BetCount += item.BetCount;
            });

            if (total.Turnover !== 0) {
                total.Margin = total.WinLoss / total.Turnover * 100;
            }
            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColTurnOver', Value: total.Turnover },
                          { Name: 'ColWinLoss', Value: total.WinLoss },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }
                ]
            };
            footerData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.BetTypePerformanceGrid.fanexGrid(gridOptions);
    };

    var renderLeaguesPerformance = function (data) {
        var noOfMatchsFormat = '<span class="match-link link" data-league-id="{0}" data-league-name="{1}" title="{2}">{3}</span>';
        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.League, Width: 250, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left'
                      },
                      {
                          HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
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
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.LeaguesPerformance
            },
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                itemsPerPage: 20,
                maxItemsPerPage: 100,
                currentPage: 0,
                totalItem: 100,
                startPerPage: 10,
                pageStep: 10,
                afterPagedFunction: function (rows) {
                    handleLeaguePerformanceGridEvents();
                    $('body').scrollTop(domElements.LeaguesPerformanceContainer.height());
                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;
        if (data && data.ItemLiveList.length > 0) {
            $.each(data.ItemLiveList, function (index, item) {
                var noOfMatchesCol = noOfMatchsFormat.format(item.LeagueId, item.LeagueName, labels.MatchPerformance, item.NoOfMatches);
                row = {
                    Columns: [{ Name: 'ColNo' },
                              { Name: 'ColLeague', Value: item.LeagueName },
                              { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.WinLoss },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);
            });

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                          { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                          { Name: 'ColTurnOver', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
            };
            footerData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.LeaguesPerformanceGrid.fanexGrid(gridOptions);
        handleLeaguePerformanceGridEvents();
    }

    // Handle grid's events.
    var handleLeaguePerformanceGridEvents = function () {
        domElements.LeaguesPerformanceGrid.find('span.match-link').click(function () {
            var $link = $(this);
            //var $leagueName = $link.closest('tr').find('div.league-name');
            var leagueId = $link.attr('data-league-id');
            var leagueName = $link.attr('data-league-name')
            //var leagueName = $leagueName.attr('title');

            leagueName = leagueName || $leagueName.text();

            getMatchPerformanceOfLeagueReport(leagueId, leagueName);
        });
    };

    function renderChart(data, type) {
        if (data) {
            chartData = {
                MixData: [],
                Categories: [],
                MonthCategories: [],
                MixDataMin: 0
            };

            chartData.MixData = [{
                type: 'column',
                yAxis: 0,
                name: 'Turnover',
                zIndex: 1,
                data: []
            },
            {
                type: 'spline',
                name: 'Win loss',
                yAxis: 1,
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white',
                    width: 7,
                    height: 7
                },
                zIndex: 2,
                data: []
            }];
            if (type === 1) {
                $.each(data, function (index, item) {
                    chartData.Categories.push(moment(item.WLDate).format('DD MMM'));
                    chartData.MixData[0].data.push(item.Turnover);
                    chartData.MixData[1].data.push(item.Winlost);
                    if (item.Turnover < chartData.MixDataMin) {
                        chartData.MixDataMin = item.Turnover;
                    }
                    if (item.Winlost < chartData.MixDataMin) {
                        chartData.MixDataMin = item.Winlost;
                    }
                });
            }
            else {
                $.each(data, function (index, item) {
                    chartData.Categories.push(moment(item.WLDate).format('MMM'));
                    chartData.MixData[0].data.push(item.Turnover);
                    chartData.MixData[1].data.push(item.Winlost);
                    if (item.Turnover < chartData.MixDataMin) {
                        chartData.MixDataMin = item.Turnover;
                    }
                    if (item.Winlost < chartData.MixDataMin) {
                        chartData.MixDataMin = item.Winlost;
                    }
                });
            }

            // turnover&winloss chart
            var mixChartOption = ChartOptions.MixChartOption();
            mixChartOption.xAxis.categories = chartData.Categories;
            mixChartOption.title.text = 'WinLoss/Turnover';
            mixChartOption.series = chartData.MixData;
            mixChartOption.chart.options3d.enabled = false;
            if (chartData.MixDataMin < 0) {
                mixChartOption.yAxis[0].min = chartData.MixDataMin;
                mixChartOption.yAxis[1].min = chartData.MixDataMin;
            }
            domElements.teamWinlossContainer.highcharts(mixChartOption);
            if (chartData.Categories.length > 21) {
                $('.highcharts-xaxis-labels tspan').text('');
            }
        }
    }

    //LEAGUE - MATCH SECTION.

    // Get match performance by league.
    var getMatchPerformanceOfLeagueReport = function (leagueId, leagueName) {
        var matchPerformanceParamrters = {
            Trader: filterParameters.Trader,
            LeagueId: leagueId,
            FromDate: filterParameters.FromDate,
            ToDate: filterParameters.ToDate
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: common.ResolveRootUrl('Reports/Trader/GetMatchOfLeague'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(matchPerformanceParamrters),
            success: function (result) {
                renderMatchPerformanceOfLeagueGrid(result, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render match performance of a specific league grid.
    var renderMatchPerformanceOfLeagueGrid = function (data, leagueId, leagueName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span> >> {1}</span>';
        var matchDetailFormat = '<span class="bettype-detail-link link" title="{0}" data-match-id="{1}" data-event-date="{2}">{3}</span>';
        var matchDetailCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Match, Width: 390, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Event Date", Width: 70, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.BetCount, Width: 90, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      {
                          HeaderText: labels.Margin, Width: 90, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 260,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguesPerformance, leagueName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: function (rows) {
                    handleMatchPerformanceOfLeagueGridEvents(leagueId, leagueName);
                    return rows;
                }
            },
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemList.length > 0) {
            $.each(data.ItemList, function (index, item) {
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.EventDate, item.MatchName);
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

            row = {
                Columns: [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColTurnover', Value: data.Total.Turnover },
                          { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                          { Name: 'ColBetCount', Value: data.Total.BetCount },
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.MatchesPerformanceGrid.fanexGrid(gridOptions);
        handleMatchPerformanceOfLeagueGridEvents(leagueId, leagueName);

        // Hide previous report.
        domElements.LeaguesPerformanceContainer.addClass('display-none');
    };

    // Handle match performance of league grid's events.
    var handleMatchPerformanceOfLeagueGridEvents = function (leagueId, leagueName) {

        domElements.MatchesPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.MatchesPerformanceGrid.find('.bettype-detail-link').click(function () {
            var $link = $(this);
            var matchId = $link.attr('data-match-id');
            var matchName = $link.text();
            var eventDate = $link.attr('data-event-date');
            getBettypeOfLeagueMatchDetailReport(matchId, matchName, eventDate, leagueId, leagueName);
        });

        $('body').scrollTop(domElements.MatchesPerformanceContainer.height());

    };

    //Bettype Detail (of league and match)
    var getBettypeOfLeagueMatchDetailReport = function (matchId, matchName, eventDate, leagueId, leagueName) {
        var bettypeDetailParameters = {
            Trader: filterParameters.Trader,
            MatchId: matchId,
            EventDate: eventDate
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: common.ResolveRootUrl('Reports/Trader/GetBettypeOfMatch'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bettypeDetailParameters),
            success: function (result) {
                renderBettypeOfLeagueMatchDetailGrid(result, matchId, matchName, leagueId, leagueName);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render bettype performance (of league and match) grid.
    var renderBettypeOfLeagueMatchDetailGrid = function (data, matchId, matchName, leagueId, leagueName) {
        var titleFormat = '<span id="spanLeagueLink" class="breadcrumb-link">{0}</span>' +
                          '<span id="spanMatchLink"  class="breadcrumb-link"> >> {1}</span>' +
                          '<span title="{2}"> >> {3}</span>';
        //length of >>: 8
        var titleLength = 8 + labels.LeaguesPerformance.length + leagueName.length;
        var gridOptions = {
            columns: [
                { HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: labels.BetType, Width: 250, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                {
                    HeaderText: labels.Turnover,
                    Width: 150,
                    Name: 'ColTurnover',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss,
                    Width: 150,
                    Name: 'ColWinLoss',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                },
                {
                    HeaderText: labels.BetCount,
                    Width: 150,
                    Name: 'ColBetCount',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.IntegerFormat
                },
                {
                    HeaderText: labels.Margin,
                    Width: 150,
                    Name: 'ColMargin',
                    HeaderAlign: 'center',
                    CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat,
                    FormatNegative: '$'
                }
            ],
            gridExpandHeight: 260,
            showTitle: true,
            titleInfo: {
                text: titleFormat.format(labels.LeaguesPerformance, leagueName, matchName, shortenName(98, titleLength, matchName))
            },
            sortOption: {
                afterGridSorted: function (rows) {
                    handleBettypeOfLeagueMatchDetailGridEvents();

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
                    handleBettypeOfLeagueMatchDetailGridEvents();

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
                                        { Name: 'ColWinLoss', Value: item.Winloss },
                                        { Name: 'ColBetCount', Value: item.BetCount },
                                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                                        );
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.Winloss;
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
                          { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }
                ]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;

        domElements.BettypesPerformanceGrid.fanexGrid(gridOptions);

        handleBettypeOfLeagueMatchDetailGridEvents();

        // Hide previous report.
        domElements.MatchesPerformanceContainer.addClass('display-none');
    };

    // Handle bettype of League and Match grid's events.
    var handleBettypeOfLeagueMatchDetailGridEvents = function () {

        domElements.BettypesPerformanceContainer.find('#spanLeagueLink').click(function () {
            showLeaguePerformanceReport();
        });

        domElements.BettypesPerformanceContainer.find('#spanMatchLink').click(function () {
            showMatchPerformanceOfLeagueReport();
        });

        $('body').scrollTop(domElements.BettypesPerformanceContainer.height());
    };

    // Show match performance of league report and hide other reports.
    var showMatchPerformanceOfLeagueReport = function () {
        domElements.MatchesPerformanceContainer.removeClass('display-none');
        domElements.BettypesPerformanceContainer.addClass('display-none');

        $('body').scrollTop(domElements.MatchesPerformanceContainer.height());
    };

    var showLeaguePerformanceReport = function () {
        domElements.LeaguesPerformanceContainer.removeClass('display-none');
        domElements.BettypesPerformanceContainer.addClass('display-none');
        domElements.MatchesPerformanceContainer.addClass('display-none');

        $('body').scrollTop(domElements.LeaguesPerformanceContainer.height());
    };

    //END LEAGUE - MATCH SECTION.

    var shortenName = function (maximumTitleLength, prefixLength, name) {
        var titleLength = prefixLength + name.length;

        if (titleLength > maximumTitleLength) {
            name = name.substring(0, maximumTitleLength - prefixLength - 3) + '...';
        }

        return name;
    };

    $this.Initialize = function (url) {
        linkAction = url;
        cacheDOMElements();
        ChartOptions = new Fanex.TGRS.TraderChart();
        initPageFields();

        $('#switchChart').hide();
        $("#txtUserName").keyup(function (e) {
            if (e.keyCode == 13) {
                $('#btnSearch').trigger("click");
            }
        });

        //Load report for first time
        $('#btnSearch').trigger("click");
    };
}