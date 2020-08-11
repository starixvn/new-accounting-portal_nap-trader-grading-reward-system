$(document).ready(function () {
    var dashboard = new Fanex.TGRS.Reports.BasketballDashboard();
    dashboard.Initialize();
});

Namespace.Register("Fanex.TGRS.Reports.BasketballDashboard");
Fanex.TGRS.Reports.BasketballDashboard = function () {
    var $this = this;

    var domElements = {
        divRangeMonthWrapper: null,
        divRangeMonth: null,        
        divPeriodSelected: null,
        btnGenerate: null,
        divWinlossContent: null,
        divMarginContent: null,
        divBetcountContent: null,
        divTurnoverContent: null,
        divMatchesCountContent: null,
        divTraderContent: null,
        divLeagueGroupContent: null
    };

    var cacheDomElements = function () {
        domElements.divRangeMonthWrapper = $('#divRangeMonthWrapper');
        domElements.divRangeMonth = $('#divRangeMonth');
        domElements.divPeriodSelected = $('#divPeriodSelected');
        domElements.btnGenerate = $('#btnGenerate');
        domElements.divWinlossContent = $('#divWinlossContent');        
        domElements.divMarginContent = $('#divMarginContent');
        domElements.divBetcountContent = $('#divBetcountContent');
        domElements.divTurnoverContent = $('#divTurnoverContent');
        domElements.divMatchesCountContent = $('#divMatchesCountContent');
        domElements.divTraderContent = $('#divTraderContent');
        domElements.divLeagueGroupContent = $('#divLeagueGroupContent');
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        ReportType: null
    };

    var urls = {
        GetBasketballSummaryInfo: common.ResolveRootUrl('Dashboard/GetBasketballSummaryInfo'),
        GetBasketballTraderSummary: common.ResolveRootUrl('Dashboard/GetBasketballTraderSummary'),
        GetBasketballLeagueGroupSummary: common.ResolveRootUrl('Dashboard/GetBasketballLeagueGroupSummary')
    };

    $this.Initialize = function () {        
        cacheDomElements();
        initializeFields();               
    };

    var initializeFields = function () {
        $("#headline").hide();
        initializeMonthPickers();

        parameters.FromDate = domElements.divRangeMonth.getFrom();
        parameters.ToDate = domElements.divRangeMonth.getTo();
        parameters.ReportType = 2;

        getSummaryGeneralInfo();
        getTraderSummary();
        getLeagueGroupSummary();                   

        domElements.btnGenerate.on('click', function () {
            parameters.FromDate = domElements.divRangeMonth.getFrom();
            parameters.ToDate = domElements.divRangeMonth.getTo();
            parameters.ReportType = domElements.divPeriodSelected.val() === 0 ? 1 : 2;

            getSummaryGeneralInfo();
            getTraderSummary();
            getLeagueGroupSummary();
        });

        $('.view-chart').on('click', viewChartOnClick);
    };

    var initializeMonthPickers = function () {
        domElements.divRangeMonth = domElements.divRangeMonth.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'lbl-range-month'
        });

        domElements.ddlPeriodType = domElements.divRangeMonth.find('#ddlPeriodType');        
        domElements.ddlPeriodType.val(2).change();

        let instance = domElements.divRangeMonth.find("span:contains(" + labels.Date + ")");
        if (instance.length > 0) {
            instance.text(labels.Month);
        }

        $('.lbl-range-month').hide();
        $('.lbl-range-month').next().hide();

        domElements.divPeriodSelected.on('change', function () {
            let $this = $(this);
            let value = $this.val();
            if (value === "0")
                domElements.divRangeMonthWrapper.removeClass('hidden');
            else
                domElements.divRangeMonthWrapper.addClass('hidden');
        });       
    };

    var viewChartOnClick = function () {
        let $this = $(this);
        let name = $this.attr('name');
        let type = $this.attr('type');

        if (type === 'line') {
            let $prev = $this.prev();
            $prev.removeClass('icon-chart-active').addClass('icon-chart');
            $prev.find('span').removeClass('icon-chart-bar-active').addClass('icon-chart-bar');

            $this.removeClass('icon-chart').addClass('icon-chart-active');
            $this.find('span').removeClass('icon-chart-line').addClass('icon-chart-line-active');

        } else {
            let $prev = $this.next();
            $prev.removeClass('icon-chart-active').addClass('icon-chart');
            $prev.find('span').removeClass('icon-chart-line-active').addClass('icon-chart-line');

            $this.removeClass('icon-chart').addClass('icon-chart-active');
            $this.find('span').removeClass('').addClass('');
            $this.find('span').removeClass('icon-chart-bar').addClass('icon-chart-bar-active');
        }

        reDrawChartByType(name, type);
    };

    var getTraderSummary = function () {
        $.ajax({
            type: 'POST',
            url: urls.GetBasketballTraderSummary,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                if (result) {
                    bindTraderSummaryData(result);
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

    var bindTraderSummaryData = function (data) {
        if (data && data.length > 0) {
            let html = '';
            let divFormat = '<div class="border-bottom">';
            divFormat += '<span class="column-left">{0}</span>';
            divFormat += '<span class="column-right {1}">{2}</span></div>';
            
            data.map(function (x) {
                let formatMargin = x.Margin < 0 ? 'format-negative' : '';
                html += divFormat.format(x.TraderName, formatMargin, x.Margin);
            });

            domElements.divTraderContent.html(html);
        }
    };

    var getLeagueGroupSummary = function () {
        $.ajax({
            type: 'POST',
            url: urls.GetBasketballLeagueGroupSummary,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                if (result) {
                    bindLeagueGroupSummaryData(result);
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

    var bindLeagueGroupSummaryData = function (data) {
        if (data && data.length > 0) {
            let html = '';
            let divFormat = '<div class="border-bottom">';
            divFormat += '<span class="column-left">{0}</span>';
            divFormat += '<span class="column-right {1}">{2}</span></div>';

            data.map(function (x) {
                let formatMargin = x.Margin < 0 ? 'format-negative' : '';
                html += divFormat.format(x.GroupName, formatMargin, x.Margin);
            });

            domElements.divLeagueGroupContent.html(html);
        }
    };

    var getSummaryGeneralInfo = function () {
        common.DisableInput();              

        $.ajax({
            type: 'POST',
            url: urls.GetBasketballSummaryInfo,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                if (result) {
                    bindSummaryGeneralData(result);
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

    var bindSummaryGeneralData = function (data) {        
        var winlossOptions = generateLineChartOptions(data.WinLossList, data.WinLossComparisonList);
        domElements.divWinlossContent.highcharts(winlossOptions);

        var marginOptions = generateLineChartOptions(data.MarginList, data.MarginComparisonList);
        domElements.divMarginContent.highcharts(marginOptions);

        var betCountOptions = generateLineChartOptions(data.BetCountList, data.BetCountComparisonList);
        domElements.divBetcountContent.highcharts(betCountOptions);

        var turnoverOptions = generateLineChartOptions(data.TurnoverList, data.TurnoverComparisonList);
        domElements.divTurnoverContent.highcharts(turnoverOptions);

        var matchCountOptions = generateLineChartOptions(data.MatchCountList, data.MatchCountComparisonList);
        domElements.divMatchesCountContent.highcharts(matchCountOptions);
    };

    var generateLineChartOptions = function (data, dataComparison) {
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
                    color: '#3fd0da'
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
                    color: '#5a7dc1'
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
                align: 'top left',
                verticalAlign: 'top left',
                itemMarginTop: -15,
                enabled: false
            },
            series: series
        };
    };   


    var generateBarChartOptions = function (data, dataComparison) {
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
                    color: '#3fd0da'
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
                    color: '#5a7dc1'
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
                verticalAlign: 'top',
                enabled: false
            },                       
            series: series
        };
    };
        
    var reDrawChartByType = function (name, type) {
        $.ajax({
            type: 'POST',
            url: urls.GetBasketballSummaryInfo,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                if (result) {
                    reDrawChart(result, name, type);
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

    var reDrawChart = function (data, name, type) {
        var options = '';

        switch (name) {
            case 'winloss':
                options = type === 'line'
                    ? generateLineChartOptions(data.WinLossList, data.WinLossComparisonList)
                    : generateBarChartOptions(data.WinLossList, data.WinLossComparisonList);
                domElements.divWinlossContent.highcharts(options);
                break;
            case 'margin':
                options = type === 'line'
                    ? generateLineChartOptions(data.MarginList, data.MarginComparisonList)
                    : generateBarChartOptions(data.MarginList, data.MarginComparisonList);
                domElements.divMarginContent.highcharts(options);
                break;
            case 'betcount':
                options = type === 'line'
                    ? generateLineChartOptions(data.BetCountList, data.BetCountComparisonList)
                    : generateBarChartOptions(data.BetCountList, data.BetCountComparisonList);
                domElements.divBetcountContent.highcharts(options);
                break;
            case 'turnover':
                options = type === 'line'
                    ? generateLineChartOptions(data.TurnoverList, data.TurnoverComparisonList)
                    : generateBarChartOptions(data.TurnoverList, data.TurnoverComparisonList);
                domElements.divTurnoverContent.highcharts(options);
                break;
            case 'matchcount':
                options = type === 'line'
                    ? generateLineChartOptions(data.MatchCountList, data.MatchCountComparisonList)
                    : generateBarChartOptions(data.MatchCountList, data.MatchCountComparisonList);
                domElements.divMatchesCountContent.highcharts(options);
                break;
            default:
                break;
        }
    };

    var generateBarChartOptionsOld = function (chartName) {
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
                        color: '#5a7dc1'
                    }, {
                        color: '#3fd0da'
                    }]
                },
                {
                    data: [7.0, 6.9, 9.5, 10.0, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    zones: [{
                        value: 10,
                        color: '#5a7dc1'
                    }, {
                        color: '#3fd0da'
                    }]
                }
            ]
        };
    };

    var generateLineChartOptionsOld = function (chartName) {
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
                            color: '#5a7dc1'
                        }
                        , {
                            dashStyle: 'Solid',
                            color: '#3fd0da'
                        }],
                    dashStyle: 'ShortDot'
                },
                {
                    data: [3, 5, 100, 111, 132, 150, 80, 85, 92, 105, 155, 160],
                    zoneAxis: 'x',
                    zones: [{
                        value: 5,
                        color: '#5a7dc1'
                    }, {
                        dashStyle: 'Solid',
                        color: '#3fd0da'
                    }],
                    dashStyle: 'ShortDot'
                }
            ]
        };
    };

};
