/* File Created: June 11, 2014 */
/* global Namespace, common, labels */

'use strict';

Namespace.Register("Fanex.TGRS.PerformanceSummary.GradeHistory");
Fanex.TGRS.PerformanceSummary.GradeHistory = function () {
    var $this = this;
    var urls = {
        GetGradeHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetGradeHistory')
    };
    var parameters = {
        CustId: null,
        Username: null,
        LeagueId: null,
        BetTypes: null,
        FromDate: null,
        ToDate: null
    };
    var template = '<div class="min-width-grade-history">' +
                       '<div class="display-none">' +
                           '<div  id="divGradeHistory" class="freegrid"></div>' +
                       '</div>' +
                   '</div>';

    // Get grade history.
    var getGradeHistory = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetGradeHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                common.Popup(labels.GradeHistoryDetail + " - " + parameters.Username, $(template));
                renderGradeHistoryGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderGradeHistoryGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 60, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Grade, Width: 130, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.EffectiveDate, Width: 130, Name: 'ColGradeEffectiveDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.WinLoss, Width: 130, Name: 'ColWinloss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      { HeaderText: labels.BetCount, Width: 80, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Margin, Width: 70, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            showNumberColumn: true,
            showFooter: true
        };
        var bodyData = [];
        var footerData = [];
        var row = null;
        var total = {
            MatchCount: 0,
            Turnover: 0,
            WinLost: 0,
            BetCount: 0
        };

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColGrade', Value: item.Grade },
                              { Name: 'ColGradeEffectiveDate', Value: item.GradeEffectiveDate },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinloss', Value: item.WinLost },
                              { Name: 'ColBetCount', Value: item.BetCount },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
                total.MatchCount += item.MatchCount;
                total.Turnover += item.Turnover;
                total.WinLost += item.WinLost;
                total.BetCount += item.BetCount;
            });

            row = {
                Columns: [{ Name: 'ColNum', Value: labels.Total, MergeColNumber: 3, CellAlign: 'right' },
                          { Name: 'ColNoOfMatches', Value: total.MatchCount },
                          { Name: 'ColTurnover', Value: total.Turnover },
                          { Name: 'ColWinloss', Value: total.WinLost },
                          { Name: 'ColBetCount', Value: total.BetCount },
                          { Name: 'ColMargin', Value: total.Turnover === 0 ? labels.NA : total.WinLost / total.Turnover * 100}]
            };
            footerData.push(row);
        }

        gridOptions.bodyRows = bodyData;
        gridOptions.footerRows = footerData;
        $('#divPopup').find('.display-none').removeClass('display-none');
        $('#divGradeHistory', '#divPopup').fanexGrid(gridOptions);
    };

    $this.GetGradeHistory = function (params) {
        parameters = params;
        getGradeHistory();
    };
};