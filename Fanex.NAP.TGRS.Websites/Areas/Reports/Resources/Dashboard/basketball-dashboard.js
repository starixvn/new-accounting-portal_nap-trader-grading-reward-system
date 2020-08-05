$(document).ready(function () {
    var dashboard = new Fanex.TGRS.Reports.BasketballDashboard();
    dashboard.Initialize();
});

Namespace.Register("Fanex.TGRS.Reports.BasketballDashboard");
Fanex.TGRS.Reports.BasketballDashboard = function () {
    var $this = this;

    var domElements = {
        divWinlossContent: null,
        divMarginContent: null,
        divBetcountContent: null,
        divTurnoverContent: null,
        divMatchesCountContent: null
    };

    var cacheDomElements = function () {
        domElements.divWinlossContent = $('#divWinlossContent');
        domElements.divMarginContent = $('#divMarginContent');
        domElements.divBetcountContent = $('#divBetcountContent');
        domElements.divTurnoverContent = $('#divTurnoverContent');
        domElements.divMatchesCountContent = $('#divMatchesCountContent');
    };

    var urls = {
        GetBasketballSummaryInfo: common.ResolveRootUrl('Dashboard/GetBasketballSummaryInfo')
    };

    $this.Initialize = function () {        
        cacheDomElements();
        $("#headline").hide();
        getBasketballSummaryInfo();
    };

    var getBasketballSummaryInfo = function () {
        common.DisableInput();

        var params = {};
        params.FromDate = '2020-04-01';
        params.ToDate = '2020-07-01';
        params.ReportType = 2;

        $.ajax({
            type: 'POST',
            url: urls.GetBasketballSummaryInfo,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (result) {
                if (result) {
                    bindData(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
                common.EnableInput();
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var bindData = function (data) {        
        var winlossOptions = generateLineChartOptionsNew(data.WinLossList, data.WinLossComparisonList);
        domElements.divWinlossContent.highcharts(winlossOptions);

        var marginOptions = generateBarChartOptionsNew(data.MarginList, data.MarginComparisonList);
        domElements.divMarginContent.highcharts(marginOptions);

        var betCountOptions = generateBarChartOptionsNew(data.BetCountList, data.BetCountComparisonList);
        domElements.divBetcountContent.highcharts(betCountOptions);

        var turnoverOptions = generateBarChartOptionsNew(data.TurnoverList, data.TurnoverComparisonList);
        domElements.divTurnoverContent.highcharts(turnoverOptions);

        var matchCountOptions = generateLineChartOptionsNew(data.MatchCountList, data.MatchCountComparisonList);
        domElements.divMatchesCountContent.highcharts(matchCountOptions);
    };
    
    var generateBarChartOptions = function (chartName) {
        return {
            chart: {
                type: 'column',
                height: 240,
                width: 400
            },
            title: {
                text: chartName
            },
            xAxis: {
                categories: ["name 1", "name 2"]
            },
            yAxis: {
                title: { text: null },
                labels: {
                    formatter: function () {
                        return this.value + ' %';
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'horizontal',
                align: 'top',
                verticalAlign: 'top'
            },
            series: [
                {
                    data: [7.0, 6.9, 9.5, 10.0, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    zones: [{
                        value: 10,
                        color: 'blue'
                    }, {
                        color: 'red'
                    }]
                },
                {
                    data: [7.0, 6.9, 9.5, 10.0, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    zones: [{
                        value: 10,
                        color: 'blue'
                    }, {
                        color: 'red'
                    }]
                }
            ]
        };
    };

    var generateBarChartOptionsNew = function (data, dataComparison) {
        var series = [];
        var names = [];
        var values = [];
        var valuesComparison = [];

        if (dataComparison && dataComparison.length > 0) {
            var groupName = '';
            dataComparison.map(function (x) {
                names.push(x.Name);
                valuesComparison.push(x.Value);
                values.push(null);
                groupName = x.GroupName;
            });

            series.push(
                {
                    data: valuesComparison,
                    name: groupName,
                    zoneAxis: 'x',
                    dashStyle: 'Solid',
                    color: 'blue'
                });
        }

        if (data && data.length > 0) {
            groupName = '';
            data.map(function (x) {
                names.push(x.Name);
                values.push(x.Value);
                groupName = x.GroupName;
            });

            series.push(
                {
                    data: values,
                    name: groupName,
                    zoneAxis: 'x',
                    dashStyle: 'Solid',
                    color: 'yellow'
                });
        }

        return {
            chart: {
                type: 'column',
                height: 240,
                width: 400
            },  
            title: {
                text: null
            },
            xAxis: {
                categories: names
            },
            yAxis: {
                title: { text: null },
                labels: {
                    formatter: function () {
                        return this.value + ' %';
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'horizontal',
                align: 'top',
                verticalAlign: 'top'
            },                       
            series: series
        };
    };

    var generateLineChartOptions = function (chartName) {
        return {
            chart: {
                height: 240,
                width: 400
            },
            title: {
                text: chartName
            },
            yAxis: {
                title: { text: null }
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'horizontal',
                align: 'top',
                verticalAlign: 'top'
            },
            series: [
                {
                    data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
                    zoneAxis: 'x',
                    zones: [
                        {
                            value: 5,
                            color: 'blue'
                        }
                        , {
                            dashStyle: 'Solid',
                            color: 'yellow'
                        }],
                    dashStyle: 'ShortDot'
                },
                {
                    data: [3, 5, 100, 111, 132, 150, 80, 85, 92, 105, 155, 160],
                    zoneAxis: 'x',
                    zones: [{
                        value: 5,
                        color: 'blue'
                    }, {
                        dashStyle: 'Solid',
                        color: 'yellow'
                    }],
                    dashStyle: 'ShortDot'
                }
            ]
        };
    };

    var generateLineChartOptionsNew = function (data, dataComparison) {
        var series = [];       
        var names = [];
        var values = [];
        var valuesComparison = [];

        if (dataComparison && dataComparison.length > 0) {  
            var groupName = '';
            dataComparison.map(function (x) {                
                names.push(x.Name);
                valuesComparison.push(x.Value);
                values.push(null);
                groupName = x.GroupName;
            });
            
            series.push(
                {
                    data: valuesComparison,
                    name: groupName,
                    zoneAxis: 'x',
                    dashStyle: 'Solid',
                    color: 'blue'
                });
        }

        if (data && data.length > 0) {   
            groupName = '';
            data.map(function (x) {
                names.push(x.Name);
                values.push(x.Value);
                groupName = x.GroupName;
            });
            
            series.push(
                {
                    data: values,
                    name: groupName,
                    zoneAxis: 'x',
                    dashStyle: 'Solid',
                    color: 'yellow'
                });
        }

        return {
            chart: {
                height: 240,
                width: 400
            },
            title: {
                text: null
            },
            yAxis: {
                title: { text: null }
            },
            xAxis: {
                categories: names
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'horizontal',
                align: 'top',
                verticalAlign: 'top'
            },            
            series: series
        };
    };
};