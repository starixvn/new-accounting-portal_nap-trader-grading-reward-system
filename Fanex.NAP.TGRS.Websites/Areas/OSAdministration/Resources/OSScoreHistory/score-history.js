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
        divScoreHistoryDetailGrid: null,
        divScoreHistoryDetailContainer: null
    };

    var cacheDOMElements = function () {
        domElements.divScoreHistoryGrid = $('#divScoreHistoryGrid');
        domElements.divScoreHistoryDetailGrid = $('#divScoreHistoryDetailGrid');
        domElements.divScoreHistoryDetailContainer = $('#scoreHistoryDetailContainer');
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
            gridExpandHeight: 220,
            enableHiddenColumns: false,
            hiddenColumns: hasEditRight ? [] : [6],
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
        domElements.divScoreHistoryDetailContainer.css({"display": "none"});
        handlePageEvents();
    };

    var renderScoreHistoryDetailGrid = function (data, headerName) {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [
                    {
                        Columns: [
                                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', MergeRowNumber: 2 },
                                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true, MergeRowNumber: 2 },
                                { HeaderText: 'Team ', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left', MergeRowNumber: 2 },
                                { HeaderText: 'Grade', Width: 100, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left', MergeRowNumber: 2 },
                                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', MergeRowNumber: 2 },
                                { HeaderText: 'P.Deduction', Width: 100, Name: 'colEPADeduction', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', MergeRowNumber: 2 },

                                { HeaderText: "Juice", Name: "colTurnoverJuice", MergeColNumber: 4 },
                                { HeaderText: "Leftover", Name: "colTurnoverLeftover", MergeColNumber: 4 },
                                { HeaderText: "Total", Name: "colWinloss", MergeColNumber: 3 }
                        ]
                    }
            ],
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'Team ', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Grade', Width: 100, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'P.Deduction', Width: 100, Name: 'colEPADeduction', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 130, Name: 'colTurnoverJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 110, Name: 'colJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginJuice', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'Margin on Total', Width: 100, Name: 'colMarginJuiceTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 130, Name: 'colTurnoverLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 110, Name: 'colLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMarginLeftover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin on Total', Width: 100, Name: 'colMarginLeftoverTotal', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },

                { HeaderText: 'V.Turnover', Width: 130, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Win Loss', Width: 110, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$', Sort: true }
            ],
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
                    Columns: [
                        { Name: 'colNum', Value: index + 1 },
                        { Name: 'colTraderName', Value: item.TraderName },
                        { Name: 'colTeam', Value: item.TeamName },
                        { Name: 'colGrade', Value: item.GradeName },
                        { Name: 'colPoint', Value: item.TotalPoint },
                        { Name: 'colEPADeduction', Value: item.PointDeduction },

                        { Name: 'colTurnoverJuice', Value: item.TurnoverJuice },
                        { Name: 'colJuice', Value: item.Juice },
                        { Name: 'colMarginJuice', Value: item.JuiceMargin },
                        { Name: 'colMarginJuiceTotal', Value: item.JuiceMarginTotal },

                        { Name: 'colTurnoverLeftover', Value: item.TurnoverLeftover },
                        { Name: 'colLeftover', Value: item.WinlostLeftover },
                        { Name: 'colMarginLeftover', Value: item.LeftoverMargin },
                        { Name: 'colMarginLeftoverTotal', Value: item.LeftoverMarginTotal },

                        { Name: 'colTurnover', Value: item.Turnover },
                        { Name: 'colWinloss', Value: item.WinLoss },
                        { Name: 'colMargin', Value: item.Margin }
                    ]
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
            var headerName = $obj.attr('data-score-history-header').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

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

    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    };

    return scoreHistory;
})(jQuery);