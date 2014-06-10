/* File Created: May 12, 2014 */
/* global Namespace, common, labels, numeral, yearOptions  */
'use strict';

$(document).ready(function () {
    var PerformanceSummary = new Fanex.TGRS.PerformanceSummary.PerformanceSummary();
    PerformanceSummary.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary.PerformanceSummary = function () {
    var $this = this;
    var urls = {
        GetReports: common.ResolveRootUrl('Reports/PerformanceSummary/GetReports'),
        GetTraderRank: common.ResolveRootUrl('Reports/PerformanceSummary/TraderRank')
    };
    var domElements = {
        divDateRange: null,
        btnSearch: null,
        divGeneralInfo: null,
        lblWinLoss: null,
        lblMargin: null,
        lblTurnOver: null,
        lblMatches: null,
        divTeamGrid: null,
        divTraderGrid: null,
        divTopWinLeagueGrid: null,
        divTopLoseLeagueGrid: null,
        divBetTypeGrid: null,
        ddlPeriodType: null

    };
    var filterParameters = {
        ReportType: null,
        FromDate: null,
        ToDate: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divDateRange = $('#divDateRange');
        domElements.divDatePair = $('#divDatePair');
        domElements.divFromMonthContainer = $('#divFromMonthContainer');
        domElements.divFromMonth = $('#divFromMonth');
        domElements.divToMonthContainer = $('#divToMonthContainer');
        domElements.divToMonth = $('#divToMonth');
        domElements.ddlYear = $('#ddlYear');
        domElements.btnSearch = $('#btnSearch');
        domElements.divGeneralInfo = $('#divGeneralInfo');
        domElements.divTeamGrid = $('#divTeamGrid');
        domElements.divTraderGrid = $('#divTraderGrid');
        domElements.divTopWinLeagueGrid = $('#divTopWinLeagueGrid');
        domElements.divTopLoseLeagueGrid = $('#divTopLoseLeagueGrid');
        domElements.divBetTypeGrid = $('#divBetTypeGrid');
        domElements.ddlPeriodType = $('#ddlPeriodType');

        domElements.lblWinLoss = $("#lblWinLoss", domElements.divGeneralInfo);
        domElements.lblMargin = $("#lblMargin", domElements.divGeneralInfo);
        domElements.lblTurnOver = $("#lblTurnOver", domElements.divGeneralInfo);
        domElements.lblMatches = $("#lblMatches", domElements.divGeneralInfo);
    };

    function getReports() {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetReports,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderReports(result);
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

    // Init page fields and events
    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.on('click', function () {
            filterParameters.FromDate = domElements.divDateRange.getFrom();
            filterParameters.ToDate = domElements.divDateRange.getTo();
            filterParameters.ReportType = domElements.divDateRange.getPeriodType();
            getReports();
        });

        //event: click on top 10
        domElements.divTraderGrid.on('click', '.top10-link', function () {
            makeTopForm();
        });

        //event: click on top 10
        domElements.divTraderGrid.on('click', '.bottom10-link', function () {
            makeBottomForm();
        });
    };

    // Display new Trader form.
    var makeTopForm = function () {
        var urlFormat = urls.GetTraderRank + "?Top={0}&IsBottom={1}&ReportType={2}&FromDate={3}&ToDate={4}";
        var fromDate = filterParameters.FromDate;
        var toDate = filterParameters.ToDate;
        var url = urlFormat.format(10, 0, filterParameters.ReportType, fromDate, toDate);
        window.open(url, '_blank');
    };

    // Display new Trader form.
    var makeBottomForm = function () {
        var urlFormat = urls.GetTraderRank + "?Top={0}&IsBottom={1}&ReportType={2}&FromDate={3}&ToDate={4}";
        var fromDate = filterParameters.FromDate;
        var toDate = filterParameters.ToDate;
        var url = urlFormat.format(10, 1, filterParameters.ReportType, fromDate, toDate);
        window.open(url, '_blank');
    };

    var initDatePicker = function () {
        var toDate = new Date();
        var begin2014Date = new Date(2014, 0, 1);
        var minDate = new Date(toDate.getFullYear() - yearOptions.PerformanceYearRange, 0, 1);

        if (minDate.getFullYear() < 2014) {
            minDate = begin2014Date;
        }
        var maxDate = new Date(toDate);
        maxDate.setDate(maxDate.getDate() - 1);
        //default date: 2 weeks after yesterday
        var defaultFromDate = new Date(toDate);
        defaultFromDate.setDate(toDate.getDate() - 14);

        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: minDate,
            maxDate: maxDate,
            defaultFromDate: defaultFromDate,
            defaultToDate: maxDate,
            allowYearRange: yearOptions.PerformanceAllowYearRange,
            yearRanges: null,
            labelCss: 'col_3'
        });
    };

    var renderReports = function (data) {
        renderGeneralInfo(data.GeneralInfo);
        renderTeamGrid(data.TeamPerformances);
        renderWinLeagueGrid(data.WinLeagues);
        renderLoseLeagueGrid(data.LoseLeagues);
        renderTraderGrid(data.TraderPerformance);
        renderBetTypeGrid(data.BetTypePerformances);
    };

    var renderGeneralInfo = function (data) {
        domElements.divGeneralInfo.css({ display: "block" });
        domElements.lblWinLoss.text(numeral(data.Winlost).format(common.Formats.DecimalFormat));
        if (data.Margin != null) {
            domElements.lblMargin.text(numeral(data.Margin).format(common.Formats.DecimalFormat));
        }
        else {
            domElements.lblMargin.text(labels.NA);
        }
        domElements.lblTurnOver.text(numeral(data.Turnover).format(common.Formats.DecimalFormat));
        domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));
    };

    // Render team grid.
    var renderTeamGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.Team, Width: 350, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.TeamPerformance,
                showButtonsWhenNoData: true
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTeamGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderWinLeagueGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5WinningLeagues
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
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTopWinLeagueGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderLoseLeagueGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5LosingLeagues
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
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTopLoseLeagueGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderTraderGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.TraderPerformance, Width: 350, Name: 'ColTraderType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.MinMargin, Width: 150, Name: 'ColMinMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.MaxMargin, Width: 150, Name: 'ColMaxMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.TraderPerformance
            }
        };
        var bodyData = [];
        var top10Col = '<span class="top10-link link">' + labels.Top10ByMargin + '</span>';
        var bottom10Col = '<span class="bottom10-link link">' + labels.Bottom10ByMargin + '</span>';
        var row;
        if (data.TopMinMargin && data.TopMaxMargin) {
            row = {
                Columns: [{ Name: 'ColTraderType', Value: top10Col },
                              { Name: 'ColMinMargin', Value: data.TopMinMargin || labels.NA },
                              { Name: 'ColMaxMargin', Value: data.TopMaxMargin || labels.NA}]
            };
            bodyData.push(row);
        }
        if (data.BottomMinMargin && data.BottomMaxMargin) {
            row = {
                Columns: [{ Name: 'ColTraderType', Value: bottom10Col },
                              { Name: 'ColMinMargin', Value: data.BottomMinMargin || labels.NA },
                              { Name: 'ColMaxMargin', Value: data.BottomMaxMargin || labels.NA}]
            };
            bodyData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTraderGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderBetTypeGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.BetType, Width: 350, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
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
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divBetTypeGrid.fanexGrid(gridOptions);
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };
};
