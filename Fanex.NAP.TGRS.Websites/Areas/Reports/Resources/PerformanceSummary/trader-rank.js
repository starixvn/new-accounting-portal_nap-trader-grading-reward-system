/* File Created: May 12, 2014 */
/* global Namespace, common, labels, filterParameters */
'use strict';

$(document).ready(function () {
    var TraderRank = new Fanex.TGRS.PerformanceSummary.TraderRank();
    TraderRank.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary.TraderRank = function () {
    var $this = this;
    var urls = {
        GetTraderRankData: common.ResolveRootUrl('Reports/PerformanceSummary/GetTraderRankData'),
        GetGradeHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetGradeHistory'),
        GetTeamHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetTeamHistory')
    };
    var domElements = {
        ddlType: null,
        divRankGrid: null
    };

    var gradeHistory = new Fanex.TGRS.PerformanceSummary.GradeHistory();
    var teamHistory = new Fanex.TGRS.PerformanceSummary.TeamHistory();

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.ddlType = $('#ddlType');
        domElements.divRankGrid = $('#divRankGrid');
    };

    function getReportByType(reportUrl, renderFunction) {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: reportUrl,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderFunction(result);
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
        domElements.ddlType.multiselect({
            selectedList: 1,
            minWidth: 50,
            height: 95,
            header: false,
            multiple: false
        });
        //btnSearch
        domElements.ddlType.on('change', function () {
            var selectType = $("option:selected", this).val() * 1;
            filterParameters.Top = selectType;
            getReports();
        });

        //team history icon click
        domElements.divRankGrid.on('click', 'span.view-teamHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            teamHistory.GetTeamHistory({
                CustId: custId,
                Username: userName,
                LeagueId: 0,
                BetTypes: 0,
                FromDate: filterParameters.FromDate,
                ToDate: filterParameters.ToDate
            });
        });

        //grade history icon click
        domElements.divRankGrid.on('click', 'span.view-gradeHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            gradeHistory.GetGradeHistory({
                CustId: custId,
                Username: userName,
                LeagueId: 0,
                BetTypes: 0,
                FromDate: filterParameters.FromDate,
                ToDate: filterParameters.ToDate
            });
        });
    };

    // Render rank grid.
    var renderRankGrid = function (data) {
        var teamDateColFormatIcon = '<span class="width-team-icon">{0}';
        teamDateColFormatIcon += '</span><span class="view-teamHistory-link detail-icon" data-cust-id="{1}" data-username="{2}"></span>';
        var colTeamFormatNoIcon = '<span>{0}</span>';

        var gradeDateColFormatIcon = '<span class="width-grade-icon grade-column-text">{0}';
        gradeDateColFormatIcon += '</span><span class="view-gradeHistory-link detail-icon grade-column-icon" data-cust-id="{1}" data-username="{2}"></span>';
        var colGradeFormatNoIcon = '<span class="grade-column-text">{0}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 60, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Team, Width: 180, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 100, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 150
        };
        var bodyData = [];
        var row;
        var TeamDateCol = "";
        var GradeDateCol = "";
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                if (item.NoOfTeamChanged > 1) {
                    TeamDateCol = teamDateColFormatIcon.format(item.TeamName, item.CustId, item.UserName);
                }
                else {
                    TeamDateCol = colTeamFormatNoIcon.format(item.TeamName);
                }
                if (item.NoOfGradeChanged > 1) {
                    GradeDateCol = gradeDateColFormatIcon.format(item.Grade, item.CustId, item.UserName);
                }
                else {
                    GradeDateCol = colGradeFormatNoIcon.format(item.Grade);
                }

                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColTrader', Value: item.UserName },
                              { Name: 'ColGrade', Value: GradeDateCol },
                              { Name: 'ColTeam', Value: TeamDateCol },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divRankGrid.fanexGrid(gridOptions);
    };

    var getReports = function () {
        getReportByType(urls.GetTraderRankData, renderRankGrid);
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
        getReports();
    };
};