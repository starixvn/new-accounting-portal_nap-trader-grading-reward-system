Namespace.Register("Fanex.TGRS.Reports.Trader");
Fanex.TGRS.Reports.Trader = function () {
    var $this = this;

    var linkAction = null;

    var domElements = {
        divDateRange: null,
        btnSearch: null,
        divGeneralInfo: null,
        divTopTrader: null,
        divBottomTrader: null,
        teamWinlossContainer: null,
        chkVirtualFigure: null,
        chkRealFigure: null,
        titleTurnOver: null,
        titleWinLoss: null,
        titleMargin: null
    };

    var filterParameters = {
        Trader: null,
        ReportType: null,
        FromDate: null,
        ToDate: null,
        FigureType: null
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
        domElements.titleWinLoss = $("#titleWinLoss", domElements.divGeneralInfo);
        domElements.lblMargin = $("#lblMargin", domElements.divGeneralInfo);
        domElements.titleMargin = $("#titleMargin", domElements.divGeneralInfo);
        domElements.lblTurnOver = $("#lblTurnOver", domElements.divGeneralInfo);
        domElements.titleTurnOver = $("#titleTurnOver", domElements.divGeneralInfo);
        domElements.lblMatches = $("#lblMatches", domElements.divGeneralInfo);
        domElements.BetTypePerformanceGrid = $('#divBettypePerformanceGrid');
        domElements.LeaguesPerformanceGrid = $('#divLeaguesPerformanceGrid');
        domElements.MatchesPerformanceGrid = $('#divMatchesPerformanceGrid');
        domElements.BettypesPerformanceGrid = $('#divBettypesPerformanceGrid');
        domElements.LeaguesPerformanceContainer = $('#LeaguesPerformanceContainer');
        domElements.MatchesPerformanceContainer = $('#MatchesPerformanceContainer');
        domElements.BettypesPerformanceContainer = $('#BettypesPerformanceContainer');
        domElements.divTrader = $('#txtUserName');

        if (isVirtualPerformancePermission && isRealPerformancePermission) {
            domElements.chkVirtualFigure = $('#chkVirtualFigure');
            domElements.chkRealFigure = $('#chkRealFigure');
        }
    };

    var cacheData = {
        dataGeneral: null,
        dataChart: null        
    };

    $('#chkMonth').on('change', function () {       
        getChartData(2, filterParameters.FigureType);
    });

    $('#chkDay').on('change', function () {      
        getChartData(1, filterParameters.FigureType);
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

        if (isVirtualPerformancePermission && isRealPerformancePermission) {
            domElements.chkVirtualFigure.on('change', function () {
                renderGeneralInfo(cacheData.dataGeneral, 1);
                renderChart(cacheData.dataChart, filterParameters.ReportType, 1);
            });

            domElements.chkRealFigure.on('change', function () {
                renderGeneralInfo(cacheData.dataGeneral, 2);
                renderChart(cacheData.dataChart, filterParameters.ReportType, 2);
            });
        }
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

    function getChartData(reportType, figureType) {
        filterParameters.ReportType = reportType;
        $.ajax({
            type: 'POST',
            url: common.ResolveRootUrl('Reports/Trader/ReloadChart'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderChart(result, reportType, figureType);
                    
                    cacheData.dataChart = result;                    
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
        if (isVirtualPerformancePermission && isRealPerformancePermission) {
            filterParameters.FigureType = $('#chkVirtualFigure').is(':checked') ? 1 : 2;
        }
        else if (isVirtualPerformancePermission) {
            filterParameters.FigureType = 1;
        }
        else {
            filterParameters.FigureType = 2;
        }

        cacheData.dataGeneral = data.GeneralInfo;
        cacheData.dataChart = data.WinlossTurnover;

        renderGeneralInfo(data.GeneralInfo, filterParameters.FigureType);        

        renderChart(data.WinlossTurnover, type, filterParameters.FigureType);

        renderBetTypePerformance(data.BetTypePerformances);

        renderLeaguesPerformance(data.LeaguesPerformance);

        common.EnableInput();
    };

    var renderGeneralInfo = function (data, fingureType) {
        if (data != null) {
            domElements.divGeneralInfo.css({ display: "block" });

            var permissionText = fingureType == 1 ? "Virtual" : "Real";

            domElements.titleTurnOver.text(permissionText + " TurnOver");
            domElements.titleWinLoss.text(permissionText + " Win Loss");
            domElements.titleMargin.text(permissionText + " Margin");

            let turnover = fingureType == 1 ? data.Turnover : data.TurnoverReal;
            let winloss = fingureType == 1 ? data.WinLoss : data.WinLossReal;
            let margin = fingureType == 1 ? data.Margin : data.MarginReal;

            domElements.lblWinLoss.text(numeral(winloss).format(common.Formats.DecimalFormat));

            if (margin != null) {
                domElements.lblMargin.text(numeral(margin).format(common.Formats.DecimalFormat) + "%");
            }
            else {
                domElements.lblMargin.text(labels.NA);
            }

            domElements.lblTurnOver.text(numeral(turnover).format(common.Formats.DecimalFormat));
            domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));            
        }
    };

    var renderBetTypePerformance = function (data) {
        var gridOptions = {
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
            customizeHeader: true,
            showFooter: true
        };

        var groupHeaderColumns = [{ HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
            { HeaderText: "Bet Type", Name: "ColBetType", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];

        var columns = [{
                HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center'
            },
            {
                HeaderText: 'Bet Type', Width: 250, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left'
            },
            {
                HeaderText: labels.BetCount, Width: 130, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            }
        ];

        if (isVirtualPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Virtual", Name: "ColTurnOver", MergeColNumber: 3 }
            ]);

            columns = columns.concat([{
                    HeaderText: labels.Turnover, Width: 145, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 145, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);
        }

        if (isRealPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Real", Name: "ColTurnOverReal", MergeColNumber: 3 }
            ]);

            columns = columns.concat([{
                HeaderText: labels.Turnover, Width: 145, Name: 'ColTurnOverReal', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat
            },
            {
                HeaderText: labels.WinLoss, Width: 145, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            },
            {
                HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
            }]);
        }

        gridOptions.groupHeaderRows = [{ Columns: groupHeaderColumns }];
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var total = {
            Turnover: 0,
            WinLoss: 0,
            Margin: null,
            TurnoverReal: 0,
            WinLossReal: 0,
            MarginReal: null,
            BetCount: 0
        };
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentColumns = [{ Name: 'ColNo' },
                    { Name: 'ColBetType', Value: item.TypeName },
                    { Name: 'ColBetCount', Value: item.BetCount }];

                if (isVirtualPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnOver', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]);
                }

                if (isRealPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnOverReal', Value: item.TurnoverReal },
                        { Name: 'ColWinLossReal', Value: item.WinLossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }]);
                }

                row = { Columns: currentColumns };

                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.WinLoss;
                total.TurnoverReal += item.TurnoverReal;
                total.WinLossReal += item.WinLossReal;
                total.BetCount += item.BetCount;
            });

            total.Margin = total.Turnover !== 0 ? total.WinLoss / total.Turnover * 100 : labels.NA;
            total.MarginReal = total.TurnoverReal !== 0 ? total.WinLossReal / total.TurnoverReal * 100 : labels.NA;

            var totalColumns = [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: total.BetCount }];

            if (isVirtualPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnOver', Value: total.Turnover },
                    { Name: 'ColWinLoss', Value: total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }]);
            }

            if (isRealPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnOverReal', Value: total.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: total.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(total.MarginReal, labels.NA) }]);
            }

            row = { Columns: totalColumns };

            footerData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        domElements.BetTypePerformanceGrid.fanexGrid(gridOptions);
    };

    var renderLeaguesPerformance = function (data) {
        var noOfMatchsFormat = '<span class="match-link link" data-league-id="{0}" data-league-name="{1}" title="{2}">{3}</span>';
        var gridOptions = {
            gridExpandHeight: 50,
            customizeHeader: true,
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

        var groupHeaderColumns = [{ HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
            { HeaderText: labels.League, Name: "ColLeague", MergeRowNumber: 2 },
            { HeaderText: labels.NoOfMatches, Name: "ColNoOfMatches", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }];

        var columns = [{ HeaderText: labels.No, Width: 50, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.League, Width: 250, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left'
            },
            {
                HeaderText: labels.NoOfMatches, Width: 75, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            },
            {
                HeaderText: labels.BetCount, Width: 80, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            }
        ];

        if (isVirtualPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Virtual", Name: "ColTurnOver", MergeColNumber: 3 }
            ]);

            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 140, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 140, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);
        }

        if (isRealPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Real", Name: "ColTurnOverReal", MergeColNumber: 3 }
            ]);

            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 140, Name: 'ColTurnOverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 140, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 100, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);
        }

        gridOptions.groupHeaderRows = [{ Columns: groupHeaderColumns }];
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var row;
        if (data && data.ItemLiveList.length > 0) {
            $.each(data.ItemLiveList, function (index, item) {
                var noOfMatchesCol = noOfMatchsFormat.format(item.LeagueId, item.LeagueName, labels.MatchPerformance, item.NoOfMatches);

                var currentColumns = [{ Name: 'ColNo' },
                    { Name: 'ColLeague', Value: item.LeagueName },
                    { Name: 'ColNoOfMatches', Value: noOfMatchesCol },
                    { Name: 'ColBetCount', Value: item.BetCount }];

                if (isVirtualPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnOver', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: item.Margin }]);
                }

                if (isRealPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnOverReal', Value: item.TurnoverReal },
                        { Name: 'ColWinLossReal', Value: item.WinLossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }]);
                }

                row = { Columns: currentColumns };
                bodyData.push(row);
            });

            var totalColumns = [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColNoOfMatches', Value: data.Total.NoOfMatches },
                { Name: 'ColBetCount', Value: data.Total.BetCount }];

            if (isVirtualPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnOver', Value: data.Total.Turnover },
                    { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }]);
            }

            if (isRealPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnOverReal', Value: data.Total.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }]);
            }

            row = {
                Columns: totalColumns                    
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

    function renderChart(data, type, fingureType) {
        if (data) {
            chartData = {
                MixData: [],
                Categories: [],
                MonthCategories: [],
                MixDataMin: 0
            };

            var permissionText = fingureType == 1 ? "Virtual" : "Real";

            chartData.MixData = [
                {
                    type: 'column', yAxis: 0, zIndex: 1, data: [],
                    name: permissionText + ' Turnover'
                },
                {
                    type: 'spline', yAxis: 1, zIndex: 2, data: [],
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white', width: 7, height: 7
                    },
                    name: permissionText + ' Winloss'
                }
            ];

            if (type === 1) {
                $.each(data, function (index, item) {
                    chartData.Categories.push(moment(item.WLDate).format('DD MMM'));

                    let turnover = fingureType == 1 ? item.Turnover : item.TurnoverReal;
                    let winloss = fingureType == 1 ? item.WinLoss : item.WinLossReal;

                    chartData.MixData[0].data.push(turnover);
                    chartData.MixData[1].data.push(winloss);

                    if (turnover < chartData.MixDataMin) {
                        chartData.MixDataMin = turnover;
                    }
                    if (winloss < chartData.MixDataMin) {
                        chartData.MixDataMin = winloss;
                    }
                });
            }
            else {
                $.each(data, function (index, item) {
                    chartData.Categories.push(moment(item.WLDate).format('MMM'));

                    let turnover = fingureType == 1 ? item.Turnover : item.TurnoverReal;
                    let winloss = fingureType == 1 ? item.WinLoss : item.WinLossReal;

                    chartData.MixData[0].data.push(turnover);
                    chartData.MixData[1].data.push(winloss);

                    if (turnover < chartData.MixDataMin) {
                        chartData.MixDataMin = turnover;
                    }
                    if (winloss < chartData.MixDataMin) {
                        chartData.MixDataMin = winloss;
                    }
                });
            }

            // turnover&winloss chart
            var mixChartOption = ChartOptions.MixChartOption(permissionText.toLocaleUpperCase());
            mixChartOption.xAxis.categories = chartData.Categories;
            mixChartOption.title.text = permissionText + ' WinLoss / ' + permissionText + ' Turnover';
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
            customizeHeader: true,
            showFooter: true
        };

        var groupHeaderColumns = [
            { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
            { HeaderText: labels.Match, Name: "ColMatch", MergeRowNumber: 2 },
            { HeaderText: "Event Date", Name: "ColEventDate", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];

        var columns = [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.Match, Width: 390, Name: 'ColMatch', HeaderAlign: 'center', CellAlign: 'left' },
            { HeaderText: "Event Date", Width: 75, Name: 'ColEventDate', HeaderAlign: 'center', CellAlign: 'center' },
            {
                HeaderText: labels.BetCount, Width: 95, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                FormatNumber: common.Formats.IntegerFormat
            }];

        if (isVirtualPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 }
            ]);

            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 90, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);
        }

        if (isRealPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
            ]);

            columns = columns.concat([
                {
                    HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat
                },
                {
                    HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                },
                {
                    HeaderText: labels.Margin, Width: 90, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right',
                    FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                }
            ]);
        }

        gridOptions.groupHeaderRows = [{ Columns: groupHeaderColumns }];
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var row;

        if (data && data.ItemLiveList.length > 0) {
            $.each(data.ItemLiveList, function (index, item) {
                matchDetailCol = matchDetailFormat.format(labels.BetTypeDetail, item.MatchId, item.EventDate, item.MatchName);

                var currentColumns = [{ Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColMatch', Value: matchDetailCol },
                    { Name: 'ColEventDate', Value: item.EventDate },
                    { Name: 'ColBetCount', Value: item.BetCount }];

                if (isVirtualPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.WinLoss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }]);
                }

                if (isRealPerformancePermission) {
                    currentColumns = currentColumns.concat([{ Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: item.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }]);
                }

                row = { Columns: currentColumns };

                bodyData.push(row);
            });

            var totalColumns = [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 3, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: data.Total.BetCount }
            ];

            if (isVirtualPerformancePermission) {
                totalColumns = totalColumns.concat([
                    { Name: 'ColTurnover', Value: data.Total.Turnover },
                    { Name: 'ColWinLoss', Value: data.Total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(data.Total.Margin, labels.NA) }
                ]);
            }

            if (isRealPerformancePermission) {
                totalColumns = totalColumns.concat([
                    { Name: 'ColTurnoverReal', Value: data.Total.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: data.Total.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(data.Total.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: totalColumns };

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
            customizeHeader: true,
            showFooter: true
        };
       
        var groupHeaderColumns = [
            { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
            { HeaderText: labels.BetType, Name: "ColBettype", MergeRowNumber: 2 },
            { HeaderText: labels.BetCount, Name: "ColBetCount", MergeRowNumber: 2 }
        ];

        var columns = [{ HeaderText: labels.No, Width: 60, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
            { HeaderText: labels.BetType, Width: 220, Name: 'ColBettype', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
            { HeaderText: labels.BetCount, Width: 100, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.IntegerFormat}
        ];

        if (isVirtualPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Virtual", Name: "ColTurnover", MergeColNumber: 3 }
            ]);

            columns = columns.concat([{ HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 120, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' }
            ]);
        }

        if (isRealPerformancePermission) {
            groupHeaderColumns = groupHeaderColumns.concat([
                { HeaderText: "Real", Name: "ColTurnoverReal", MergeColNumber: 3 }
            ]);

            columns = columns.concat([{ HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnoverReal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat },
                { HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLossReal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: labels.Margin, Width: 120, Name: 'ColMarginReal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' }
            ]);
        }

        gridOptions.groupHeaderRows = [{ Columns: groupHeaderColumns }];
        gridOptions.columns = columns;

        var bodyData = [];
        var footerData = [];
        var row;
        var total = {
            Turnover: 0,
            WinLoss: 0,            
            Margin: null,
            TurnoverReal: 0,
            WinLossReal: 0,
            MarginReal: null,
            BetCount: 0
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var currentRowData = [{ Name: 'ColNo', Value: index + 1 },
                    { Name: 'ColBettype', Value: item.TypeName },
                    { Name: 'ColBetCount', Value: item.BetCount }
                ];      

                if (isVirtualPerformancePermission) {
                    currentRowData = currentRowData.concat([{ Name: 'ColTurnover', Value: item.Turnover },
                        { Name: 'ColWinLoss', Value: item.Winloss },
                        { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) }
                    ]);
                }

                if (isRealPerformancePermission) {
                    currentRowData = currentRowData.concat([{ Name: 'ColTurnoverReal', Value: item.TurnoverReal },
                        { Name: 'ColWinLossReal', Value: item.WinlossReal },
                        { Name: 'ColMarginReal', Value: common.GetNumWithLabel(item.MarginReal, labels.NA) }
                    ]);
                }
              
                row = {
                    Columns: currentRowData
                };
                bodyData.push(row);

                total.Turnover += item.Turnover;
                total.WinLoss += item.Winloss;
                total.TurnoverReal += item.TurnoverReal;
                total.WinLossReal += item.WinlossReal;
                total.BetCount += item.BetCount;
            });

            total.Margin = total.Turnover !== 0 ? total.WinLoss / total.Turnover * 100 : labels.NA;
            total.MarginReal = total.TurnoverReal !== 0 ? total.WinLossReal / total.TurnoverReal * 100 : labels.NA;

            var totalColumns = [{ Name: 'ColNo', Value: labels.GrandTotal, MergeColNumber: 2, CellAlign: 'right' },
                { Name: 'ColBetCount', Value: total.BetCount }];

            if (isVirtualPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnover', Value: total.Turnover },
                    { Name: 'ColWinLoss', Value: total.WinLoss },
                    { Name: 'ColMargin', Value: common.GetNumWithLabel(total.Margin, labels.NA) }
                ]);
            }

            if (isRealPerformancePermission) {
                totalColumns = totalColumns.concat([{ Name: 'ColTurnoverReal', Value: total.TurnoverReal },
                    { Name: 'ColWinLossReal', Value: total.WinLossReal },
                    { Name: 'ColMarginReal', Value: common.GetNumWithLabel(total.MarginReal, labels.NA) }
                ]);
            }

            row = { Columns: totalColumns };

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