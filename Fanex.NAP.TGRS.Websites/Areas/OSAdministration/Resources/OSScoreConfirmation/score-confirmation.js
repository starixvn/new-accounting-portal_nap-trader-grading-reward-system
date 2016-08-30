/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages */
////'use strict';

$(function () {
    scoreConfirmation.Initialize();
});

var scoreConfirmation = (function ($) {
    var scoreConfirmation = {};

    var ExportTraderScoresUrl = common.ResolveRootUrl("OSScoreConfirmation/ExportTraderScores");
    var timeout = null;
    var domElements = {
        divDateRange: null,
        btnSearch: null,
        ddlPeriodType: null,
        btnConfirm: null,
        divGrid: null,
        divInsertPeriodNameForm: null,
        divPopup: null,
        isOverwrite: false
    };

    var popupElements = {
        divInsertPeriodNameForm: null,
        txtPeriodName: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.btnConfirm = $('#btnConfirm');
        domElements.divGrid = $("#resultContainer");

        domElements.divInsertPeriodNameForm = $('#divInsertPeriodNameForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

    // Cache POPUP Elements.
    var cachePopupElements = function () {
        popupElements.divInsertPeriodNameForm = $("#divInsertPeriodNameForm", domElements.divPopup);
        popupElements.txtPeriodName = $('#txtPeriodName', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
    };

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });
    };

    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();

        //btnSearch
        domElements.btnSearch.click(function () {
            var criteria = {
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo()
            };
            common.DisableInput();
            ScoreConfirmationService.GetTraderScores(criteria).then(function () {
                cachedData = ScoreConfirmationService.TraderScores;
                renderTraderGrid(cachedData);
            });
        });

        //btnConfirm
        domElements.btnConfirm.click(function () {
            scoreConfirmation.OpenPopupInsertPeriodName();
        });
    };

    function renderTraderGrid(data) {
        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colTeam', Value: item.TeamName },
                    { Name: 'colGrade', Value: item.GradeName },
                    { Name: 'colPoint', Value: item.TotalPoint },
                    { Name: 'colMargin', Value: item.Margin },
                    { Name: 'colTurnover', Value: item.Turnover },
                    { Name: 'colWinloss', Value: item.WinLoss }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'Team ', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Grade', Width: 100, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V.Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'V.Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' },
                { HeaderText: 'V.Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'},
                { HeaderText: 'V.Win Loss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right', FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 220,
            showTitle: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            },
            titleInfo: {
                showExcelButton: true,
                exportExcelFunction: function () {
                    exportTraderScores();
                }
            }
        };
        domElements.divGrid.removeClass("hide");
        $(".freegrid", domElements.divGrid).fanexGrid(options);
    };

    // Export bet type performance to excel.
    var exportTraderScores = function () {
        var parameters = {
            Fromdate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo()
        };
        common.DownloadFile(ExportTraderScoresUrl, parameters);
    };

    scoreConfirmation.OpenPopupInsertPeriodName = function () {
        var form = domElements.divInsertPeriodNameForm.clone();

        refreshPopup();
        common.Modal("Store Trader's Scores by Period", form);
        cachePopupElements();

        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });
        
        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertPeriodNameForm, 'w')) {
                var confirmedScore = {
                    PeriodName: $.trim(popupElements.txtPeriodName.val()),
                    FromDate: domElements.divDateRange.getFrom(),
                    ToDate: domElements.divDateRange.getTo(),
                    IsOverwrite: domElements.isOverwrite
                };

                ScoreConfirmationService.StoreTraderConfirmedScores(confirmedScore).then(function () {                    
                    scoreConfirmation.Result = ScoreConfirmationService.Result;
                    if (scoreConfirmation.Result.result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.StoreTraderScoreSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        updateLastestInfo(scoreConfirmation.Result.lastestScoreHistory);
                        //disablePopup();
                        reloadPage();
                    } else {
                        if (scoreConfirmation.Result.result.Code == 4101)
                        {
                            domElements.isOverwrite = true;
                        }

                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, scoreConfirmation.Result.result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            domElements.isOverwrite = false;
            common.ClosePopup();
        });
    };
    
    var refreshPopup = function () {
        clearTimeout(timeout);
        domElements.isOverwrite = false;
        common.CloseMsgBox();
    };

    var updateLastestInfo = function (info) {
        $('#latestConfirm-periodname').text(info.PeriodName);
        $('#latestConfirm-from').text(info.FormattedFromDate);
        $('#latestConfirm-to').text(info.FormattedToDate);
        $('#latestConfirm-creator').text(info.Creator);
    };

    scoreConfirmation.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };

    return scoreConfirmation;
})(jQuery);