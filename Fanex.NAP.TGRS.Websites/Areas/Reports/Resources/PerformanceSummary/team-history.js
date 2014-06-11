/* File Created: June 11, 2014 */
/* global Namespace, common, labels */

'use strict';

Namespace.Register("Fanex.TGRS.PerformanceSummary.TeamHistory");
Fanex.TGRS.PerformanceSummary.TeamHistory = function () {
    var $this = this;
    var urls = {
        GetTeamHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetTeamHistory')
    };
    var parameters = {
        CustId: null,
        Username: null,
        LeagueId: null,
        BetTypes: null,
        FromDate: null,
        ToDate: null
    };
    var template = '<div class="min-width-history">' +
                       '<div class="display-none">' +
                           '<div  id="divTeamHistory" class="freegrid"></div>' +
                       '</div>' +
                   '</div>';

    // Get team history.
    var getTeamHistory = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTeamHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                common.Popup(labels.TeamHistoryDetail + " - " + parameters.Username, $(template));
                renderTeamHistoryGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderTeamHistoryGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 60, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 130, Name: 'ColTeamName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EffectiveDate, Width: 130, Name: 'ColTeamEffectiveDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 130, Name: 'ColWinloss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.BetCount, Width: 80, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 70, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            showNumberColumn: true
        };
        var bodyData = [];
        var row = null;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColTeamName', Value: item.TeamName },
                              { Name: 'ColTeamEffectiveDate', Value: item.TeamEffectiveDate },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinloss', Value: item.WinLost },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        $('#divTeamHistory', '#divPopup').fanexGrid(gridOptions);
    };

    $this.GetTeamHistory = function (params) {
        parameters = params;
        getTeamHistory();
    };
};