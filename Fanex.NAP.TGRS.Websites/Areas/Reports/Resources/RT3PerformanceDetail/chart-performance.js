Namespace.Register("Fanex.TGRS.RT3PerformanceDetail.ChartPerformance");
Fanex.TGRS.RT3PerformanceDetail.ChartPerformance = function () {
    var $this = this;

    var domElements = {
        divChartContainer: null,
        divChartTurnoverContainer: null,
        divChartWinLossContainer: null,
        divChartMarginContainer: null
    };

    var cacheDOMElements = function () {       
        domElements.divChartContainer = $('#divChartContainer');
        domElements.divChartTurnoverContainer = $('#divChartTurnoverContainer');
        domElements.divChartWinLossContainer = $('#divChartWinLossContainer');
        domElements.divChartMarginContainer = $('#divChartMarginContainer');
    };

    var chartOption = function (name) {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: name
            },
            colors: ['#2191db', '#f28f43', '#9b9fa3'],
            xAxis: {
                categories: [labels.Virtual, labels.Variance, labels.RealTotal8RMWL]
            },
            yAxis: {
                title: {
                    text: ""
                }
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: labels.RT3WithTraderPerformance,
                    data: [
                        {
                            name: "a",
                            y: 5
                        },
                        {
                            name: "b",
                            y: 3
                        },
                        {
                            name: "c",
                            y: 4
                        }
                    ]
                }, {
                    name: labels.RT3NoTraderPerformance,
                    data: [
                        {
                            name: "a",
                            y: 6
                        },
                        {
                            name: "b",
                            y: 2
                        },
                        {
                            name: "c",
                            y: -1
                        }
                    ]
                }, {
                    name: labels.TradingAutomation,
                    data: [
                        {
                            name: "a",
                            y: 1
                        },
                        {
                            name: "b",
                            y: -2
                        },
                        {
                            name: "c",
                            y: 5
                        }
                    ]
                }]
        };
    }

    var getStogeDisplayChart = function () {
        if (typeof (Storage) !== "undefined") {
            var value = localStorage.getItem("StogeDisplaySummaryAndChart");
            return value;
        }
        return "false";
    }  

    $this.Display = function (isShow) {
        var isStoreDisplay = getStogeDisplayChart();
        if (isShow && (isStoreDisplay == null || isStoreDisplay == "true")) {           
            domElements.divChartContainer.show();
        } else {
            domElements.divChartContainer.hide();
        }
    }

    $this.BindData = function (data) {
        var optionsTurnover = chartOption('Turnover');
        var optionsWinLoss = chartOption('Win Loss');
        var optionsMargin = chartOption('Margin');

        domElements.divChartTurnoverContainer.highcharts(optionsTurnover);
        domElements.divChartWinLossContainer.highcharts(optionsWinLoss);
        domElements.divChartMarginContainer.highcharts(optionsMargin);
    }

    $this.InitPage = function () {
        cacheDOMElements();
    }
}