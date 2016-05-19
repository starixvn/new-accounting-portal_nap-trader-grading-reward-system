$(document).ready(function () {
    var TraderReport = new Fanex.TGRS.Reports.Trader();
    TraderReport.Initialize();
    $('#switchChart').hide();
});

Namespace.Register("Fanex.TGRS.Reports.Trader");
Fanex.TGRS.Reports.Trader = function () {
    var $this = this;
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
            getReports();
        });
    };

    function getReports() {
        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: common.ResolveRootUrl('Reports/Trader/GetReports'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderReports(result, filterParameters.ReportType);
                    if (filterParameters.ReportType === 1) {
                        $('input:radio[id=chkDay]').prop('checked', true)
                    }
                    else
                    {
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
    };

    var renderBetTypePerformance = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: 'Bet Type', Width: 350, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.BetTypePerformance
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColBetType', Value: item.TypeName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.BetTypePerformanceGrid.fanexGrid(gridOptions);
    };

    var renderLeaguesPerformance = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.LeaguesPerformance
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColLeague', Value: item.LeagueName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.LeaguesPerformanceGrid.fanexGrid(gridOptions);
    }

    $this.Initialize = function () {
        cacheDOMElements();
        ChartOptions = new Fanex.TGRS.TraderChart();
        initPageFields();
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
                });
            }
            else {
                $.each(data, function (index, item) {
                    chartData.Categories.push(moment(item.WLDate).format('MMM'));
                    chartData.MixData[0].data.push(item.Turnover);
                    chartData.MixData[1].data.push(item.Winlost);
                });
            }

            // turnover&winloss chart
            var mixChartOption = ChartOptions.MixChartOption();
            mixChartOption.xAxis.categories = chartData.Categories;
            mixChartOption.title.text = 'WinLoss/Turnover';
            mixChartOption.series = chartData.MixData;
            mixChartOption.chart.options3d.enabled = false;
            //if (cachedChartData.MixDataMin < 0) {
            //    mixChartOption.yAxis[0].min = cachedChartData.MixDataMin;
            //    mixChartOption.yAxis[1].min = cachedChartData.MixDataMin;
            //}
            domElements.teamWinlossContainer.highcharts(mixChartOption);
        }
    }
}