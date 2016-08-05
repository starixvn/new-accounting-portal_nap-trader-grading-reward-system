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
        divInsertIssueForm: null,
        teamSelector: null,
        gradeSelector: null,
        traderFilterForm: null,
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
        FirstWorkingDate: null,
    };

    var teams;

    var grades;

    traderManagement.GetTeam = function (callback) {
        traderManagementService.GetTeam(function (result) {
            teams = result;
            if (callback != null) {
                callback();
            }
        });
    };

    traderManagement.GetGrade = function (callback) {
        traderManagementService.GetGrade(function (result) {
            grades = result;

            if (callback != null) {
                callback();
            }
        });
    };

    traderManagement.GetTradersAll = function () {
        common.DisableInput();

        if (teams == null) {
            traderManagement.GetTeam(function () {
                traderManagement.AddTeams(teams, domElements.teamSelector);
            });
        }

        if (grades == null) {
            traderManagement.GetGrade(function () {
                traderManagement.AddGrades(grades, domElements.gradeSelector);
            });
        }

        traderManagementService.GetTraders().then(function () {
            traderManagement.Traders = traderManagementService.Traders;

            renderGrid(traderManagement.Traders);
        });
    };

    traderManagement.getTraderByNameTeamGrade = function (traderName, team, grade) {
        var criteria = {
            TraderName: $.trim(traderName),
            TeamId: team,
            GradeId: grade
        };

        common.DisableInput();

        $.post(common.ResolveRootUrl("OSTraderManagement/GetTraderByNameTeamGrade"), criteria)
            .success(function (result) {
                renderGrid(result);
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    }

    traderManagement.OpenPopupAddNewTrader = function () {
        var form = domElements.divInsertTraderForm.clone();

        var teamSelector = $("#ddlTeamPopup", form);
        var gradeSelector = $("#ddlGradePopup", form);

        traderManagement.AddTeams(teams, teamSelector);
        traderManagement.AddGrades(grades, gradeSelector);

        refreshPopup();
        common.Modal(labels.NewTrader, form);
        cachePopupElements();

        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);
        layout.CreateDatepicker($("#dpkFirstWorkingDate", domElements.divPopup), 'firstWorkingDate', labels.FirstWorkingDate, 'lbl-field width-120',
           datepickerSetting.Today, minDate, maxDate);
        popupElements.FirstWorkingDate = $('#firstWorkingDate', domElements.divPopup).addClass("width-200");

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var teamId = teamSelector.find(":selected").attr("team-id");
                var gradeId = gradeSelector.find(":selected").attr("grade-id");

                var trader = {
                    TraderName: $.trim(popupElements.txtTraderName.val()),
                    EmployeeId: $.trim(popupElements.txtEmployeeId.val()),
                    TeamId: teamId,
                    GradeId: gradeId,
                    FirstWorkingDate: popupElements.FirstWorkingDate.val()
                };

                traderManagementService.InsertTrader(trader).then(function () {
                    var result = traderManagementService.Result;

                    if (result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddTraderSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        traderManagement.GetTradersAll();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.OpenPopupUpdateTrader = function (traderId, traderName, traderEmpId, team, grade, workingDate, teamDate, gradeDate) {
        var form = domElements.divUpdateTraderForm.clone();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.EditTrader);

        refreshPopup();
        common.Modal(title, form);
        cachePopupElements();

        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);
        layout.CreateDatepicker($("#dpkFirstWorkingDate", domElements.divPopup), 'firstWorkingDate', labels.FirstWorkingDate, 'lbl-field width-120',
           workingDate, minDate, maxDate);
        popupElements.FirstWorkingDate = $('#firstWorkingDate', domElements.divPopup).addClass("width-200").css("background", "url('../Content/DatePicker/images/icon-calendar.png') no-repeat scroll 98.5% 50% white");

        var teamSelector = $("#ddlTeamPopup", form);
        var gradeSelector = $("#ddlGradePopup", form);

        var selectTeam = function (selector) {
            selector.children().filter(function (indx, ele) {
                return ele.text == team;
            }).prop("selected", true);
        };

        var selectGrade = function (selector) {
            selector.children().filter(function (indx, ele) {
                return ele.text == grade;
            }).prop("selected", true);
        };

        traderManagement.AddTeams(teams, teamSelector, selectTeam);
        traderManagement.AddGrades(grades, gradeSelector, selectGrade);

        popupElements.txtTraderName.val(traderName);
        popupElements.txtTraderId.val(traderId);
        popupElements.txtEmployeeId.val(traderEmpId);

        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setYear(maxDate.getFullYear() + 1);
        var minDate = new Date(datepickerSetting.Today);
        minDate.setYear(minDate.getFullYear() - 5);

        layout.CreateDatepicker($("#dpkGradeEffectiveDate", domElements.divPopup), 'gradeEffectiveDate', '', '',
           gradeDate, minDate, maxDate);
        layout.CreateDatepicker($("#dpkTeamEffectiveDate", domElements.divPopup), 'teamEffectiveDate', '', '',
         teamDate, minDate, maxDate);

        popupElements.GradeEffectiveDate = $("#gradeEffectiveDate", domElements.divPopup).css("width", "99px");
        popupElements.TeamEffectiveDate = $("#teamEffectiveDate", domElements.divPopup).css("width", "99px");

        $("#dpkGradeEffectiveDate", domElements.divPopup).next().remove();
        $("#dpkTeamEffectiveDate", domElements.divPopup).next().remove();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateTraderForm, 'w')) {
                var teamId = teamSelector.find(":selected").attr("team-id");
                var gradeId = gradeSelector.find(":selected").attr("grade-id");

                var trader = {
                    TraderId: traderId,
                    NewTeamId: teamId,
                    NewGradeId: gradeId,
                    NewFirstWorkingDate: popupElements.FirstWorkingDate.val(),
                    NewGradeEffectiveDate: popupElements.GradeEffectiveDate.val(),
                    NewTeamEffectiveDate: popupElements.TeamEffectiveDate.val(),
                    NewEmployeeId: popupElements.txtEmployeeId.val()
                };

                traderManagementService.UpdateTrader(trader).then(function () {
                    var result = traderManagementService.Result;

                    if (result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateTraderSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 1000);
                        });
                        disablePopup();
                        $("#btnSearch", traderManagement.traderFilterForm).click();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.OpenPopupTraderTeamHistory = function (traderId, traderName) {
        refreshPopup();

        var grid = domElements.divPopupHistory.clone();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.TeamHistory);

        common.Modal(title, grid);

        var criteria = {
            TraderId: traderId
        };

        traderManagementService.GetTraderTeamHistory(criteria).then(function () {
            traderManagement.TraderTeamHistory = traderManagementService.TraderTeamHistory;
            renderHistoryGrid("Team", traderManagement.TraderTeamHistory, grid);
        });
    };

    traderManagement.OpenPopupTraderGradeHistory = function (traderId, traderName) {
        refreshPopup();

        var grid = domElements.divPopupHistory.clone();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.GradeHistory);

        common.Modal(title, grid);

        var criteria = {
            TraderId: traderId
        };

        traderManagementService.GetTraderGradeHistory(criteria).then(function () {
            traderManagement.TraderGradeHistory = traderManagementService.TraderGradeHistory;
            renderHistoryGrid("Grade", traderManagement.TraderGradeHistory, grid);
        });
    };

    traderManagement.OpenPopupTraderEPADeduction = function (traderId, traderName) {
        refreshPopup();

        var grid = domElements.divPopupIssue.clone();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.EPADeduction);

        common.Modal(title, grid);

        var criteria = {
            TraderId: traderId
        };

        traderManagementService.GetTraderEPADeduction(criteria).then(function () {
            traderManagement.TraderEPADeduction = traderManagementService.TraderEPADeduction;
            renderErrorGrid(traderManagement.TraderEPADeduction, grid);
        });
    };

    traderManagement.OpenPopupTraderError = function (traderId, traderName) {
        refreshPopup();

        var grid = domElements.divPopupIssue.clone();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.Error);

        common.Modal(title, grid);

        var criteria = {
            TraderId: traderId
        };

        traderManagementService.GetTraderError(criteria).then(function () {
            traderManagement.TraderError = traderManagementService.TraderError;
            renderErrorGrid(traderManagement.TraderError, grid);
        });
    };

    traderManagement.OpenPopupAddNewTraderError = function (traderId, traderName) {
        refreshPopup();

        var titleTemplate = "{0} - {1}";

        var title = titleTemplate.format(traderName, labels.NewIssue);

        common.Modal(title, domElements.divInsertIssueForm.clone());

        cachePopupElements();

        var issuePopup = getErrorPopupElements();

        traderManagement.AddIssueType(issuePopup.IssueType);

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(issuePopup.issueForm, 'w')) {
                var issue = {
                    TraderId: traderId,
                    IssueTypeId: issuePopup.IssueType.find(":selected").attr("issue-id"),
                    IssuedDate: issuePopup.issueDate.val(),
                    Value: issuePopup.issueValue.val(),
                    Reason: issuePopup.issueReason.val()
                };

                traderManagementService.InsertTraderIssue(issue).then(function () {
                    var result = traderManagementService.Result;

                    if (result.Code == 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddIssueSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 1000);
                        });

                        disablePopup();

                        traderManagement.GetTradersAll();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    traderManagement.AddTeams = function (data, selector, callback) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>").attr("team-id", data[i].TeamId).text(data[i].TeamName);
            selector.append(option);
        }

        if (callback != null) {
            callback(selector);
        }
    }

    traderManagement.AddGrades = function (data, selector, callback) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>").attr("grade-id", data[i].GradeId).text(data[i].GradeName);
            selector.append(option);
        }

        if (callback != null) {
            callback(selector);
        }
    }

    traderManagement.AddIssueType = function (selector) {
        traderManagementService.GetIssueType(function (result) {
            for (var i = 0; i < result.length; i++) {
                var option = $("<option></option>").attr("issue-id", result[i].IssueId).text(result[i].IssueName);
                selector.append(option);
            }
        });
    }

    traderManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        traderManagement.GetTradersAll();
    };

    var cacheDOMElements = function () {
        domElements.divTradersGrid = $('#divTradersGrid');
        domElements.lnkAddNewTrader = $('#lnkAddNewTrader');
        domElements.divInsertTraderForm = $('#divInsertTraderForm').clone();
        domElements.divUpdateTraderForm = $('#divUpdateTraderForm').clone();
        domElements.divPopup = $('#divPopup');
        domElements.divPopupGrid = $("#popupGrid");
        domElements.divInsertIssueForm = $("#divInsertIssueForm");
        domElements.teamSelector = $("#ddlTeam");
        domElements.gradeSelector = $("#ddlGrade");
        domElements.traderFilterForm = $("#divTraderFilterForm");
        domElements.divPopupHistory = $("#popupGridHistory");
        domElements.divPopupIssue = $("#popupGridIssue");
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
        popupElements.txtEmployeeId = $('#txtEmployeeId', domElements.divPopup);
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
        var nameColFormat = '<span class="edit-trader-link link" data-trader-id="{0}"  data-trader-empId="{1}" data-trader-name="{2}" data-team-name="{3}" data-grade-name = "{4}" ' +
            'data-working-date="{5}" data-team-date="{6}" data-grade-date="{7}">{2}</span>';
        var linkFormat = '<span class="{0} link" data-trader-id="{1}" data-trader-name="{3}">{2}</span>';
        var addIssueFormat = '<div><a class="add-issue-link" data-trader-id="{0}" href="#" data-trader-name="{1}"><img src="../../../../Content/Themes/Images/add-icon.ico" style="width: 15px;height: 15px" ></a></div>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Username", Width: 100, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Employee ID", Width: 100, Name: 'ColId', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 150, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "EPA P.Deduction", Width: 100, Name: 'ColEPA', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Error", Width: 40, Name: 'ColError', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "First Working Date", Width: 100, Name: 'ColWorkingDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 200, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 80, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 180,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        if (hasEditRight) {
            gridOptions.columns.push({ HeaderText: "Issue", Width: 50, Name: 'ColErrorInsert', HeaderAlign: 'center', CellAlign: 'center' });
        }

        var editableTraderNameCol = "";
        var traderNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTraderNameCol = nameColFormat.format(item.TraderId, item.EmployeeId, item.TraderName, item.TeamName, item.GradeName, item.FirstWorkingDate, item.TeamModifiedDate, item.GradeModifiedDate);
                traderNameCol = item.TraderName;
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableTraderNameCol : traderNameCol },
                              { Name: 'ColId', Value: item.EmployeeId.length == 0 ? "-" : item.EmployeeId },
                              { Name: 'ColTeam', Value: linkFormat.format("get-team-link", item.TraderId, item.TeamName, item.TraderName) },
                              { Name: 'ColGrade', Value: linkFormat.format("get-grade-link", item.TraderId, item.GradeName, item.TraderName) },
                              { Name: 'ColEPA', Value: item.EPADeduction == 0 ? 0 : linkFormat.format("get-epa-link", item.TraderId, item.EPADeduction, item.TraderName) },
                              { Name: 'ColError', Value: item.Error == 0 ? 0 : linkFormat.format("get-error-link", item.TraderId, item.Error, item.TraderName) },
                              { Name: 'ColWorkingDate', Value: item.FirstWorkingDate },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedBy }
                    ]
                };

                if (hasEditRight) {
                    row.Columns.push({ Name: 'ColErrorInsert', Value: addIssueFormat.format(item.TraderId, item.TraderName) });
                }

                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTradersGrid.fanexGrid(gridOptions);
    };

    var renderHistoryGrid = function (type, data, grid) {
        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTime', Value: item.UpdatedDate },
                    { Name: 'colNew', Value: item["New" + type] == null ? "-" : item["New" + type] },
                    { Name: 'colUpdator', Value: item.UpdatedBy }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Updated Date', Width: 120, Name: 'colTime', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'New ' + type, Width: 150, Name: 'colNew', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Updated By', Width: 80, Name: 'colUpdator', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper)
        };

        grid.fanexGrid(options);
    }

    var renderErrorGrid = function (data, div) {
        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTime', Value: item.CreatedDate },
                    { Name: 'colValue', Value: item.Value },
                    { Name: 'colReason', Value: item.Reason },
                    { Name: 'colCreator', Value: item.CreatedBy }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Date Time', Width: 150, Name: 'colTime', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Value ', Width: 40, Name: 'colValue', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Reason ', Width: 300, Name: 'colReason', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Added By', Width: 80, Name: 'colCreator', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper)
        };

        div.fanexGrid(options);
    }

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
            var traderId = $obj.attr('data-trader-id')
            var traderName = $obj.attr('data-trader-name');
            var traderEmpId = $obj.attr("data-trader-empId");
            var team = $obj.attr("data-team-name");
            var grade = $obj.attr("data-grade-name");
            var workingDate = $obj.attr("data-working-date");
            var teamDate = $obj.attr("data-team-date");
            var gradeDate = $obj.attr("data-grade-date");

            traderManagement.OpenPopupUpdateTrader(traderId, traderName, traderEmpId, team, grade, workingDate, teamDate, gradeDate);
        });

        domElements.divTradersGrid.on('click', 'span.get-team-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');

            traderManagement.OpenPopupTraderTeamHistory(traderId, traderName);
        });

        domElements.divTradersGrid.on('click', 'span.get-grade-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');
            traderManagement.OpenPopupTraderGradeHistory(traderId, traderName);
        });

        domElements.divTradersGrid.on('click', 'span.get-epa-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');

            traderManagement.OpenPopupTraderEPADeduction(traderId, traderName);
        });

        domElements.divTradersGrid.on('click', 'span.get-error-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');

            traderManagement.OpenPopupTraderError(traderId, traderName);
        });

        domElements.divTradersGrid.on('click', 'a.add-issue-link', function () {
            var $obj = $(this);
            var traderId = $obj.attr('data-trader-id');
            var traderName = $obj.attr('data-trader-name');

            traderManagement.OpenPopupAddNewTraderError(traderId, traderName);
        });

        domElements.traderFilterForm.on('click', "#btnSearch", function () {
            if (validator.ValidateForm(domElements.traderFilterForm, 'w')) {
                var traderName = $("#txtUserName", domElements.traderFilterForm).val();
                var teamId = $("#ddlTeam", domElements.traderFilterForm).find(":selected").attr("team-id");
                var gradeId = $("#ddlGrade", domElements.traderFilterForm).find(":selected").attr("grade-id");

                traderManagement.getTraderByNameTeamGrade(traderName, teamId, gradeId);
            }

            setTimeout(function () {
                validator.ClearErrors(domElements.traderFilterForm);
            }, 3000);
        });

        domElements.traderFilterForm.on('keyup', "#txtUserName", function (e) {
            if (e.keyCode == 13) {
                if (validator.ValidateForm(domElements.traderFilterForm, 'w')) {
                    var traderName = $("#txtUserName", domElements.traderFilterForm).val();
                    var teamId = $("#ddlTeam", domElements.traderFilterForm).find(":selected").attr("team-id");
                    var gradeId = $("#ddlGrade", domElements.traderFilterForm).find(":selected").attr("grade-id");

                    traderManagement.getTraderByNameTeamGrade(traderName, teamId, gradeId);
                }

                setTimeout(function () {
                    validator.ClearErrors(domElements.traderFilterForm);
                }, 3000);
            }
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return traderManagement;
})(jQuery);