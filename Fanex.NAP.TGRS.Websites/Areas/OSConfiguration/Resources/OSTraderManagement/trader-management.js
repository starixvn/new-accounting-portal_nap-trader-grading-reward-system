/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(document).ready(function () {
    traderManagement.Initialize();
});

var traderManagement = (function ($) {
    var traderManagement = {};
    traderManagement.Traders = traderManagementService.Traders;
    traderManagement.TraderTeamHistory = traderManagementService.TraderTeamHistory;
    traderManagement.TraderGradeHistory = traderManagementService.TraderGradeHistory;
    traderManagement.TraderEPADeduction = traderManagementService.TraderEPADeduction;
    traderManagement.TraderError = traderManagementService.TraderError;
    traderManagement.Result = traderManagementService.Result;

    var timeout = null;
    var domElements = {
        divTradersGrid: null,
        lnkAddNewTrader: null,
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
        divPopup: null,
        divPopupGrid: null,
        divInsertIssueForm: null
    };

    var popupElements = {
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
        txtTraderName: null,
        txtTraderDes: null,
        txtTraderId: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null,
        divFirstWorkingDate: null,
    };

    traderManagement.GetTraders = function (traderName, teamId, gradeId) {
        var criteria = {
            traderName: traderName,
            teamId: teamId,
            gradeId: gradeId
        };

        traderManagementService.GetTraders(criteria).then(function () {
            traderManagement.Traders = traderManagementService.Traders;

            renderGrid(traderManagement.Traders);
        });
    };

    traderManagement.OpenPopupAddNewTrader = function () {
        var form = domElements.divInsertTraderForm.clone();

        refreshPopup();
        common.Modal(labels.NewTrader, form);
        cachePopupElements();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var trader = {
                    TraderName: $.trim(popupElements.txtTraderName.val()),
                    Description: $.trim(popupElements.txtTraderDes.val())
                };

                traderManagementService.InsertTrader(trader).then(function () {
                    traderManagement.Result = traderManagementService.Result;

                    if (traderManagement.Result.ErrorCode === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddTraderSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        reloadPage(traderManagement.Result.UpdatedItems.TraderInfoItems);
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, traderManagement.Result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.OpenPopupUpdateTrader = function (traderId, traderName) {
        var form = domElements.divUpdateTraderForm.clone();

        refreshPopup();
        common.Modal(labels.EditTrader, form);
        cachePopupElements();

        popupElements.txtTraderName.val(traderName);
        popupElements.txtTraderId.val(traderId);

        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);

        layout.CreateDatepicker($("#dpkGradeEffectiveDate", domElements.divPopup), 'gradeEffectiveDate', '', '',
           datepickerSetting.Today, minDate, maxDate);
        layout.CreateDatepicker($("#dpkTeamEffectiveDate", domElements.divPopup), 'teamEffectiveDate', '', '',
         datepickerSetting.Today, minDate, maxDate);

        popupElements.GradeEffectiveDate = $("#gradeEffectiveDate", domElements.divPopup).css("width", "99px");
        popupElements.TeamEffectiveDate = $("#teamEffectiveDate", domElements.divPopup).css("width", "99px");

        $("#dpkGradeEffectiveDate", domElements.divPopup).next().remove();
        $("#dpkTeamEffectiveDate", domElements.divPopup).next().remove();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var trader = {
                    TraderId: $.trim(popupElements.txtTraderId.val()),
                    TraderName: $.trim(popupElements.txtTraderName.val()),
                    Description: $.trim(popupElements.txtTraderDes.val())
                };

                traderManagementService.UpdateTrader(trader).then(function () {
                    traderManagement.Result = traderManagementService.Result;

                    if (traderManagement.Result.ErrorCode === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateTraderSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });
                        disablePopup();
                        reloadPage(traderManagement.Result.UpdatedItems.TraderInfoItems);
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, traderManagement.Result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.OpenPopupTraderTeamHistory = function (traderId) {
        refreshPopup();
        common.Modal(labels.TeamHistory, domElements.divPopupGrid);
        traderManagementService.GetTraderTeamHistory(traderId).then(function () {
            traderManagement.TraderTeamHistory = traderManagementService.TraderTeamHistory;
            renderHistoryGrid("Team", traderManagement.TraderTeamHistory);
        });
    };

    traderManagement.OpenPopupTraderGradeHistory = function (traderId) {
        refreshPopup();

        common.Modal(labels.GradeHistory, domElements.divPopupGrid);

        traderManagementService.GetTraderGradeHistory(traderId).then(function () {
            traderManagement.TraderGradeHistory = traderManagementService.TraderGradeHistory;
            renderHistoryGrid("Grade", traderManagement.TraderGradeHistory);
        });
    };

    traderManagement.OpenPopupTraderEPADeduction = function (traderId) {
        refreshPopup();

        common.Modal(labels.EPADeduction, domElements.divPopupGrid);

        traderManagementService.GetTraderEPADeduction(traderId).then(function () {
            traderManagement.TraderEPADeduction = traderManagementService.TraderEPADeduction;
            renderErrorGrid(traderManagement.TraderEPADeduction);
        });
    };

    traderManagement.OpenPopupTraderError = function (traderId) {
        refreshPopup();

        common.Modal(labels.Error, domElements.divPopupGrid);

        traderManagementService.GetTraderError(traderId).then(function () {
            traderManagement.TraderError = traderManagementService.TraderError;
            renderErrorGrid(traderManagement.TraderError);
        });
    };

    traderManagement.OpenPopupAddNewTraderError = function (traderId) {
        refreshPopup();

        common.Modal(labels.Error, domElements.divInsertIssueForm.clone());

        cachePopupElements();

        var issuePopup = getErrorPopupElements();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(issuePopup.issueForm, 'w')) {
                var issue = {
                    TraderId: traderId,
                    IssueId: issuePopup.IssueType.val(),
                    IssueDate: issuePopup.issueDate.val(),
                    Value: issuePopup.issueValue.val(),
                    Reason: issuePopup.issueReason.val()
                };

                traderManagementService.InsertTraderIssue(issue).then(function () {
                    var xhrResult = traderManagementService.Result;

                    if (xhrResult.ErrorCode == 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddIssueSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        reloadPage(xhrResult.UpdatedItems.TraderInfoItems);
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, xhrResult.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        traderManagement.GetTraders();
    };

    var cacheDOMElements = function () {
        domElements.divTradersGrid = $('#divTradersGrid');
        domElements.lnkAddNewTrader = $('#lnkAddNewTrader');
        domElements.divInsertTraderForm = $('#divInsertTraderForm').clone();
        domElements.divUpdateTraderForm = $('#divUpdateTraderForm').clone();
        domElements.divPopup = $('#divPopup');
        domElements.divPopupGrid = $("#popupGrid");
        domElements.divInsertIssueForm = $("#divInsertIssueForm");
        $('#divHiddenForm').empty();
    };

    var cachePopupElements = function () {
        popupElements.divInsertTraderForm = $("#divInsertTraderForm", domElements.divPopup);
        popupElements.divUpdateTraderForm = $("#divUpdateTraderForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtTraderName = $('#txtTraderName', domElements.divPopup);
        popupElements.txtTraderDes = $('#txtTraderDes', domElements.divPopup);
        popupElements.txtTraderId = $('#txtTraderId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);

        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);
        layout.CreateDatepicker($("#dpkFirstWorkingDate", domElements.divPopup), 'firstWorkingDate', labels.FirstWorkingDate, 'lbl-field width-120',
           datepickerSetting.Today, minDate, maxDate);
        popupElements.divFirstWorkingDate = $('#firstWorkingDate', domElements.divPopup).addClass("width-200");
    };

    var getErrorPopupElements = function () {
        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);

        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);

        layout.CreateDatepicker($("#dpkIssue", domElements.divPopup), 'issueDate', labels.Date, 'lbl-field width-80',
            datepickerSetting.Today, minDate, maxDate);

        return {
            IssueType: $("#issueType", domElements.divPopup),
            issueDate: $("#issueDate", domElements.divPopup).addClass("width-200"),
            issueValue: $("#txtIssueValue", domElements.divPopup),
            issueReason: $("#txtIssueReason", domElements.divPopup),
            issueForm: $("#divInsertIssueForm", domElements.divPopup),
        };
    }

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-trader-link link" data-trader-id="{0}" data-trader-name="{1}">{1}</span>';
        var linkFormat = '<span class="{0} link" data-trader-id="{1}">{2}</span>';
        var descColFormat = '<span class="wordwrap-span" id="traderDesc_{0}">{1}</span>';
        var addIssueFormat = '<div><a class="add-issue-link" data-trader-id="{0}" href="#"><img src="../../../../Content/Themes/Images/add-icon.ico" style="width: 15px;height: 15px" ></a></div>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Username", Width: 100, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Employee ID", Width: 100, Name: 'ColId', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 80, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Grade, Width: 80, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "EPA P.Deduction", Width: 200, Name: 'ColEPA', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Error", Width: 40, Name: 'ColError', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "First Working Date", Width: 180, Name: 'ColWorkingDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 80, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 80, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Issue", Width: 80, Name: 'ColErrorInsert', HeaderAlign: 'center', CellAlign: 'center' }, ],
            showNumberColumn: true,
            gridExpandHeight: 100
        };
        var editableTraderNameCol = "";
        var traderDescCol = "";
        var traderNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTraderNameCol = nameColFormat.format(item.TraderId, item.Username);
                traderNameCol = item.TraderName;
                traderDescCol = descColFormat.format(item.TraderId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableTraderNameCol : traderNameCol },
                              { Name: 'ColId', Value: item.EmployeeId },
                              { Name: 'ColTeam', Value: linkFormat.format("get-team-link", item.TraderId, item.Team) },
                              { Name: 'ColGrade', Value: linkFormat.format("get-grade-link", item.TraderId, item.Grade) },
                              { Name: 'ColEPA', Value: linkFormat.format("get-epa-link", item.TraderId, item.EPADeduction) },
                              { Name: 'ColError', Value: linkFormat.format("get-error-link", item.TraderId, item.Error) },
                              { Name: 'ColWorkingDate', Value: item.FirstWorkingDate },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.Creator },
                              { Name: 'ColErrorInsert', Value: addIssueFormat.format(item.TraderId) }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTradersGrid.fanexGrid(gridOptions);
    };

    var renderHistoryGrid = function (type, data) {
        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTime', Value: item.UpdatedTime },
                    { Name: 'colOld', Value: item.Old },
                    { Name: 'colNew', Value: item.New },
                    { Name: 'colUpdator', Value: item.Updator }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Updated Time', Width: 80, Name: 'colTime', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Old ' + type, Width: 80, Name: 'colOld', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'New ' + type, Width: 80, Name: 'colNew', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Updated By', Width: 80, Name: 'colUpdator', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper)
        };

        domElements.divPopupGrid.fanexGrid(options);
    }

    var renderErrorGrid = function (data) {
        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTime', Value: item.Date },
                    { Name: 'colValue', Value: item.Value },
                    { Name: 'colReason', Value: item.Reason },
                    { Name: 'colCreator', Value: item.Creator }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Date Time', Width: 80, Name: 'colTime', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Value ', Width: 80, Name: 'colValue', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Reason ', Width: 80, Name: 'colReason', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Added By', Width: 80, Name: 'colCreator', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper)
        };

        domElements.divPopupGrid.fanexGrid(options);
    }

    var reloadPage = function (data) {
        renderGrid(data);
    };

    var disablePopup = function () {
        popupElements.txtTraderName.prop('disabled', true);
        popupElements.txtTraderDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    var handlePageEvents = function () {
        domElements.lnkAddNewTrader.off('click');
        domElements.lnkAddNewTrader.on('click', function () {
            traderManagement.OpenPopupAddNewTrader();
        });

        domElements.divTradersGrid.off('click');
        domElements.divTradersGrid.on('click', 'span.edit-trader-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');

            traderManagement.OpenPopupUpdateTrader(traderId, traderName);
        });

        domElements.divTradersGrid.on('click', 'span.get-team-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');

            traderManagement.OpenPopupTraderTeamHistory(traderId);
        });

        domElements.divTradersGrid.on('click', 'span.get-grade-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');

            traderManagement.OpenPopupTraderGradeHistory(traderId);
        });

        domElements.divTradersGrid.on('click', 'span.get-epa-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');

            traderManagement.OpenPopupTraderEPADeduction(traderId);
        });

        domElements.divTradersGrid.on('click', 'span.get-error-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');

            traderManagement.OpenPopupTraderError(traderId);
        });

        domElements.divTradersGrid.on('click', 'a.add-issue-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');

            traderManagement.OpenPopupAddNewTraderError(traderId);
        })
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return traderManagement;
})(jQuery);