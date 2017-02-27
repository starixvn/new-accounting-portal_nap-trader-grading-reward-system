/* File Created: June 11, 2014 */
/*jshint strict: false*/
/* global Namespace, common, labels, numeral, Highcharts */

////'use strict';

$(document).ready(function () {
    var Dashboard = new Fanex.TGRS.Reports.Dashboard();
    Dashboard.Initialize();
});

Namespace.Register("Fanex.TGRS.Reports.Dashboard");
Fanex.TGRS.Reports.Dashboard = function () {
    var $this = this;
    var defaultMonthRange = 3;
    var defaultChartType = 2;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var colors = ['#f28f43', '#1aadce', '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#492970', '#77a1e5', '#c42525', '#a6c96a'];

    var ChartOptions = null;

    var currentChartType = defaultChartType;
    var currentMonthRange = defaultMonthRange;

    var urls = {
        GetSummaryData: common.ResolveRootUrl('OSDashboard/GetSummaryData'),
        GetTeamData: common.ResolveRootUrl('OSDashboard/GetTeamData')
    };

    var domElements = {
        divHorizontalTab: null,

        divMonthMarginContainer: null,
        divTeamTurnoverContainer: null,
        divTeamMarginContainer: null,
        divRegionMarginContainer: null,
        divMonthMatchCountContainer: null,

        divWorstTrader: null,
        divBestTrader: null,

        divMonthSelect: null,
        titleMonthCount: null,

        toggleA: null
    };

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.divHorizontalTab = $('#divHorizontalTab');

        domElements.divMonthMarginContainer = $('#divMonthMarginContainer');
        domElements.divTeamTurnoverContainer = $('#divTeamTurnoverContainer');
        domElements.divTeamMarginContainer = $('#divTeamMarginContainer');
        domElements.divRegionMarginContainer = $('#divRegionMarginContainer');
        domElements.divMonthMatchCountContainer = $('#divMonthMatchCountContainer');

        domElements.divWorstTrader = $('#divWorstTrader');
        domElements.divBestSport = $('#divBestSport');

        domElements.titleMonthCount = $('#titleMonthCount');
        domElements.divMonthSelect = $("#divTeamMonthPicker");

        domElements.toggleA = $("#toggleA");
    };

    //}

    //{ module-init
    var initialize = function () {
        ChartOptions = new Fanex.TGRS.DashboardChart();
        getSettingFromCookies();
    };

    $this.Initialize = function () {
        setResponsiveHeight();
        initialize();
        cacheDomElements();
        handlePageEvents();
    };

    //}

    //{ page-events & make-form.
    var setResponsiveHeight = function () {
        var maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (33 + 15 + 38); // menu + tabs + tabs padding + unknown
        $("#divTabSummaryContent").css({ height: maxHeight });
        $("#divTabTeamContent").css({ height: maxHeight });
    };

    var handlePageEvents = function () {
        $("#headline").hide();
        makeMonthDropdown();
        ajaxGetSummaryData();

        domElements.divMonthSelect.on('change', function () {
            currentMonthRange = parseInt(domElements.divMonthSelect.val());
            renderTitle(currentMonthRange);
            ajaxGetSummaryData();
            saveMonthRangeCookies();
        });

        $('#chk2D').on('change', function () {
            currentChartType = 2;
            domElements.toggleA.removeClass('type3D');
            reRenderChart(currentChartType);
            saveChartTypeCookies();
        });
        $('#chk3D').on('change', function () {
            currentChartType = 3;
            domElements.toggleA.addClass('type3D');
            reRenderChart(currentChartType);
            saveChartTypeCookies();
        });
    };
    //}

    //{ ajax functions
    var ajaxGetSummaryData = function () {
        var monthCriteria = {
            month: parseInt(domElements.divMonthSelect.val())
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetSummaryData,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(monthCriteria),
            success: function (result) {
                if (result) {
                    renderSummaryReports(result, currentChartType);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    //}

    //{ helper functions
    //{ element-render
    var getSettingFromCookies = function () {
        currentChartType = parseInt($.cookie("dashboardChartType")) || defaultChartType;
        currentMonthRange = parseInt($.cookie("dashboardMonthRange")) || defaultMonthRange;

        if (currentChartType === ChartType._2D) {
            $('#chk2D').prop("checked", true);
        }
        else {
            $('#chk3D').prop("checked", true);
            $('#toggleA').addClass('type3D');
        }

        $('#titleMonthCount').text(currentMonthRange);

        // for new-new cookies
        saveChartTypeCookies();
        saveMonthRangeCookies();
    };

    var saveChartTypeCookies = function () {
        $.cookie("dashboardChartType", currentChartType, { expires: 7 });
    };

    var saveMonthRangeCookies = function () {
        $.cookie("dashboardMonthRange", currentMonthRange, { expires: 7 });
    };

    var makeMonthDropdown = function () {
        for (var i = 1; i <= 12; i++) {
            domElements.divMonthSelect.append($('<option></option>').attr('value', i).text(i + ' months'));
        }
        domElements.divMonthSelect.val(currentMonthRange);
    };

    var renderSummaryReports = function (data, chartType) {
        drawSummaryChart(data.SummaryData, chartType);
        renderRankInfo(data.WorstTraders, data.BestSports);
    };

    var renderTitle = function (month) {
        domElements.titleMonthCount.text(month);
    };

    var createRankRowHtml = function (name, value) {
        var template = '<div class="rank-row">' +
                        '<div class="name">{0}</div>' +
                       ' <div class="value"><div class="number-value">{1}</div></div>' +
                        '</div>';
        return template.format(name, value);
    };

    var renderRankInfo = function (worstTraders, bestSports) {
        //traders
        domElements.divWorstTrader.html('');
        if (worstTraders) {
            $.each(worstTraders, function (index, item) {
                domElements.divWorstTrader.append(createRankRowHtml(item.Username, numeral(item.Margin).format(common.Formats.DecimalFormat)));
            });
        }

        //sports
        domElements.divBestSport.html('');
        if (bestSports) {
            $.each(bestSports, function (index, item) {
                domElements.divBestSport.append(createRankRowHtml(item.SportName, numeral(item.Margin).format(common.Formats.DecimalFormat)));
            });
        }
    };

    var prepareSummaryColumnData = function (years, monthData, monthDataLastYear, regionData, teamData, chartData) {
        chartData.MixMonthMarginData =
        [
            {
                name: 'Margin %',
                data: []
            },
            {
                name: 'Margin %',
                data: []
            }
        ];

        chartData.RegionMarginData = [{
            name: 'Margin %',
            data: []
        }];

        chartData.MonthMatchCountData = [{
            name: 'Match Count',
            data: []
        }];

        chartData.TeamMarginData = [{
            name: 'Margin %',
            data: []
        }];

        chartData.TeamTurnoverData = [{
            name: 'Turnover',
            data: []
        }];

        var minYear = years.length > 2 ? years[0] : years[0] - 1;

        $.each(monthData, function (index, item) {
            var dataItem = {
                name: item.Month + "/" + item.Year,
                color: colors[item.Year - minYear],
                y: item.Margin
            }

            chartData.MixMonthMarginData[1].data.push(dataItem);
            chartData.MonthMatchCountData[0].data.push(item.MatchCount);
            chartData.MonthCategories.push(monthNames[item.Month - 1]);
        });

        $.each(monthDataLastYear, function (index, item) {
            var dataItem = {
                name: item.Month + "/" + item.Year,
                color: colors[item.Year - minYear],
                y: item.Margin
            }
            chartData.MixMonthMarginData[0].data.push(dataItem);
        });

        $.each(regionData, function (index, item) {
            chartData.RegionMarginData[0].data.push(item.Margin);
            chartData.RegionCategories.push(item.RegionName ? item.RegionName : "Unknown");
        });

        $.each(teamData, function (index, item) {
            chartData.TeamCategories.push(item.TeamName ? item.TeamName : "Unknown");
            chartData.TeamMarginData[0].data.push(item.Margin);

            var pipeItem = {
                name: item.TeamName ? item.TeamName : "Unknown",
                y: item.Turnover
            };
            chartData.TeamTurnoverData[0].data.push(pipeItem);
        });
    };

    var reRenderChart = function (type) {
        drawSummaryChart(null, type);
    };

    var chartData = {};

    var ChartType = {
        _2D: 2,
        _3D: 3
    };

    var drawSummaryChart = function (data, type) {
        domElements.divMonthMarginContainer.html('');
        domElements.divRegionMarginContainer.html('');
        domElements.divTeamTurnoverContainer.html('');
        domElements.divTeamMarginContainer.html('');
        domElements.divMonthMatchCountContainer.html('');

        //make data
        if (data) {
            chartData = {
                MixMonthMarginData: [],
                RegionMarginData: [],
                RegionCategories: [],
                TeamMarginData: [],
                TeamTurnoverData: [],
                MonthMatchCountData: [],
                TeamCategories: [],
                MonthCategories: [],
                MixDataMin: 0
            };

            prepareSummaryColumnData(data.Years, data.MonthData, data.LastYearMonthData, data.RegionData, data.TeamData, chartData);
        }

        var monthMarginColumnOption = ChartOptions.MixChartOption();
        monthMarginColumnOption.title.text = 'Margin (%) By Month';
        monthMarginColumnOption.series = chartData.MixMonthMarginData;
        monthMarginColumnOption.xAxis.categories = chartData.MonthCategories;
        if (type === ChartType._2D) {
            monthMarginColumnOption.chart.options3d.enabled = false;
        }
        domElements.divMonthMarginContainer.highcharts(monthMarginColumnOption);

        var regionMarginColumnOption = ChartOptions.ColumnChartOption();
        regionMarginColumnOption.title.text = 'Margin (%) By Region';
        regionMarginColumnOption.series = chartData.RegionMarginData;
        regionMarginColumnOption.xAxis.categories = chartData.RegionCategories;
        if (type === ChartType._2D) {
            regionMarginColumnOption.chart.options3d.enabled = false;
        }
        domElements.divRegionMarginContainer.highcharts(regionMarginColumnOption);

        var teamMarginColumnOption = ChartOptions.ColumnChartOption();
        teamMarginColumnOption.title.text = 'Margin (%) By Team';
        teamMarginColumnOption.series = chartData.TeamMarginData;
        teamMarginColumnOption.xAxis.categories = chartData.TeamCategories;
        if (type === ChartType._2D) {
            teamMarginColumnOption.chart.options3d.enabled = false;
        }
        domElements.divTeamMarginContainer.highcharts(teamMarginColumnOption);

        var teamMatchCountColumnOption = ChartOptions.ColumnChartOption();
        teamMatchCountColumnOption.title.text = 'Match Count By Month';
        teamMatchCountColumnOption.series = chartData.MonthMatchCountData;
        teamMatchCountColumnOption.xAxis.categories = chartData.MonthCategories;
        if (type === ChartType._2D) {
            teamMatchCountColumnOption.chart.options3d.enabled = false;
        }
        domElements.divMonthMatchCountContainer.highcharts(teamMatchCountColumnOption);

        var pipeChartOption = ChartOptions.PipeChartOption();
        pipeChartOption.title.text = 'Turnover By Team';
        pipeChartOption.series = chartData.TeamTurnoverData;
        if (type === ChartType._2D) {
            pipeChartOption.chart.options3d.enabled = false;
        }
        domElements.divTeamTurnoverContainer.highcharts(pipeChartOption);
    };
    //}
};