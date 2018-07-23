function OsTraderReport() {
    var traderName = $("#txtUserName"),
        dateRange = $("#divDateRange"),
        sportContainer = $("#sport-container"),
        regionContainer = $("#region-container"),
        leagueContainer = $("#league-container"),
        bettypeContainer = $("#bettype-container"),
        chart = $("#winloss-container"),
        chartData = $("#chart-data-container");

    dateRange = dateRange.timeRange({
        minDate: datepickerSetting.MinDate,
        maxDate: datepickerSetting.DefaultToDate,
        defaultFromDate: datepickerSetting.DefaultFromDate,
        defaultToDate: datepickerSetting.DefaultToDate,
        allowYearRange: datepickerSetting.AllowYearRange,
        yearRanges: null,
        labelCss: 'col_3'
    });

    $("#btnSearch").click(function () {
        common.DisableInput();

        var url = common.ResolveRootUrl("OSTraderReport/GetGeneralInfo");

        var trader = traderName.val();

        if (!validator.ValidateForm(traderName.parent(), "w")) {
            common.EnableInput();
            setTimeout(() => validator.ClearError(traderName), 1000);
            return;
        }

        var criteria = {
            traderName: traderName.val(),
            fromDate: dateRange.getFrom(),
            toDate: dateRange.getTo(),
            reportType: dateRange.getPeriodType()
        };

        $.get(url, criteria, function (json) {
            renderGeneralInfo(json.trader);
            renderSportGrid(json.sports);
            $(criteria.reportType == 1 ? "#chkDay" : "#chkMonth").click();
            common.EnableInput();
        })
    });

    $(document)
        .on("click", ".sport-fallback-link", () => showGrid(sportContainer))
        .on("click", ".league-fallback-link", () => showGrid(leagueContainer));

    $("#chkMonth, #chkDay").click(function (e) {
        common.DisableInput();

        var id = e.target.id;

        var url = common.ResolveRootUrl("OSTraderReport/GetChartData");

        var fromDate = moment(dateRange.getFrom());
        var toDate = moment(dateRange.getTo());

        if (id == "chkMonth") {
            fromDate = fromDate.startOf("month");
            toDate = toDate.endOf("month");
        }

        var criteria = {
            fromDate: fromDate.format("YYYY-MM-D"),
            toDate: toDate.format("YYYY-MM-D"),
            reportType: id == "chkMonth" ? 2 : 1
        };

        $.get(url, criteria, function (json) {
            renderChart(json, criteria.reportType);
            common.EnableInput();
        });
    })

    $("#sport-grid").on("click", ".region-link", function (e) {
        common.DisableInput();

        var url = common.ResolveRootUrl("OSTraderReport/GetRegionData");

        var obj = common.getGridData(e.target);

        var criteria = {
            fromDate: dateRange.getFrom(),
            toDate: dateRange.getTo(),
            reportType: dateRange.getPeriodType(),
            sportId: obj.SportId
        };

        $.get(url, criteria, function (json) {
            renderRegionGrid(json, obj);
            common.EnableInput();
        });
    });

    $("#sport-grid").on("click", ".league-link", function (e) {
        common.DisableInput();

        var url = common.ResolveRootUrl("OSTraderReport/GetLeagueData");

        var obj = common.getGridData(e.target);

        var criteria = {
            fromDate: dateRange.getFrom(),
            toDate: dateRange.getTo(),
            reportType: dateRange.getPeriodType(),
            sportId: obj.SportId
        };

        $.get(url, criteria, function (json) {
            renderLeagueGrid(json, obj);
            common.EnableInput();
        });
    });

    $("#league-grid").on("click", ".bettype-link", function (e) {
        common.DisableInput();

        var url = common.ResolveRootUrl("OSTraderReport/GetBettypeData");

        var obj = common.getGridData(e.target);

        var criteria = {
            fromDate: dateRange.getFrom(),
            toDate: dateRange.getTo(),
            reportType: dateRange.getPeriodType(),
            sportId: obj.global.sportId,
            leagueId: obj.LeagueId
        };

        $.get(url, criteria, function (json) {
            renderBettypeGrid(json, obj);
            common.EnableInput();
        });
    });

    function showGrid(container) {
        var containers = [sportContainer, regionContainer, leagueContainer, bettypeContainer];

        containers.filter(c => !c.is(container)).forEach(c => c.addClass("display-none"));

        $(container).removeClass("display-none");
    }

    function renderGeneralInfo(trader) {
        var generalInfo = $("#divGeneralInfo").removeClass("display-none");

        var format = "0,0.00"

        $("#lblTurnOver").text(numeral(trader.Turnover || 0).format(format));

        $("#lblWinLoss").text(numeral(trader.Winlost || 0).format(format));

        $("#lblMargin").text(numeral(trader.Margin || 0).format(format));

        $("#lblSports").text(trader.SportCount);
    }

    function renderChart(data, type) {
        function mixChartOption() {
            return {
                chart: {
                    type: 'scatter',
                    //margin: 65,
                    //marginRight: 65,
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        depth: 75,
                        viewDistance: 25
                    }
                },
                colors: ['#f28f43', '#1aadce', '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#492970', '#77a1e5', '#c42525', '#a6c96a'],
                title: {
                    style: {
                        color: '#5a7dc1',
                        textTransform: 'uppercase',
                        fontSize: '18px'
                    }
                },
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: 5,
                    x: 0,
                    itemMarginTop: -20,
                    itemStyle: {
                        lineHeight: '10px'
                    },
                    layout: 'horizontal'
                },
                tooltip: {
                    hideDelay: 200,
                    shared: false,
                    followPointer: false
                    //useHTML: true
                    //backgroundColor: "rgba(255,255,255,1)"
                },
                xAxis: {
                    //categories: Highcharts.getOptions().lang.shortMonths
                    type: 'category',
                    labels: {
                        rotation: -30,
                        formatter: function () {
                            var text = this.value;
                            var formatted = text.length > 9 ? text.substring(0, 9) + '...' : text;

                            return '<div title="' + text + '">' + formatted + '</div>';
                        },
                        style: {
                            fontSize: '12px',
                            //fontWeight: 'normal',
                            fontFamily: 'Verdana, sans-serif'
                        },
                        useHTML: false
                    }
                },
                yAxis: [{ // Primary yAxis
                    labels: {
                        //format: '{value}',
                        style: {
                            color: '#f28f43'
                        },
                        formatter: function () {
                            return formatAxis(this);
                        }
                    },
                    lineWidth: 1,
                    title: {
                        text: 'TURNOVER',
                        style: {
                            color: '#f28f43'
                        }
                    },
                    opposite: false
                }, { // Secondary yAxis
                    lineWidth: 0.5,
                    title: {
                        text: 'WIN LOSS',
                        style: {
                            color: '#7cb5ec'
                        }
                    },
                    labels: {
                        style: {
                            color: '#7cb5ec'
                        },
                        formatter: function () {
                            return formatAxis(this);
                        }
                    },
                    opposite: true
                }],
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        depth: 35,
                        colors: ['#7cb5ec', '#B22222', '#90ed7d', '#8085e9', '#f7a35c', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
                    },
                    series: {
                        stickyTracking: false,
                        dataLabels: {
                            enabled: false,
                            color: '#E0E0E3',
                            align: 'left',
                            x: 0,
                            y: -5,
                            style: {
                                fontSize: '12px',
                                fontFamily: 'Verdana, sans-serif'
                                //textShadow: '0 0 3px black'
                            }
                        }
                    }
                }
            };
        }

        function formatAxis(data) {
            if (Math.abs(data.value) >= 1000000000) {
                if (data.value % 1000000000 === 0) {
                    return numeral(data.value / 1000000000).format(common.Formats.IntegerFormat) + " Bil";
                }
                else {
                    return numeral(data.value / 1000000000).format(common.Formats.DecimalFormat) + " Bil";
                }
            } else if (Math.abs(data.value) >= 1000000) {
                if (data.value % 1000000 === 0) {
                    return numeral(data.value / 1000000).format(common.Formats.IntegerFormat) + " M";
                }
                else {
                    return numeral(data.value / 1000000).format(common.Formats.DecimalFormat) + " M";
                }
            }
            else if (Math.abs(data.value) >= 1000) {
                if (data.value % 1000 === 0) {
                    return numeral(data.value / 1000).format(common.Formats.IntegerFormat) + " K";
                }
                else {
                    return numeral(data.value / 1000).format(common.Formats.DecimalFormat) + " K";
                }
            } else {
                return data.value;
            }
        }

        var chartData = {
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
            data.forEach(function (item) {
                chartData.Categories.push(moment(item.WLDate).format('DD MMM'));

                chartData.MixData[0].data.push(item.Turnover);
                chartData.MixData[1].data.push(item.WinLost);

                if (item.Turnover < chartData.MixDataMin) {
                    chartData.MixDataMin = item.Turnover;
                }
                if (item.Winlost < chartData.MixDataMin) {
                    chartData.MixDataMin = item.WinLost;
                }
            });
        }
        else {
            data.forEach(function (item) {
                chartData.Categories.push(moment(item.WLDate).format('MMM'));

                chartData.MixData[0].data.push(item.Turnover);
                chartData.MixData[1].data.push(item.WinLost);

                if (item.Turnover < chartData.MixDataMin) {
                    chartData.MixDataMin = item.Turnover;
                }
                if (item.Winlost < chartData.MixDataMin) {
                    chartData.MixDataMin = item.WinLost;
                }
            });
        }

        // turnover&winloss chart
        var mixChartOption = mixChartOption();

        mixChartOption.xAxis.categories = chartData.Categories;
        mixChartOption.title.text = 'WinLoss/Turnover';
        mixChartOption.series = chartData.MixData;
        mixChartOption.chart.options3d.enabled = false;

        if (chartData.MixDataMin < 0) {
            mixChartOption.yAxis[0].min = chartData.MixDataMin;
            mixChartOption.yAxis[1].min = chartData.MixDataMin;
        }

        $("#winloss-container").highcharts(mixChartOption);

        if (chartData.Categories.length > 21) {
            $('.highcharts-xaxis-labels tspan').text('');
        }
    }

    function renderSportGrid(json) {
        function renderRow(data, index) {
            return {
                Columns: [
                    { Name: "No", Value: `<span data-index="${index}">${index + 1}</span>` },
                    { Name: "Sport", Value: data.SportName },
                    { Name: "Leagues", Value: `<span class="league-link link" title="League Performance">${data.NoOfLeague}</span>` },
                    { Name: "Regions", Value: `<span class="region-link link" title="Region Performance">${data.RegionCount}</span>` },
                    { Name: "Turnover", Value: data.Turnover },
                    { Name: "Winloss", Value: data.VWinloss },
                    { Name: "Margin", Value: data.VMargin },
                    { Name: "AvgTurnover", Value: data.AverageVTurnover },
                    { Name: "Point", Value: data.PointMargin },
                ]
            };
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Sport", Width: 240, Name: "Sport", HeaderAlign: "center" },
                { HeaderText: "No. Of Leagues", Width: 100, Name: "Leagues", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Region", Width: 100, Name: "Regions", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Margin", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "Average V.Turnover", Width: 130, Name: "AvgTurnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: "Point Margin", Width: 100, Name: "Point", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
            ];

        var options =
            {
                columns,
                bodyRows: json.map(renderRow),
                gridExpandHeight: 170,
                showTitle: true,
                titleInfo:
                    {
                        text: "Sport Performance",
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges
                },
            };

        $("#sport-grid", sportContainer).fanexGrid(options);

        var titles = [{ class: "sport-fallback-link", value: "Sport Performance" }];

        common.bindDataToFanexGrid("#sport-grid", json, { titles });

        showGrid(sportContainer);
    }

    function renderRegionGrid(json, obj) {
        function renderRow(data, index) {
            return {
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "Region", Value: (data.RegionName || "Unknown") },
                    { Name: "Turnover", Value: data.Turnover },
                    { Name: "Winloss", Value: data.WinLoss },
                    { Name: "Margin", Value: data.Margin },
                    { Name: "Products", Value: data.EventProductCount },
                ]
            };
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Region", Width: 240, Name: "Region", HeaderAlign: "center" },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Margin", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "Event Products", Width: 130, Name: "Products", HeaderAlign: "center", CellAlign: "right", Sort: true },
            ];

        var options =
            {
                columns,
                bodyRows: json.map(renderRow),
                gridExpandHeight: 170,
                showTitle: true,
                titleInfo:
                    {
                        text: `${common.renderTitles(obj.global.titles)} >> ${obj.SportName}`,
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges,
                },
            };

        $("#region-grid", regionContainer).fanexGrid(options);

        showGrid(regionContainer);
    }

    function renderLeagueGrid(json, obj) {
        function renderRow(data, index) {
            return {
                Columns: [
                    { Name: "No", Value: `<span data-index="${index}">${index + 1}</span>` },
                    { Name: "League", Value: data.LeagueName },
                    { Name: "Bettypes", Value: `<span class="bettype-link link" title="Bet Type Detail">${data.NoOfBettype}</span>` },
                    { Name: "Turnover", Value: data.Turnover },
                    { Name: "Winloss", Value: data.VWinLoss },
                    { Name: "Margin", Value: data.VMargin },
                    { Name: "AvgTurnover", Value: data.AverageVTurnover },
                    { Name: "Point", Value: data.PointMargin },
                ]
            };
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "League", Width: 300, Name: "League", HeaderAlign: "center" },
                { HeaderText: "No. Of Bet Type", Width: 100, Name: "Bettypes", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Margin", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "Average V.Turnover", Width: 130, Name: "AvgTurnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: "Point Margin", Width: 100, Name: "Point", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
            ];

        var options =
            {
                columns,
                bodyRows: json.map(renderRow),
                fullHeight: false,
                gridHeight: 320,
                showTitle: true,
                titleInfo:
                    {
                        text: `${common.renderTitles(obj.global.titles)} >> ${obj.SportName}`,
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges,
                },
            };

        var newTitles = Array.from(obj.global.titles);

        newTitles.push({ class: "league-fallback-link", value: obj.SportName });

        common.bindDataToFanexGrid("#league-grid", json, { titles: newTitles, sportId: obj.SportId });

        $("#league-grid", leagueContainer).fanexGrid(options);

        showGrid(leagueContainer);
    }

    function renderBettypeGrid(json, obj) {
        function renderRow(data, index) {
            return {
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "Product", Value: data.BettypeName },
                    { Name: "Turnover", Value: data.Turnover },
                    { Name: "Winloss", Value: data.VWinLoss },
                    { Name: "Margin", Value: data.VMargin },
                    { Name: "AvgTurnover", Value: data.AverageVTurnover },
                    { Name: "Point", Value: data.PointMargin },
                ]
            };
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Product", Width: 240, Name: "Product", HeaderAlign: "center" },
                { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Win Loss", Width: 100, Name: "Winloss", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "V.Margin", Width: 100, Name: "Margin", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true, SortDirection: 'desc' },
                { HeaderText: "Average V.Turnover", Width: 130, Name: "AvgTurnover", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: "Point Margin", Width: 100, Name: "Point", HeaderAlign: "center", CellAlign: "right", FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
            ];

        var options =
            {
                columns,
                bodyRows: json.map(renderRow),
                gridExpandHeight: 150,
                fullHeight: false,
                showTitle: true,
                titleInfo:
                    {
                        text: `${common.renderTitles(obj.global.titles)} >> ${obj.LeagueName || "Unknown"}`,
                    },
                showPager: true,
                pagerOption: {
                    currentPage: 0,
                    itemsPerPage: common.Constants.PageSize,
                    itemsPerPageArray: common.Constants.PagerRanges,
                },
            };

        $("#bettype-grid", bettypeContainer).fanexGrid(options);

        showGrid(bettypeContainer);
    }
}

$(OsTraderReport);