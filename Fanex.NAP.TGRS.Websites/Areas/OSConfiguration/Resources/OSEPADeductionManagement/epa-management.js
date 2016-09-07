/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, errorManagementService */
////'use strict';

$(document).ready(function () {
    epaManagement.Initialize();
});

var epaManagement = (function ($) {
    var epaManagement = {};
    epaManagement.GetLeaveHistoryCriteria = [];
    epaManagement.GetErrorHistoryCriteria = [];
    epaManagement.GetEPADeductionHistoryCriteria = [];

    var timeout = null;
    var errorTypes;
    var insertResult = null;

    var domElements = {
        EPAGrid: null,
        divDateRange: null,
        traderName: null,
        divInsertTraderIssueForm: null,
        btnSearch: null,
        hiddenGrid: null,
        divPopup: null,
        divEPADeductionHistoryForm: null,
        divErrorHistoryForm: null,
        divLeaveHistoryForm: null
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
        divErrorSuccessMsg: null,
        divEPADeductionHistoryGrid: null,
        divErrorHistoryGrid: null,
        divLeaveHistoryGrid: null
    };

    function normalizeString(str) {
        return str == null || str.length == 0 ? "-" : str;
    }

    epaManagement.GetEPADeductionReport = function () {
        var criteria = {
            TraderName: domElements.traderName.val(),
            FromDate: domElements.divDateRange.getFrom(),
            ToDate: domElements.divDateRange.getTo(),
        };

        epaManagementService.GetEPADeductionReport(criteria).then(function () {
            renderGrid(epaManagementService.EPADeductionList);
        });
    };

    epaManagement.RenderPopupEPADeductionHistory = function () {
        epaManagementService.GetEPADeductionHistory(epaManagement.GetEPADeductionHistoryCriteria).then(function () {
            makeEPADeductionHistoryForm(epaManagement.GetEPADeductionHistoryCriteria, epaManagementService.EPADeductionHistoryList);
        });
    };

    epaManagement.RenderPopupErrorHistory = function () {
        epaManagementService.GetErrorHistory(epaManagement.GetErrorHistoryCriteria).then(function () {
            makeErrorHistoryForm(epaManagement.GetErrorHistoryCriteria, epaManagementService.ErrorHistoryList);
        });
    };

    epaManagement.RenderPopupLeaveHistory = function () {
        epaManagementService.GetLeaveHistory(epaManagement.GetLeaveHistoryCriteria).then(function () {
            makeLeaveHistoryForm(epaManagement.GetLeaveHistoryCriteria, epaManagementService.LeaveHistoryList);
        });
    };

    epaManagement.GetErrorTypes = function (callback) {
        epaManagementService.GetErrorTypes(function (result) {
            errorTypes = result;
            if (callback != null) {
                callback();
            }
        });
    };

    epaManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        epaManagement.GetErrorTypes();

        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

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
        domElements.divPopup = $('#divPopup');
        domElements.divEPADeductionHistoryForm = $('#divEPADeductionHistoryForm').clone();
        domElements.divErrorHistoryForm = $('#divErrorHistoryForm').clone();
        domElements.divLeaveHistoryForm = $('#divLeaveHistoryForm').clone();

        $('#divHiddenForm').empty();
        $('#divHiddenTraderIssueForm').empty();
    };

    var cachePopupElements = function () {
        popupElements.divInsertTraderIssueForm = $("#divInsertTraderIssueForm", domElements.divPopup);
        popupElements.rdoIssueType = $('#rdoIssueType', domElements.divPopup);
        popupElements.dpkIssueDate = $('#issueDate', domElements.divPopup);
        popupElements.ddlErrorType = $('#ddlErrorType', domElements.divPopup);
        popupElements.tbPointDeduction = $('#tbPointDeduction', domElements.divPopup);
        popupElements.taReason = $('#reason', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);

        popupElements.divEPADeductionHistoryForm = $("#divEPADeductionHistoryForm", domElements.divPopup);
        popupElements.divErrorHistoryForm = $("#divErrorHistoryForm", domElements.divPopup);
        popupElements.divLeaveHistoryForm = $("#divLeaveHistoryForm", domElements.divPopup);

        popupElements.divErrorHistoryGrid = $('#divErrorHistoryGrid', domElements.divPopup);
        popupElements.divLeaveHistoryGrid = $('#divLeaveHistoryGrid', domElements.divPopup);
        popupElements.divEPADeductionHistoryGrid = $('#divEPADeductionHistoryGrid', domElements.divPopup);
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
        epaManagement.OpenPopupInsertPeriodName(traderId);
    }

    var handlePageEvents = function () {

        domElements.btnSearch.on("click", function () {
            epaManagement.GetEPADeductionReport();
        });

        domElements.EPAGrid.on("click", "div.add-issue", function () {
            var $this = $(this).children().first();
            var traderId = $this.attr("data-trader-id");

            addIssue(traderId);
        });

        domElements.EPAGrid.on("click", "span.get-epa-link", function () {
            var $obj = $(this);

            var criteria = {
                TraderName: $obj.attr("data-trader-name"),
                TraderId: $obj.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
            };

            epaManagement.GetEPADeductionHistoryCriteria = criteria;

            epaManagement.RenderPopupEPADeductionHistory();
        });

        domElements.EPAGrid.on("click", "span.get-error-link", function () {
            var $obj = $(this);

            var criteria = {
                TraderName: $obj.attr("data-trader-name"),
                TraderId: $obj.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
            };

            epaManagement.GetErrorHistoryCriteria = criteria;

            epaManagement.RenderPopupErrorHistory();
        });

        domElements.EPAGrid.on("click", "span.get-leave-link", function () {
            var $obj = $(this);

            var criteria = {
                TraderName: $obj.attr("data-trader-name"),
                TraderId: $obj.attr("data-trader-id"),
                FromDate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo(),
            };

            epaManagement.GetLeaveHistoryCriteria = criteria;

            epaManagement.RenderPopupLeaveHistory();
        });
    };

    epaManagement.OpenPopupInsertPeriodName = function (traderId) {
        var form = domElements.divInsertTraderIssueForm.clone();
        var errorTypesSelector = $("#ddlErrorType", form);
        epaManagement.BindErrorTypes(errorTypes, errorTypesSelector);

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

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderIssueForm, 'w')) {
                var issueType = $('input[name=issue-type]:checked').val();

                switch (issueType) {
                    case '1':
                        var errorInfo = {
                            TraderId: traderId,
                            ErrorDate: popupElements.dpkIssueDate.val(),
                            ErrorId: errorTypesSelector.find(":selected").attr("error-id"),
                            Reason: popupElements.taReason.val()
                        };

                        epaManagementService.InsertError(errorInfo).then(function (result) {
                            if (result.Code === 0) {
                                common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.InsertErrorSuccessfully, false, function () {
                                            timeout = setTimeout(common.ClosePopup, 3000);
                                        });

                                epaManagement.GetEPADeductionReport();
                            } else {
                                common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.Message);
                                return false;
                            }
                        });
                        break;
                    case '2':
                        var leaveInfo = {
                            TraderId: traderId,
                            LeaveDate: popupElements.dpkIssueDate.val(),
                            Reason: popupElements.taReason.val()
                        };

                        epaManagementService.InsertLeave(leaveInfo).then(function (result) {
                            if (result.Code === 0) {
                                common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.InsertEmergencyLeaveSuccessfully, false, function () {
                                            timeout = setTimeout(common.ClosePopup, 3000);
                                        });

                                epaManagement.GetEPADeductionReport();
                            } else {
                                common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.Message);
                                return false;
                            }
                        });
                        break;
                    case '3':
                        var deductionInfo = {
                            TraderId: traderId,
                            DeductionDate: popupElements.dpkIssueDate.val(),
                            DeductionValue: popupElements.tbPointDeduction.val(),
                            Reason: popupElements.taReason.val()
                        };

                        epaManagementService.InsertEPADeduction(deductionInfo).then(function (result) {
                            if (result.Code === 0) {
                                common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.InsertEPADeductionSuccessfully, false, function () {
                                            timeout = setTimeout(common.ClosePopup, 3000);
                                        });

                                epaManagement.GetEPADeductionReport();
                            } else {
                                common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.Message);
                                return false;
                            }
                        });
                        break;
                }
            }
        });

        popupElements.btnCancel.click(function () {
            domElements.isOverwrite = false;
            common.ClosePopup();
        });

    };

    epaManagement.BindErrorTypes = function (data, selector, callback) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>").attr("error-id", data[i].IssueId).text(data[i].IssueName);
            selector.append(option);
        }

        if (callback != null) {
            callback(selector);
        }
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

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    var makeEPADeductionHistoryForm = function (criteria, data) {
        var form = domElements.divEPADeductionHistoryForm.clone();

        refreshPopup();

        common.Popup(criteria.TraderName, form);

        cachePopupElements();

        renderEPADeductionHistoryGrid(data);
    };

    var makeErrorHistoryForm = function (criteria, data) {
        var form = domElements.divErrorHistoryForm.clone();

        refreshPopup();

        common.Popup(criteria.TraderName, form);

        cachePopupElements();

        renderErrorHistoryGrid(data);
    };

    var makeLeaveHistoryForm = function (criteria, data) {
        var form = domElements.divLeaveHistoryForm.clone();

        refreshPopup();

        common.Popup(criteria.TraderName, form);

        cachePopupElements();

        renderLeaveHistoryGrid(data);
    };

    var renderEPADeductionHistoryGrid = function (data) {
        var removeColFormatTemplate = '<span class="remove-epa-history-link link delete-button" data-point-history-id="{0}"></span>';

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: '#', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Value', Width: 50, Name: 'DeductionValue', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Deduction Date', Width: 100, Name: 'DeductionDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Reason', Width: 250, Name: 'Reason', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: 'Created Date', Width: 120, Name: 'CreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Created By', Width: 100, Name: 'CreatedBy', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: '', Width: 40, Name: 'Remove', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 500
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var removeColFormat = removeColFormatTemplate.format(item.DeductionId);
                row = {
                    Columns: [{ Name: '#', Value: index + 1 },
                                { Name: 'DeductionValue', Value: item.DeductionValue },
                                { Name: 'DeductionDate', Value: item.DeductionDateFormatted },
                                { Name: 'Reason', Value: item.Reason },
                                { Name: 'CreatedDate', Value: item.CreatedDateFormatted },
                                { Name: 'CreatedBy', Value: item.CreatedBy },
                                { Name: 'Remove', Value: removeColFormat }
                    ]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divEPADeductionHistoryGrid.fanexGrid(gridOptions);
        handleEPAHistoryEvents();
    };

    var renderErrorHistoryGrid = function (data) {
        var removeColFormatTemplate = '<span class="remove-error-history-link link delete-button" data-trader-error-id="{0}"></span>';

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: '#', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Error Name', Width: 70, Name: 'ErrorName', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Value', Width: 50, Name: 'Value', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Error Date', Width: 100, Name: 'ErrorDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Reason', Width: 250, Name: 'Reason', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: 'Created Date', Width: 120, Name: 'CreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Created By', Width: 100, Name: 'CreatedBy', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: '', Width: 40, Name: 'Remove', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 500
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var removeColFormat = removeColFormatTemplate.format(item.TraderErrorId);

                row = {
                    Columns: [{ Name: '#', Value: index + 1 },
                                { Name: 'ErrorName', Value: item.ErrorName },
                                { Name: 'Value', Value: item.Value },
                                { Name: 'ErrorDate', Value: item.ErrorDateFormatted },
                                { Name: 'Reason', Value: item.Reason },
                                { Name: 'CreatedDate', Value: item.CreatedDateFormatted },
                                { Name: 'CreatedBy', Value: item.CreatedBy },
                                { Name: 'Remove', Value: removeColFormat }
                    ]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divErrorHistoryGrid.fanexGrid(gridOptions);
        handleErrorHistoryEvents();
    };

    var renderLeaveHistoryGrid = function (data) {
        var removeColFormatTemplate = '<span class="remove-leave-history-link link delete-button" data-trader-leave-id="{0}"></span>';

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: '#', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Leave Date', Width: 100, Name: 'LeaveDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Reason', Width: 250, Name: 'Reason', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: 'Created Date', Width: 120, Name: 'CreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: 'Created By', Width: 100, Name: 'CreatedBy', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: '', Width: 40, Name: 'Remove', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 500
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var removeColFormat = removeColFormatTemplate.format(item.LeaveId);

                row = {
                    Columns: [{ Name: '#', Value: index + 1 },
                                { Name: 'LeaveDate', Value: item.LeaveDateFormatted },
                                { Name: 'Reason', Value: item.Reason },
                                { Name: 'CreatedDate', Value: item.CreatedDateFormatted },
                                { Name: 'CreatedBy', Value: item.CreatedBy },
                                { Name: 'Remove', Value: removeColFormat }
                    ]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divLeaveHistoryGrid.fanexGrid(gridOptions);
        handleLeaveHistoryEvents();
    };

    var handleEPAHistoryEvents = function () {
        popupElements.divEPADeductionHistoryGrid.on('click', 'span.remove-epa-history-link', function () {
            var $obj = $(this);
            var historyId = $obj.attr('data-point-history-id');

            var criteria = {
                DeductionId: historyId
            };

            common.ShowConfirmMessage("Are you sure you want to delete this history?", function () {
                epaManagementService.DeleteEPADeductionHistory(criteria).then(function () {
                    epaManagement.RenderPopupEPADeductionHistory();
                    epaManagement.GetEPADeductionReport();
                });
            });
        });
    };

    var handleLeaveHistoryEvents = function () {
        popupElements.divLeaveHistoryGrid.on('click', 'span.remove-leave-history-link', function () {
            var $obj = $(this);
            var historyId = $obj.attr('data-trader-leave-id');

            var criteria = {
                LeaveId: historyId
            };

            common.ShowConfirmMessage("Are you sure you want to delete this history?", function () {
                epaManagementService.DeleteLeaveHistory(criteria).then(function () {
                    epaManagement.RenderPopupLeaveHistory();
                    epaManagement.GetEPADeductionReport();
                });
            });
        });
    };

    var handleErrorHistoryEvents = function () {
        popupElements.divErrorHistoryGrid.on('click', 'span.remove-error-history-link', function () {
            var $obj = $(this);
            var historyId = $obj.attr('data-trader-error-id');

            var criteria = {
                TraderErrorId: historyId
            };

            common.ShowConfirmMessage("Are you sure you want to delete this history?", function () {
                epaManagementService.DeleteErrorHistory(criteria).then(function () {
                    epaManagement.RenderPopupErrorHistory();
                    epaManagement.GetEPADeductionReport();
                });
            });
        });
    };

    return epaManagement;
})(jQuery);