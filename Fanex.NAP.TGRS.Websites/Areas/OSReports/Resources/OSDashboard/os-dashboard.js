$(document).ready(function () {
    var dashboard = new Fanex.TGRS.Reports.OSDashboard();
    dashboard.Initialize();
});

Namespace.Register("Fanex.TGRS.Reports.OSDashboard");
Fanex.TGRS.Reports.OSDashboard = function () {
    var $this = this;
    var dataChart = null;

    var domElements = {
        ddlSportType: null,
        divRangeMonthWrapper: null,
        divRangeMonth: null,
        divPeriodSelected: null,
        btnGenerate: null,
        divWinlossContent: null,
        divMarginContent: null,
        divBetcountContent: null,
        divTurnoverContent: null,
        divMarketCountContent: null,
        divTraderContent: null,
        divLeagueGroupContent: null,
        inputWinLossAverage: null,
        inputMarginAverage: null,
        inputTurnoverAverage: null,
        inputBetCountAverage: null,
        inputMarketCountAverage: null,
        chkSoccer: null,
        chkOS: null,
        divWinLossLegend: null,
        divMarginLegend: null,
        divBetCountLegend: null,
        divTurnoverLegend: null,
        divMarketCountLegend: null,
        divWinLossAverage: null,
        divMarginAverage: null,
        divBetCountAverage: null,
        divTurnoverAverage: null,
        divMarketCountAverage: null,
        labelSportLeague: null,
        spanSportLeague: null
    };

    var cacheDomElements = function () {
        domElements.ddlSportType = $('#ddlSportType');
        domElements.divRangeMonthWrapper = $('#divRangeMonthWrapper');
        domElements.divPeriodSelected = $('#divPeriodSelected');
        domElements.divRangeMonth = $('#divRangeMonth');
        domElements.btnGenerate = $('#btnGenerate');
        domElements.divWinlossContent = $('#divWinlossContent');
        domElements.divMarginContent = $('#divMarginContent');
        domElements.divBetcountContent = $('#divBetcountContent');
        domElements.divTurnoverContent = $('#divTurnoverContent');
        domElements.divMarketCountContent = $('#divMarketCountContent');
        domElements.divTraderContent = $('#divTraderContent');
        domElements.divSportLeagueContent = $('#divSportLeagueContent');
        domElements.inputWinLossAverage = $('#inputWinLossAverage');
        domElements.inputMarginAverage = $('#inputMarginAverage');
        domElements.inputTurnoverAverage = $('#inputTurnoverAverage');
        domElements.inputBetCountAverage = $('#inputBetCountAverage');
        domElements.inputMarketCountAverage = $('#inputMarketCountAverage');
        domElements.chkSoccer = $('#chkSoccer');
        domElements.chkOS = $('#chkOS');
        domElements.divWinLossLegend = $('#divWinLossLegend');
        domElements.divMarginLegend = $('#divMarginLegend');
        domElements.divBetCountLegend = $('#divBetCountLegend');
        domElements.divTurnoverLegend = $('#divTurnoverLegend');
        domElements.divMarketCountLegend = $('#divMarketCountLegend');
        domElements.divWinLossAverage = $('#divWinLossAverage');
        domElements.divMarginAverage = $('#divMarginAverage');
        domElements.divBetCountAverage = $('#divBetCountAverage');
        domElements.divTurnoverAverage = $('#divTurnoverAverage');
        domElements.divMarketCountAverage = $('#divMarketCountAverage');
        domElements.labelSportLeague = $('#labelSportLeague');
        domElements.spanSportLeague = $('#spanSportLeague');
    };

    var parameters = {
        SportIds: null,
        ReportType: null,
        FromDate: null,
        ToDate: null        
    };

    var urls = {
        GetDate: common.ResolveRootUrl('Dashboard/GetDate'),
        GetOSTraderSummary: common.ResolveRootUrl('OSDashboard/GetOSTraderSummary'),
        GetOSSportSummary: common.ResolveRootUrl('OSDashboard/GetOSSportSummary'),
        GetOSLeagueSummary: common.ResolveRootUrl('OSDashboard/GetOSLeagueSummary'),
        GetOSSummaryInfo: common.ResolveRootUrl('OSDashboard/GetOSSummaryInfo')
    };

    var legendColors = [
        { item: 'cricle-1', color: '#f2994a', text: '' },
        { item: 'cricle-2', color: '#3fd0da', text: '' },
        { item: 'cricle-3', color: '#5a7dc1', text: '' }
    ];

    $this.Initialize = function () {
        cacheDomElements();
        initializeFields();

        $('.view-chart').on('click', viewChartOnClick);

        domElements.inputWinLossAverage.on('click', function () {
            showAverageOnClick(domElements.divWinlossContent, $(this));
        });        

        domElements.inputMarginAverage.on('click', function () {
            showAverageOnClick(domElements.divMarginContent, $(this));
        });       

        domElements.inputTurnoverAverage.on('click', function () {
            showAverageOnClick(domElements.divTurnoverContent, $(this));
        });        

        domElements.inputBetCountAverage.on('click', function () {
            showAverageOnClick(domElements.divBetcountContent, $(this));
        });       

        if (domElements.chkSoccer !== null) {
            domElements.chkSoccer.on('change', function () {
                window.location = common.ResolveRootUrl("Reports/Dashboard");
            });
        }

        if ($('#chkBasketBall') !== null) {
            $('#chkBasketBall').on('change', function () {
                window.location = common.ResolveRootUrl("OSReports/OSDashboard/BasketBallDashboard");
            });
        }
    };

    var initializeFields = function () {
        $("#headline").hide();

        domElements.ddlSportType.multiselect({
            selectedList: 2,
            minWidth: 150,
            height: 200,
            allSelectedText: "All Sport"
        }).multiselectfilter({ width: 80 }).change(function () {
            validator.ClearError(domElements.ddlSportType.next());
        });

        initializeMonthPickers();

        var selectedSportTypes = domElements.ddlSportType.val();

        parameters.SportIds = selectedSportTypes !== null ? selectedSportTypes.join(',') : null,
        parameters.FromDate = domElements.divRangeMonth.getFrom();
        parameters.ToDate = domElements.divRangeMonth.getTo(); 
        parameters.DayType = domElements.divPeriodSelected.val();
        parameters.ReportType = 1;        

        getSummaryGeneralInfo();
        getTraderSummary();
        getSportLeagueSummary();               

        domElements.btnGenerate.on('click', function () {
            var selectedSportTypes = domElements.ddlSportType.val();
            parameters.SportIds = selectedSportTypes !== null ? selectedSportTypes.join(',') : null,
            parameters.FromDate = domElements.divRangeMonth.getFrom();
            parameters.ToDate = domElements.divRangeMonth.getTo();
            parameters.DayType = domElements.divPeriodSelected.val();
            parameters.ReportType = parameters.DayType === "0" ? 2 : 1;            

            getSummaryGeneralInfo();
            getTraderSummary();
            getSportLeagueSummary();
        });
    };

    var initializeMonthPickers = function () {
        domElements.divRangeMonth = domElements.divRangeMonth.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultToDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'lbl-range-month'
        });

        $('.lbl-range-month').hide();
        $('.lbl-range-month').next().hide();
        $('#dpkFromDate').off('focus');
        $('#dpkToDate').off('focus');

        domElements.divPeriodSelected.on('change', function () {
            let $this = $(this);
            let value = $this.val();
            domElements.ddlPeriodType = domElements.divRangeMonth.find('#ddlPeriodType');
            let params = {};
            params.days = parseInt(value);

            if (value === "0") {
                domElements.ddlPeriodType.val(2).change();
            } else {
                domElements.ddlPeriodType.val(1).change();

                $.ajax({
                    type: 'POST',
                    url: urls.GetDate,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(params),
                    success: function (result) {

                        if (result) {                            
                            $('#dpkFromDate').datepicker("setDate", result.FromDate);
                            $('#dpkToDate').datepicker("setDate", result.ToDate);
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
            }
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
            url: urls.GetOSTraderSummary,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            beforeSend: function () {
                domElements.divTraderContent.addClass('loading');
                domElements.divTraderContent.html('');
            },
            success: function (result) {
                if (result) {
                    bindTraderSummaryData(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
                common.EnableInput();
                domElements.divTraderContent.removeClass('loading');
            },
            complete: function () {
                common.EnableInput();
                domElements.divTraderContent.removeClass('loading');
            }
        });
    };

    var bindTraderSummaryData = function (data) {
        let html = '';

        if (data && data.length > 0) {
            let divFormat = '<div class="border-bottom">';
            divFormat += '<span class="column-left">{0}</span>';
            divFormat += '<span class="column-right {1}">{2}</span></div>';

            data.map(function (x) {
                let formatMargin = x.Margin < 0 ? 'format-negative' : '';
                html += divFormat.format(x.TraderName, formatMargin, x.Margin);
            });
        }

        domElements.divTraderContent.html(html);
    };

    var getSportLeagueSummary = function () {      
        let urlSportLeague = urls.GetOSLeagueSummary;
        let selectedSportTypes = domElements.ddlSportType.val();
        if (selectedSportTypes !== null && selectedSportTypes.length > 1) {
            urlSportLeague = urls.GetOSSportSummary;
            domElements.labelSportLeague.text(labels.SportPerformance);
            domElements.spanSportLeague.text(labels.Sport);
        } else {
            domElements.labelSportLeague.text(labels.LeaguePerformance);
            domElements.spanSportLeague.text(labels.League);
        }        

        $.ajax({
            type: 'POST',
            url: urlSportLeague,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            beforeSend: function () {
                domElements.divSportLeagueContent.addClass('loading');
                domElements.divSportLeagueContent.html('');
            },
            success: function (result) {
                if (result) {
                    bindSportLeagueSummaryData(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
                common.EnableInput();
                domElements.divSportLeagueContent.removeClass('loading');
            },
            complete: function () {
                common.EnableInput();
                domElements.divSportLeagueContent.removeClass('loading');
            }
        });
    };

    var bindSportLeagueSummaryData = function (data) {
        let html = '';

        if (data && data.length > 0) {
            let divFormat = '<div class="border-bottom">';
            divFormat += '<span class="column-left">{0}</span>';
            divFormat += '<span class="column-right {1}">{2}</span></div>';

            data.map(function (x) {
                let formatMargin = x.Margin < 0 ? 'format-negative' : '';
                html += divFormat.format(x.Name, formatMargin, x.Margin);
            });
        }

        domElements.divSportLeagueContent.html(html);
    };

    var getSummaryGeneralInfo = function () {
        common.DisableInput();

        $.ajax({
            type: 'POST',
            url: urls.GetOSSummaryInfo,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                if (result) {
                    showLegends(result);
                    bindSummaryGeneralData(result);

                    showAverageOnClick(domElements.divWinlossContent, domElements.inputWinLossAverage);
                    showAverageOnClick(domElements.divMarginContent, domElements.inputMarginAverage);
                    showAverageOnClick(domElements.divTurnoverContent, domElements.inputTurnoverAverage);
                    showAverageOnClick(domElements.divBetcountContent, domElements.inputBetCountAverage);                    
                }
                dataChart = result;
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
        var winlossOptions = generateLineChartOptions(data.WinLossList
            , data.WinLossComparisonList
            , data.WinLossCrossYearList
            , data.WinLossCrossYearComparisonList
            , data.WinLossAverage
            , data.WinLossAverageComparison);
        domElements.divWinlossContent.highcharts(winlossOptions);

        var marginOptions = generateLineChartOptions(data.MarginList
            , data.MarginComparisonList
            , data.MarginCrossYearList
            , data.MarginCrossYearComparisonList
            , data.MarginAverage
            , data.MarginAverageComparison);
        domElements.divMarginContent.highcharts(marginOptions);

        var betCountOptions = generateLineChartOptions(data.BetCountList
            , data.BetCountComparisonList
            , data.BetCountCrossYearList
            , data.BetCountCrossComparisonList
            , data.BetCountAverage
            , data.BetCountAverageComparison);
        domElements.divBetcountContent.highcharts(betCountOptions);

        var turnoverOptions = generateLineChartOptions(data.TurnoverList
            , data.TurnoverComparisonList
            , data.TurnoverCrossYearList
            , data.TurnoverCrossYearComparisonList
            , data.TurnoverAverage
            , data.TurnoverAverageComparison);
        domElements.divTurnoverContent.highcharts(turnoverOptions);

        domElements.divMarketCountContent.css('height', domElements.divTurnoverContent.height());

        //var marketOptions = generateLineChartOptions(data.TurnoverList
        //    , data.MarketComparisonList
        //    , data.MarketCrossYearList
        //    , data.MarketCrossYearComparisonList
        //    , data.MarketAverage
        //    , data.MarketAverageComparison);
        //domElements.divMarketCountContent.highcharts(marketOptions);
    };  

    var showLegends = function (data) {
        var div = '';
        if (data.WinLossList || data.WinLossComparisonList || data.WinLossCrossYearList || data.WinLossCrossYearComparisonList) {
            var i = 4 - data.LegendList.length;
            data.LegendList.map(function (x) {
                div += '<span class="legend-item cricle-' + i + '">' + x + '</span>';

                legendColors.forEach(function (y) {
                    if (y.item === 'cricle-' + i) {
                        y.text = x;
                    }
                });

                i = i + 1;
            });
        }
        domElements.divWinLossLegend.html(div);
        domElements.divMarginLegend.html(div);
        domElements.divTurnoverLegend.html(div);
        domElements.divBetCountLegend.html(div);        

        if (div !== '') {
            domElements.divWinLossAverage.removeClass('hidden');
            domElements.divMarginAverage.removeClass('hidden');
            domElements.divTurnoverAverage.removeClass('hidden');
            domElements.divBetCountAverage.removeClass('hidden');            
        } else {
            domElements.divWinLossAverage.addClass('hidden');
            domElements.divMarginAverage.addClass('hidden');
            domElements.divTurnoverAverage.addClass('hidden');
            domElements.divBetCountAverage.addClass('hidden');            
        }
    };

    var generateSeriesOptions = function (data, dataComparison, dataCrossYear, dataCrossYearComparison) {
        let series = [];
        let values = [];
        let valuesComparison = [];
        let groupName = '';
        let groupNameDash = '';
        let lengthDash = 0;

        if (dataCrossYearComparison && dataCrossYearComparison.length > 0) {
            groupNameDash = '';
            dataCrossYearComparison.map(function (x) {
                valuesComparison.push(x.Value);
                groupNameDash = x.GroupName;
            });
            lengthDash = dataCrossYearComparison.length;
        }

        if (dataComparison && dataComparison.length > 0) {
            groupName = '';
            dataComparison.map(function (x) {
                valuesComparison.push(x.Value);
                groupName = x.GroupName;
            });

            series.push(
                {
                    data: valuesComparison,
                    name: groupName,
                    zoneAxis: 'x',
                    zones: [
                        {
                            value: lengthDash,
                            color: '#f2994a',
                            name: groupNameDash
                        }
                        , {
                            dashStyle: 'ShortDot',
                            color: '#3fd0da',
                            name: groupName
                        }],
                    dashStyle: 'ShortDot'
                });
        }

        if (dataCrossYear && dataCrossYear.length > 0) {
            groupNameDash = '';
            dataCrossYear.map(function (x) {
                values.push(x.Value);
                groupNameDash = x.GroupName;
            });
            lengthDash = dataCrossYear.length;
        }

        if (data && data.length > 0) {
            groupName = '';
            data.map(function (x) {
                values.push(x.Value);
                groupName = x.GroupName;
            });

            series.push(
                {
                    data: values,
                    name: groupName,
                    zoneAxis: 'x',
                    zones: [{
                        value: lengthDash,
                        color: '#3fd0da',
                        name: groupNameDash
                    }, {
                        dashStyle: 'Solid',
                        color: '#5a7dc1',
                        name: groupName
                    }],
                    dashStyle: 'Solid'
                });
        }

        return series;
    };

    var generateCategoriesOptions = function (data, dataComparison, dataCrossYear, dataCrossYearComparison) {
        let categories = [];

        if (dataCrossYearComparison && dataCrossYearComparison.length > 0) {
            dataCrossYearComparison.map(function (x) {
                categories.push(x.Name);
            });
        }

        if (dataComparison && dataComparison.length > 0) {
            dataComparison.map(function (x) {
                categories.push(x.Name);
            });
        }

        if (dataCrossYear && dataCrossYear.length > 0) {
            dataCrossYear.map(function (x) {
                categories.push(x.Name);
            });
        }

        if (data && data.length > 0) {
            data.map(function (x) {
                categories.push(x.Name);
            });
        }

        return categories;
    };

    var generatePlotLinesOptions = function (value1, value2) {
        let y1Position = -4;
        let y2Position = 16;

        if (value1 > value2) {
            y2Position = -4;
            y1Position = 16;
        }

        return [{
            color: '#3fd0da',
            width: 0.5,
            value: value2,
            dashStyle: 'ShortDot',
            label: {
                text: formatNumber(value2),
                align: 'right',
                x: -5,
                y: y1Position,
                style: {
                    color: '#000'
                }
            }
        }, {
            color: '#5a7dc1',
            width: 0.5,
            value: value1,
            dashStyle: 'Solid',
            label: {
                text: formatNumber(value1),
                align: 'right',
                x: -5,
                y: y2Position,
                style: {
                    color: '#000'
                }
            }
        }];
    };

    var generateLineChartOptions = function (data, dataComparison, dataCrossYear, dataCrossYearComparison, avg1, avg2) {
        let series = generateSeriesOptions(data, dataComparison, dataCrossYear, dataCrossYearComparison);
        let categories = generateCategoriesOptions(data, dataComparison, dataCrossYear, dataCrossYearComparison);
        let plotLines = generatePlotLinesOptions(avg1, avg2);

        return {
            chart: {
                type: 'line',
                height: 345
            },
            title: {
                text: null
            },
            xAxis: {
                categories: categories,
                labels: {
                    style: {
                        fontSize: 10
                    },
                    rotation: -60
                }
            },
            yAxis: [{
                title: { text: null },
                plotLines: plotLines
            }],
            tooltip: {
                formatter: renderTooltip
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: series
        };
    };

    var generateBarChartOptions = function (data, dataComparison, dataCrossYear, dataCrossYearComparison, avg1, avg2) {
        let series = generateSeriesOptions(data, dataComparison, dataCrossYear, dataCrossYearComparison);
        let categories = generateCategoriesOptions(data, dataComparison, dataCrossYear, dataCrossYearComparison);
        let plotLines = generatePlotLinesOptions(avg1, avg2);

        return {
            chart: {
                type: 'column',
                height: 345
            },
            title: {
                text: null
            },
            xAxis: {
                categories: categories,
                labels: {
                    style: {
                        fontSize: 10
                    },
                    rotation: -60
                }
            },
            yAxis: {
                title: { text: null },
                plotLines: plotLines
            },
            tooltip: {
                formatter: renderTooltip
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    pointWidth: 9
                }
            },
            series: series
        };
    };

    var renderTooltip = function () {
        let data1 = this.series.chart.series[0].data;
        let data2 = this.series.chart.series[1].data;
        let index = this.point.index;
        let yComparison = data1[index].y;
        let y = data2[index].y;
        let valueComparison = 0;
        if (yComparison !== this.y && y !== 0 && yComparison !== 0) {
            valueComparison = (y - yComparison) / yComparison * 100;
            valueComparison = valueComparison.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        let nodeColor = this.color;
        let currentLegend = '';
        legendColors.forEach(function (le) {
            if (le.color === nodeColor) {
                currentLegend = le.text;
            }
        });

        let legend1 = this.series.chart.series[0].name;
        let yValue = this.y;
        if (!isInt(yValue)) {
            yValue = this.y.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            yValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let tooltip = '';
        tooltip += '<span>' + this.x + '-' + currentLegend + '</span>';
        tooltip += '<br/><span style="font-weight: bold">' + yValue + '</span><br/>';
        if (yComparison !== this.y) {
            let color = valueComparison > 0 ? 'green' : 'red';
            tooltip += '<span style="font-weight: bold; color: ' + color + '">(' + valueComparison + '%)</span>';
            tooltip += '<span> to ' + this.x + ' ' + legend1 + '</span>';
        }

        return tooltip;
    };

    var isInt = function (number) {
        return number % 1 === 0;
    };

    var reDrawChartByType = function (name, type) {
        if (dataChart !== null) {
            reDrawChart(dataChart, name, type);
        }
    };

    var reDrawChart = function (data, name, type) {
        var options = '';

        switch (name) {
            case 'winloss':
                options = type === 'line'
                    ? generateLineChartOptions(data.WinLossList
                        , data.WinLossComparisonList
                        , data.WinLossCrossYearList
                        , data.WinLossCrossYearComparisonList
                        , data.WinLossAverage
                        , data.WinLossAverageComparison)
                    : generateBarChartOptions(data.WinLossList
                        , data.WinLossComparisonList
                        , data.WinLossCrossYearList
                        , data.WinLossCrossYearComparisonList
                        , data.WinLossAverage
                        , data.WinLossAverageComparison);
                domElements.divWinlossContent.highcharts(options);
                break;
            case 'margin':
                options = type === 'line'
                    ? generateLineChartOptions(data.MarginList
                        , data.MarginComparisonList
                        , data.MarginCrossYearList
                        , data.MarginCrossYearComparisonList
                        , data.MarginAverage
                        , data.MarginAverageComparison)
                    : generateBarChartOptions(data.MarginList
                        , data.MarginComparisonList
                        , data.MarginCrossYearList
                        , data.MarginCrossYearComparisonList
                        , data.MarginAverage
                        , data.MarginAverageComparison);
                domElements.divMarginContent.highcharts(options);
                break;
            case 'betcount':
                options = type === 'line'
                    ? generateLineChartOptions(data.BetCountList
                        , data.BetCountComparisonList
                        , data.BetCountCrossYearList
                        , data.BetCountCrossComparisonList
                        , data.BetCountAverage
                        , data.BetCountAverageComparison)
                    : generateBarChartOptions(data.BetCountList
                        , data.BetCountComparisonList
                        , data.BetCountCrossYearList
                        , data.BetCountCrossComparisonList
                        , data.BetCountAverage
                        , data.BetCountAverageComparison);
                domElements.divBetcountContent.highcharts(options);
                break;
            case 'turnover':
                options = type === 'line'
                    ? generateLineChartOptions(data.TurnoverList
                        , data.TurnoverComparisonList
                        , data.TurnoverCrossYearList
                        , data.TurnoverCrossYearComparisonList
                        , data.TurnoverAverage
                        , data.TurnoverAverageComparison)
                    : generateBarChartOptions(data.TurnoverList
                        , data.TurnoverComparisonList
                        , data.TurnoverCrossYearList
                        , data.TurnoverCrossYearComparisonList
                        , data.TurnoverAverage
                        , data.TurnoverAverageComparison);
                domElements.divTurnoverContent.highcharts(options);
                break;            
            default:
                break;
        }
    };

    var showAverageOnClick = function (elementContent, $this) {
        var isShow = $this.is(':checked');
        elementContent.find('.highcharts-plot-line ').each(function () {
            if (isShow)
                $(this).css("visibility", "visible");
            else
                $(this).css("visibility", "hidden");
        });

        elementContent.find('.highcharts-plot-line-label ').each(function () {
            if (isShow)
                $(this).css("visibility", "visible");
            else
                $(this).css("visibility", "hidden");
        });
    };

    var formatNumber = function (number) {
        number = number.toFixed(2);

        if (number < 1000)
            return number;

        if (parseInt(number / 1e6) !== 0)
            return parseInt(number / 1e6) + "M";
        else
            return parseInt(number / 1e3) + "K";
    };

    $(window).unload(function () {
        domElements.divPeriodSelected.find('option').remove();
    });

};