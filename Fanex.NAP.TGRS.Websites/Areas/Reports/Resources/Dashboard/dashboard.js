/* File Created: June 11, 2014 */
/* global Namespace, common, labels, numeral, Highcharts */

'use strict';

$(document).ready(function () {
    var Dashboard = new Fanex.TGRS.Reports.Dashboard();
    Dashboard.Initialize();
});

Namespace.Register("Fanex.TGRS.Reports.Dashboard");
Fanex.TGRS.Reports.Dashboard = function () {
    var $this = this;

    //    var monthNames = ["January", "February", "March", "April", "May", "June",
    //    "July", "August", "September", "October", "November", "December"];

    //{ variable-declare
    var ChartOptions = null;

    var urls = {
        GetSummaryData: common.ResolveRootUrl('Dashboard/GetSummaryData'),
        GetTeamData: common.ResolveRootUrl('Dashboard/GetTeamData')
    };

    var domElements = {
        divHorizontalTab: null,

        monthteamWinlossContainer: null,
        monthteamMarginContainer: null,
        teamWinlossContainer: null,
        teamMarginContainer: null,

        divBestLeague: null,
        divBestTrader: null,
        divBestBettype: null,

        lblTurnOver: null,
        lblWinLoss: null,
        lblMargin: null,
        lblMatches: null,

        divMonthSelect: null,

        titleMonthCount: null
    };
    //}

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.divHorizontalTab = $('#divHorizontalTab');

        domElements.monthMarginContainer = $('#monthMarginContainer');
        domElements.monthMatchContainer = $('#monthMatchContainer');
        domElements.teamWinlossContainer = $('#teamWinlossContainer');
        domElements.teamMarginContainer = $('#teamMarginContainer');

        domElements.divBestLeague = $('#divBestLeague');
        domElements.divBestTrader = $('#divBestTrader');
        domElements.divBestBettype = $('#divBestBettype');

        domElements.lblTurnOver = $('#lblTurnOver');
        domElements.lblWinLoss = $('#lblWinLoss');
        domElements.lblMargin = $('#lblMargin');
        domElements.lblMatches = $('#lblMatches');

        domElements.titleMonthCount = $('#titleMonthCount');
    };

    //}

    //{ module-init
    var initialize = function () {
        ChartOptions = new Fanex.TGRS.DashboardChart();
        //ChartOptions.ApplyDarkTheme();
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
        var maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (33 + 15); // menu + tabs + tabs padding + unknown
        $("#divTabSummaryContent").css({ height: maxHeight });
        $("#divTabTeamContent").css({ height: maxHeight });
    };

    var handlePageEvents = function () {
        $("#headline").hide();
        makeMonthDropdown();
        ajaxGetSummaryData();

        domElements.divMonthSelect.on('change', function () {
            renderTitle(domElements.divMonthSelect.val() * 6);
            ajaxGetSummaryData();
        });
    };
    //}

    //{ ajax functions
    var ajaxGetSummaryData = function () {
        var monthCriteria = {
            month: parseInt(domElements.divMonthSelect.val() * 6)
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
                    renderSummaryReports(result);
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
    var makeMonthDropdown = function () {
        var selectHtml = '<select class="team-month-picker" id="divTeamMonthPicker"></select>';
        $(".dash-board-title").append(selectHtml);

        domElements.divMonthSelect = $("#divTeamMonthPicker");

        for (var i = 1; i <= 3; i++) {
            domElements.divMonthSelect.append($('<option></option>').attr('value', i).text(i * 6 + 'months'));
        }
        domElements.divMonthSelect.val(1);
    };
    var renderSummaryReports = function (data) {
        renderGeneralInfo(data.GeneralInfo);
        drawSummaryChart(data.SummaryData);
        renderRankInfo(data.BestLeagues, data.BestTraders, data.BestBettypes);
    };

    var renderTitle = function (month) {
        domElements.titleMonthCount.text(month);
    };

    var renderGeneralInfo = function (data) {
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

    var createRankRowHtml = function (name, value) {
        var template = '<div class="rank-row">' +
                        '<div class="name">{0}</div>' +
                       ' <div class="value"><div class="center-value">{1}</div></div>' +
                        '</div>';
        return template.format(name, value);
    };

    var renderRankInfo = function (bestLeagues, bestTraders, bestBettypes) {
        //leagues
        domElements.divBestLeague.html('');
        if (bestLeagues) {
            $.each(bestLeagues, function (index, item) {
                domElements.divBestLeague.append(createRankRowHtml(item.LeagueName, numeral(item.Margin).format(common.Formats.DecimalFormat)));
            });
        }

        //traders
        domElements.divBestTrader.html('');
        if (bestTraders) {
            $.each(bestTraders, function (index, item) {
                domElements.divBestTrader.append(createRankRowHtml(item.UserName, numeral(item.Margin).format(common.Formats.DecimalFormat)));
            });
        }

        //bettypes
        domElements.divBestBettype.html('');
        if (bestBettypes) {
            $.each(bestBettypes, function (index, item) {
                domElements.divBestBettype.append(createRankRowHtml(item.TypeName, numeral(item.Margin).format(common.Formats.DecimalFormat)));
            });
        }
    };

    var prepareSummaryColumnData = function (monthData, teamData, chartData) {
        chartData.MonthMarginData = [{
            name: 'Amount',
            data: []
        }];

        chartData.MonthMatchData = [{
            name: 'Match Count',
            data: []
        }];

        chartData.TeamMarginData = [{
            name: 'Amount',
            data: []
        }];

        chartData.TeamMixData = [{
            type: 'column',
            name: 'Win loss',
            data: []
        }, {
            type: 'spline',
            name: 'Turn over',
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            },
            data: []
        }];

        $.each(monthData, function (index, item) {
            chartData.MonthMarginData[0].data.push(item.Margin);
            chartData.MonthCategories.push(Highcharts.getOptions().lang.shortMonths[item.Month - 1]);

            //month match data
            var pipeItem = {
                name: Highcharts.getOptions().lang.shortMonths[item.Month - 1],
                y: item.MatchCount
            };
            chartData.MonthMatchData[0].data.push(pipeItem);
        });

        $.each(teamData, function (index, item) {
            chartData.Categories.push(item.TeamName);
            chartData.TeamMarginData[0].data.push(item.Margin);
            chartData.TeamMixData[0].data.push(item.Turnover);
            chartData.TeamMixData[1].data.push(item.Winlost);
        });
    };

    var drawSummaryChart = function (data) {
        domElements.monthMarginContainer.html('');
        domElements.monthMatchContainer.html('');
        domElements.teamWinlossContainer.html('');
        domElements.teamMarginContainer.html('');

        var summaryColumnOption = ChartOptions.ColumnChartOption();

        //make data
        var chartData = {
            TeamMarginData: [],
            TeamMixData: [],
            MonthMarginData: [],
            MonthMatchData: [],
            Categories: [],
            MonthCategories: []
        };

        prepareSummaryColumnData(data.MonthData, data.TeamData, chartData);

        // month turn over chart
        summaryColumnOption.title.text = 'Month Margin %';
        summaryColumnOption.series = chartData.MonthMarginData;
        summaryColumnOption.xAxis.categories = chartData.MonthCategories;
        domElements.monthMarginContainer.highcharts(summaryColumnOption);


        // match
        var pipeChartOption = ChartOptions.PipeChartOption();
        pipeChartOption.title.text = 'Month Match';
        pipeChartOption.series = chartData.MonthMatchData;
        domElements.monthMatchContainer.highcharts(pipeChartOption);

        // team turnover&winloss chart
        var mixChartOption = ChartOptions.MixChartOption();
        mixChartOption.xAxis.categories = chartData.Categories;
        mixChartOption.title.text = 'Team Winloss/Turnover';
        mixChartOption.series = chartData.TeamMixData;
        domElements.teamWinlossContainer.highcharts(mixChartOption);

        // team margin chart
        summaryColumnOption.title.text = 'Team Margin';
        summaryColumnOption.xAxis.categories = chartData.Categories;

        summaryColumnOption.series = chartData.TeamMarginData;
        domElements.teamMarginContainer.highcharts(summaryColumnOption);
    };
    //}
};