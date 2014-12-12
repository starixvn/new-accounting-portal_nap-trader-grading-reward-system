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

    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    //{ variable-declare
    var ChartOptions = null;

    var urls = {
        GetSummaryData: common.ResolveRootUrl('Dashboard/GetSummaryData'),
        GetTeamData: common.ResolveRootUrl('Dashboard/GetTeamData')
    };

    var domElements = {
        divHorizontalTab: null,

        turnoverContainer: null,
        winlossContainer: null,
        marginContainer: null,
        matchContainer: null,

        teamTurnoverContainer: null,
        teamWinlossContainer: null,
        teamMarginContainer: null,
        teamMatchContainer: null,

        divBestLeague: null,
        divBestTrader: null,
        divBestBettype: null,

        lblTurnOver: null,
        lblWinLoss: null,
        lblMargin: null,
        lblMatches: null,

        divMonthSelect: null
    };
    //}

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.divHorizontalTab = $('#divHorizontalTab');

        domElements.turnoverContainer = $('#turnoverContainer');
        domElements.winlossContainer = $('#winlossContainer');
        domElements.marginContainer = $('#marginContainer');
        domElements.matchContainer = $('#matchContainer');

        domElements.teamTurnoverContainer = $('#teamTurnoverContainer');
        domElements.teamWinlossContainer = $('#teamWinlossContainer');
        domElements.teamMarginContainer = $('#teamMarginContainer');
        domElements.teamMatchContainer = $('#teamMatchContainer');

        domElements.divBestLeague = $('#divBestLeague');
        domElements.divBestTrader = $('#divBestTrader');
        domElements.divBestBettype = $('#divBestBettype');

        domElements.lblTurnOver = $('#lblTurnOver');
        domElements.lblWinLoss = $('#lblWinLoss');
        domElements.lblMargin = $('#lblMargin');
        domElements.lblMatches = $('#lblMatches');
    };

    //}

    //{ module-init
    var initialize = function () {
        ChartOptions = new Fanex.TGRS.DashboardChart();
        ChartOptions.ApplyDarkTheme();
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
        var maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (33 + 38 + 15 + 5); // menu + tabs + tabs padding + unknown
        $("#divTabSummaryContent").css({ height: maxHeight });
        $("#divTabTeamContent").css({ height: maxHeight });
    };

    var currentTabId = 0;
    var handlePageEvents = function () {

        domElements.divHorizontalTab.responsiveTabs({
            rotate: false,
            startCollapsed: 'accordion',
            collapsible: 'accordion',
            setHash: true,
            activate: function (e, tab) {
                currentTabId = tab.id;
                if (tab.id === 0) {
                    showHideMonthPick();
                    ajaxGetSummaryData();
                }
                else {
                    showHideMonthPick();
                    ajaxGetTeamData();
                }
            }
        });

        $("#headline").hide();

        domElements.divMonthSelect.on('change', function () {
            ajaxGetTeamData();
        });
    };
    //}

    //{ ajax functions
    var ajaxGetSummaryData = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetSummaryData,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
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

    var ajaxGetTeamData = function () {
        var monthCriteria = {
            month: parseInt(domElements.divMonthSelect.val()) + 1
        };
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTeamData,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(monthCriteria),
            success: function (result) {
                if (result) {
                    renderTeamReports(result.TeamData);
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
    var showHideMonthPick = function () {
        if (domElements.divMonthSelect && currentTabId === 0) {
            domElements.divMonthSelect.addClass('hide');
        }
        else if (domElements.divMonthSelect && currentTabId === 1) {
            domElements.divMonthSelect.removeClass('hide');
        }
        else if (!domElements.divMonthSelect) {
            makeMonthDropdown();
        }
    };

    var makeMonthDropdown = function () {
        var selectHtml = '<select class="team-month-picker" id="divTeamMonthPicker"></select>';
        $(".r-tabs-nav").append(selectHtml);

        domElements.divMonthSelect = $("#divTeamMonthPicker");
        var currentMonth = (new Date()).getMonth();

        for (var i = 0; i <= currentMonth; i++) {
            domElements.divMonthSelect.append($('<option></option>').attr('value', i).text(monthNames[i]));
        }
        domElements.divMonthSelect.val(currentMonth);
        showHideMonthPick();
    };
    var renderSummaryReports = function (data) {
        renderGeneralInfo(data.GeneralInfo);
        drawSummaryChart(data.SummaryData);
        renderRankInfo(data.BestLeagues, data.BestTraders, data.BestBettypes);
    };

    var renderTeamReports = function (data) {
        drawTeamChart(data);
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

    var prepareSummaryColumnData = function (data, chartData) {
        chartData.TurnoverData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.WinlossData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.MarginData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.MatchData = [{
            name: 'Percent',
            data: []
        }];

        $.each(data, function (index, item) {
            chartData.TurnoverData[0].data.push(item.Turnover);
            chartData.WinlossData[0].data.push(item.Winloss);
            chartData.MarginData[0].data.push(item.Margin);

            //match data
            var pipeItem = {
                name: Highcharts.getOptions().lang.shortMonths[item.Month - 1],
                y: item.MatchCount
            };
            chartData.MatchData[0].data.push(pipeItem);
        });
    };

    var prepareTeamColumnData = function (data, chartData) {
        chartData.TurnoverData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.WinlossData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.MarginData = [{
            name: 'Amount',
            data: [],
            dataLabels: {
                enabled: true,
                color: '#E0E0E3',
                align: 'right',
                x: 0,
                y: -5,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }];

        chartData.MatchData = [{
            name: 'Percent',
            data: []
        }];

        $.each(data, function (index, item) {
            chartData.Categories.push(item.TeamName);
            chartData.TurnoverData[0].data.push(item.Turnover);
            chartData.WinlossData[0].data.push(item.Winlost);
            chartData.MarginData[0].data.push(item.Margin);

            //match data
            var pipeItem = {
                name: item.TeamName,
                y: item.Match
            };
            chartData.MatchData[0].data.push(pipeItem);
        });
    };

    var drawSummaryChart = function (data) {
        domElements.turnoverContainer.html('');
        domElements.winlossContainer.html('');
        domElements.marginContainer.html('');
        domElements.matchContainer.html('');

        var summaryColumnOption = ChartOptions.SummaryColumnChartOption();
        var monthNames = Highcharts.getOptions().lang.shortMonths;
        summaryColumnOption.xAxis = {
            categories: monthNames
        };

        //make data
        var chartData = {
            TurnoverData: [],
            WinlossData: [],
            MarginData: [],
            MatchData: []
        };

        prepareSummaryColumnData(data, chartData);

        // turn over chart
        summaryColumnOption.title.text = labels.Turnover;
        summaryColumnOption.series = chartData.TurnoverData;
        domElements.turnoverContainer.highcharts(summaryColumnOption);

        // winloss chart
        summaryColumnOption.title.text = labels.WinLoss;
        summaryColumnOption.series = chartData.WinlossData;
        domElements.winlossContainer.highcharts(summaryColumnOption);

        // margin chart
        summaryColumnOption.title.text = labels.Margin;
        summaryColumnOption.series = chartData.MarginData;
        domElements.marginContainer.highcharts(summaryColumnOption);

        // match
        var pipeChartOption = ChartOptions.PipeChartOption();
        pipeChartOption.title.text = 'Match';
        pipeChartOption.series = chartData.MatchData;
        domElements.matchContainer.highcharts(pipeChartOption);
    };

    var drawTeamChart = function (data) {
        var teamColumnOption = ChartOptions.TeamColumnChartOption();

        //make data
        var chartData = {
            TurnoverData: [],
            WinlossData: [],
            MarginData: [],
            MatchData: [],
            Categories: []
        };

        prepareTeamColumnData(data, chartData);
        teamColumnOption.xAxis = {
            categories: chartData.Categories
        };

        // turn over chart
        teamColumnOption.title.text = 'Turnover';
        teamColumnOption.series = chartData.TurnoverData;
        domElements.teamTurnoverContainer.highcharts(teamColumnOption);

        // winloss chart
        teamColumnOption.title.text = 'Win Loss';
        teamColumnOption.series = chartData.WinlossData;
        domElements.teamWinlossContainer.highcharts(teamColumnOption);

        // margin chart
        teamColumnOption.title.text = 'Margin (%)';
        teamColumnOption.series = chartData.MarginData;
        domElements.teamMarginContainer.highcharts(teamColumnOption);

        // match
        var pipeChartOption = ChartOptions.PipeChartOption();
        pipeChartOption.title.text = 'Match';
        pipeChartOption.series = chartData.MatchData;

        domElements.teamMatchContainer.highcharts(pipeChartOption);
    };
    //}
};