Namespace.Register("Fanex.TGRS.RT3PerformanceDetail.ChartPerformance");
Fanex.TGRS.RT3PerformanceDetail.ChartPerformance = function () {
    var $this = this;

    var domElements = {       
        divChartTurnoverContainer: null,
        divChartWinLossContainer: null,
        divChartMarginContainer: null
    };

    var cacheDOMElements = function () {       
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
                categories: ['Virtual', 'Variance', 'Real Total - Ex.8RM WL']
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
                    name: 'RT3 w. Trader Performance',                    
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
                    name: 'RT3 No Trader Performance',                    
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
                    name: 'TA',                    
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

    $this.DisplayChart = function () {
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