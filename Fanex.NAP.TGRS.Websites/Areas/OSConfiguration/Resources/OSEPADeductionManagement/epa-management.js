/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, errorManagementService */
////'use strict';

$(document).ready(function () {
    epaManagement.Initialize();
});

var epaManagement = (function ($) {
    var epaManagement = {};

    var domElements = {
        EPAGrid: null,
        divDateRange: null,
        traderName: null,
        divInsertTraderIssueForm: null,
        btnSearch: null,
        hiddenGrid: null
    };

    var popupElements = {
        divInsertTraderIssueForm: null,
        rdoIssueType: null,
        dpkIssueDate: null,
        ddlErrorType: null,
        tbPointDeduction: null,
        taReason: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    function normalizeString(str) {
        return str == null || str.length == 0 ? "-" : str;
    }

    epaManagement.GetEPADeductionReport = function () {
        var criteria = {
            TraderName: '',
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
        };

        epaManagementService.GetEPADeductionReport(criteria).then(function () {
            renderGrid(epaManagementService.EPADeductionList);
        });;
    };

    epaManagement.Initialize = function () {
        cacheDOMElements();

        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

        handlePageEvents();
        epaManagement.GetEPADeductionReport();
    };

    var cacheDOMElements = function () {
        domElements.EPAGrid = $('#divEPAGrid');
        domElements.divDateRange = $('#divDateRange');
        domElements.lnkAddNewError = $('#newErrLink');
        domElements.traderName = $("#txtTraderName");
        domElements.divInsertTraderIssueForm = $('#divInsertTraderIssueForm').clone();
        domElements.btnSearch = $("#btnSearch");
        domElements.hiddenGrid = $("#popupGrid");
        domElements.divUpdateErrorForm = $('#divUpdateErrorForm').clone();

        $('#divHiddenForm').empty();
        $('#divHiddenTraderIssueForm').empty();
    };

    // Cache POPUP Elements.
    var cachePopupElements = function () {
        popupElements.divInsertTraderIssueForm = $("#divInsertTraderIssueForm", domElements.divPopup);
        popupElements.rdoIssueType = $('#rdoIssueType', domElements.divPopup);
        popupElements.dpkIssueDate = $('#dpkIssueDate', domElements.divPopup);
        popupElements.ddlErrorType = $('#ddlErrorType', domElements.divPopup);
        popupElements.tbPointDeduction = $('#tbPointDeduction', domElements.divPopup);
        popupElements.taReason = $('#taReason', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
    };

    function renderGrid(data) {
        var addIssueFormat = '<div class="add-issue-link" data-trader-id="{0}" href="#" data-trader-name="{1}"></div>';
        var linkFormat = '<span class="{0} link" data-trader-id="{1}" data-trader-name="{3}">{2}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'ColNum', Value: idx + 1 },
                            { Name: 'ColName', Value: item.TraderName },
                            { Name: 'ColEPA', Value: item.PointDeduction == 0 ? 0 : linkFormat.format("get-epa-link", item.TraderId, item.PointDeduction, item.TraderName) },
                            { Name: 'ColError', Value: item.ErrorCount == 0 ? 0 : linkFormat.format("get-error-link", item.TraderId, item.ErrorCount, item.TraderName) },
                            { Name: 'ColLeave', Value: item.LeaveCount == 0 ? 0 : linkFormat.format("get-leave-link", item.TraderId, item.LeaveCount, item.TraderName) },
                            { Name: 'ColErrorInsert', Value: addIssueFormat.format(item.TraderId, item.TraderName), CssClass: 'add-issue' }
                ]
            }
        }

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Username", Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "EPA P.Deduction", Width: 100, Name: 'ColEPA', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Error", Width: 40, Name: 'ColError', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "E.Leave", Width: 50, Name: 'ColLeave', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "", Width: 50, Name: 'ColErrorInsert', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 100,
            bodyRows: data.map(mapper)
        };

        domElements.EPAGrid.fanexGrid(gridOptions);
    }

    function addIssue(traderId) {
        epaManagement.OpenPopupInsertPeriodName();
    }

    var handlePageEvents = function () {
        domElements.EPAGrid.on("click", "div.add-issue", function () {
            var $this = $(this).children().first();
            var traderId = $this.attr("data-trader-id");

            addIssue(traderId);
        });
    };

    epaManagement.OpenPopupInsertPeriodName = function () {
        var form = domElements.divInsertTraderIssueForm.clone();
        refreshPopup();
        common.Modal("New Error/E.Leave/-EPA", form);
        cachePopupElements();
        initInsertTraderIssueForm();

        var maxDate = new Date();
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date();
        minDate.setYear(minDate.getFullYear() - 1);
        layout.CreateDatepicker($("#dpkIssueDate", domElements.divPopup), 'issueDate', "Date", 'lbl-field width-120', new Date(), minDate, maxDate);
        popupElements.dpkIssueDate = $('#issueDate', domElements.divPopup).addClass("width-200");
        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderIssueForm, 'w')) {
                /*var confirmedScore = {
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
                        reloadPage();
                    } else {
                        if (scoreConfirmation.Result.result.Code == 4101) {
                            domElements.isOverwrite = true;
                        }

                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, scoreConfirmation.Result.result.Message);
                        return false;
                    }
                });*/
            }
        });

        popupElements.btnCancel.click(function () {
            domElements.isOverwrite = false;
            common.ClosePopup();
        });
    };

    var initInsertTraderIssueForm = function () {
        $('div.issue-deduction').hide();

        $('input[name=issue-type]').on('change', function () {
            var type = $(this).val();
            switch (type) {
                case '1':
                    $('div.issue-error').show();
                    $('div.issue-deduction').hide();
                    break;
                case '2':
                    $('div.issue-error').hide();
                    $('div.issue-deduction').hide();
                    break;
                case '3':
                    $('div.issue-error').hide();
                    $('div.issue-deduction').show();
                    break;
            }
        });
    };

    return epaManagement;
})(jQuery);