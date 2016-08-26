/* File Created: Aug 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, scoreHistoryService */
////'use strict';

$(document).ready(function () {
    scoreHistory.Initialize();
});

var scoreHistory = (function ($) {
    var scoreHistory = {};
    scoreHistory.ScoreHistory = scoreHistoryService.ScoreHistory;
    scoreHistory.ScoreHistoryDetails = scoreHistoryService.ScoreHistoryDetails;
    scoreHistory.Result = scoreHistoryService.Result;

    scoreHistory.GetAllScoreHistory = function () {
        scoreHistoryService.GetAllScoreHistory().then(function () {
            scoreHistory.ScoreHistory = scoreHistoryService.ScoreHistory;

            renderScoreHistoryGrid(scoreHistory.ScoreHistory);
        });
    };

    scoreHistory.GetScoreHistoryByPeriod = function (scoreHistoryId, headerName) {
        var criteria = {
            ScoreHistoryId: scoreHistoryId
        };

        scoreHistoryService.GetScoreHistoryByPeriod(criteria).then(function () {
            scoreHistory.ScoreHistoryDetails = scoreHistoryService.ScoreHistoryDetails;

            renderScoreHistoryDetailGrid(scoreHistory.ScoreHistoryDetails, headerName);
        });
    };

    scoreHistory.DeleteScoreHistory = function (scoreHistoryId) {
        debugger;
        var criteria = {
            ScoreHistoryId: scoreHistoryId
        };

        scoreHistoryService.DeleteScoreHistory(criteria).then(function () {
            scoreHistory.Result = scoreHistoryService.Result;

            if (scoreHistory.Result.Code === 0) {
                common.ShowInfoMessage(messages.DeleteScoreHistorySuccessfully);
                scoreHistory.GetAllScoreHistory();
            } else {
                common.ShowInfoMessage(messages.InternalErrorMessage);
                return false;
            }
        });
    };

    scoreHistory.Initialize = function () {
        cacheDOMElements();
        scoreHistory.GetAllScoreHistory();
    };

    var domElements = {
        divScoreHistoryGrid: null,
        divScoreHistoryDetailGrid: null
    };

    var cacheDOMElements = function () {
        domElements.divScoreHistoryGrid = $('#divScoreHistoryGrid');
        domElements.divScoreHistoryDetailGrid = $('#divScoreHistoryDetailGrid');
    };

    var renderScoreHistoryGrid = function (data) {
        var nameColFormatTemplate = '<span class="history-name-link link" data-score-history-id="{0}" data-score-history-header="{1}">{2}</span>';
        var removeColFormatTemplate = '<span class="remove-history-link link delete-button" data-score-history-id="{0}"></span>';

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.PeriodName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.FromDate, Width: 100, Name: 'ColFromDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.ToDate, Width: 100, Name: 'ColToDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.ConfirmedBy, Width: 100, Name: 'ColConfirmedBy', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.ConfirmedDate, Width: 100, Name: 'ColConfirmedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Remove, Width: 60, Name: 'ColRemove', HeaderAlign: 'center', CellAlign: 'center' }],
            showNumberColumn: true,
            gridExpandHeight: 220
        };

        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                nameColFormat = nameColFormatTemplate.format(item.ScoreHistoryId, item.ScoreHistoryHeader, item.PeriodName);
                removeColFormat = removeColFormatTemplate.format(item.ScoreHistoryId);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: nameColFormat },
                              { Name: 'ColFromDate', Value: item.FromDateFormatted },
                              { Name: 'ColToDate', Value: item.ToDateFormatted },
                              { Name: 'ColConfirmedBy', Value: item.ConfirmedBy },
                              { Name: 'ColConfirmedDate', Value: item.ConfirmedDateFormatted },
                              { Name: 'ColRemove', Value: removeColFormat }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divScoreHistoryGrid.fanexGrid(gridOptions);
        handlePageEvents();
    };

    var renderScoreHistoryDetailGrid = function (data, headerName) {
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: 'Trader', Width: 100, Name: 'ColTraderName', HeaderAlign: 'center', CellAlign: 'left',
                          Sort: true, SortDirection: 'desc'
                      },
                      { HeaderText: 'Team', Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: 'Grade', Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      {
                          HeaderText: 'V.Total Point', Width: 120, Name: 'ColTotalPoint', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: 'Point Deduction', Width: 120, Name: 'ColDeduction', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: 'V.Margin', Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: 'V.Turnover', Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: 'V.Win Loss', Width: 120, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      }],
            gridExpandHeight: 220,
            showNumberColumn: true,
            showTitle: true,
            titleInfo: {
                text: headerName
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            },
            showFooter: true
        };
        var bodyData = [];

        if (data !== null) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTraderName', Value: item.TraderName },
                              { Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColGrade', Value: item.GradeName },
                              { Name: 'ColTotalPoint', Value: item.TotalPoint },
                              { Name: 'ColDeduction', Value: common.GetNumWithLabel(item.PointDeduction, labels.NA) },
                              { Name: 'ColMargin', Value: common.GetNumWithLabel(item.Margin, labels.NA) },
                              { Name: 'ColTurnover', Value: common.GetNumWithLabel(item.Turnover, labels.NA) },
                              { Name: 'ColWinLoss', Value: common.GetNumWithLabel(item.WinLoss, labels.NA) }]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divScoreHistoryDetailGrid.fanexGrid(gridOptions);
    };

    var handlePageEvents = function () {
        domElements.divScoreHistoryGrid.on('click', 'span.history-name-link', function () {
            var $obj = $(this);
            var scoreHistoryId = $obj.attr('data-score-history-id');
            var headerName = $obj.attr('data-score-history-header');

            scoreHistory.GetScoreHistoryByPeriod(scoreHistoryId, headerName);
        });

        domElements.divScoreHistoryGrid.on('click', 'span.remove-history-link', function () {
            var $obj = $(this);
            var scoreHistoryId = $obj.attr('data-score-history-id');

            common.ShowConfirmMessage(messages.DeleteScoreHistoryConfirmMessage, function () {
                scoreHistory.DeleteScoreHistory(scoreHistoryId);
            });
        });
    };

    return scoreHistory;
})(jQuery);