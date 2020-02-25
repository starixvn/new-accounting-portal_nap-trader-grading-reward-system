Namespace.Register("Fanex.TGRS.AutomationTradingPerformance.ChartPerformance");
Fanex.TGRS.AutomationTradingPerformance.ChartPerformance = function () {
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

    var chartOptions = function (chartName, rt3WithTraderItems, rt3NoTraderItems, rt3TradingAutoItems) {
        return {
            chart: {
                type: 'column',
                height: 415,
                width: 619
            },         
            title: {
                text: chartName
            },
            colors: ['#2191db', '#f28f43', '#9b9fa3'],
            xAxis: {
                categories: [labels.Virtual, labels.Variance, labels.RealTotal8RMWL]
            },
            yAxis: {
                title: { text: null },
                labels: {
                    formatter: function () {
                        return this.value + ' %'
                    }
                },
            },          
            plotOptions: {                
                series: {                
                    dataLabels: {
                        enabled: true,                       
                        format: '{point.y}%',
                        style: {
                            fontSize: '8px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: labels.RT3WithTraderPerformance,
                    data: rt3WithTraderItems                    
                }, {
                    name: labels.RT3NoTraderPerformance,
                    data: rt3NoTraderItems                    
                }, {
                    name: labels.TradingAutomation,
                    data: rt3TradingAutoItems                   
                }]
        };
    }

    var displayChart = function(isShow) {
        var isStoreDisplay = getStogeDisplayChart();
        if (isShow && (isStoreDisplay == null || isStoreDisplay == "true")) {
            domElements.divChartContainer.show();
        } else {
            domElements.divChartContainer.hide();
        }
    }

    var getStogeDisplayChart = function () {
        if (typeof (Storage) !== "undefined") {
            var value = localStorage.getItem("StogeDisplaySummaryAndChart");
            return value;
        }
        return "false";
    }  

    $this.Display = function (isShow) {
        displayChart(isShow);
    }

    $this.BindData = function (data) {
        var turnover = data.ChartTurnover;
        var winloss = data.ChartWinLoss;
        var margin = data.ChartMargin;

        var optionsTurnover = chartOptions(labels.Turnover, turnover.RT3WithTraderList, turnover.RT3NoTraderList, turnover.TradingAutomationList);
        var optionsWinLoss = chartOptions(labels.WinLoss, winloss.RT3WithTraderList, winloss.RT3NoTraderList, winloss.TradingAutomationList);
        var optionsMargin = chartOptions(labels.MarginRT3, margin.RT3WithTraderList, margin.RT3NoTraderList, margin.TradingAutomationList);

        domElements.divChartTurnoverContainer.highcharts(optionsTurnover);
        domElements.divChartWinLossContainer.highcharts(optionsWinLoss);
        domElements.divChartMarginContainer.highcharts(optionsMargin);
    }

    $this.InitPage = function () {
        cacheDOMElements();

        displayChart(false);
    }
}