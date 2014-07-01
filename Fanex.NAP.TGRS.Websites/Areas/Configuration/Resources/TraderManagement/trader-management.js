/* File Created: May 12, 2014 */
/* global Namespace, common, labels, hasEditRight, validator, messages, datepickerSetting, layout */
'use strict';

$(document).ready(function () {
    var TraderManagement = new Fanex.TGRS.TraderManagement();
    TraderManagement.Initialize();
});

Namespace.Register("Fanex.TGRS.TraderManagement");
Fanex.TGRS.TraderManagement = function () {
    var $this = this;
    var timeout = null;
    var defaultSelectVal = 0;
    var urls = {
        GetAllTrader: common.ResolveRootUrl('TraderManagement/GetAllTrader'),
        InsertTrader: common.ResolveRootUrl('TraderManagement/InsertTrader'),
        UpdateTrader: common.ResolveRootUrl('TraderManagement/UpdateTrader'),
        GetInitializedData: common.ResolveRootUrl('TraderManagement/GetInitializedData'),
        GetGradeHistory: common.ResolveRootUrl('TraderManagement/GetGradeHistory'),
        GetTeamHistory: common.ResolveRootUrl('TraderManagement/GetTeamHistory')
    };
    var popupType = {
        update: 1,
        insert: 2
    };
    var filterParameters = {
        teamId: null,
        grade: null,
        username: null,
        employeeId: null
    };
    var currentFilterVal = {
        teamId: null,
        grade: null,
        gradeEffectiveDate: null,
        teamEffectiveDate: null
    };
    var domElements = {
        divTradersGrid: null,
        lnkAddNewTrader: null,
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
        divTeamHistoryForm: null,
        divGradeHistoryForm: null,
        ddlGrade: null,
        ddlTeam: null,
        divPopup: null,
        btnSearch: null,
        txtUserName: null,
        txtEmployeeId: null,
        divTraderFilterForm: null
    };
    var popupElements = {
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
        txtUserName: null,
        txtCustId: null,
        txtEmployeeId: null,
        btnSave: null,
        btnCancel: null,
        divErrorSuccessMsg: null,
        ddlGrade: null,
        ddlTeam: null,
        dpkTeamEffectiveDate: null,
        dpkGradeEffectiveDate: null,
        divTeamHistoryForm: null,
        divGradeHistoryForm: null,
        divTeamHistoryGrid: null,
        divGradeHistoryGrid: null
    };
    var cacheTeamData = null;
    var cacheTeamDataId = {};

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divTradersGrid = $('#divTradersGrid');
        domElements.lnkAddNewTrader = $('#lnkAddNewTrader');
        domElements.divInsertTraderForm = $('#divInsertTraderForm').clone();
        domElements.divUpdateTraderForm = $('#divUpdateTraderForm').clone();
        domElements.divTeamHistoryForm = $('#divTeamHistoryForm').clone();
        domElements.divGradeHistoryForm = $('#divGradeHistoryForm').clone();
        domElements.ddlGrade = $('#ddlGrade');
        domElements.ddlTeam = $('#ddlTeam');
        domElements.divPopup = $('#divPopup');
        domElements.btnSearch = $('#btnSearch');
        domElements.txtUserName = $('#txtUserName');
        domElements.txtEmployeeId = $('#txtEmployeeId');
        domElements.divTraderFilterForm = $('#divTraderFilterForm');

        $('#divHiddenForm').empty();
    };

    // Cache current active popup elements
    var cachePopupElements = function () {
        popupElements.divInsertTraderForm = $("#divInsertTraderForm", domElements.divPopup);
        popupElements.divUpdateTraderForm = $("#divUpdateTraderForm", domElements.divPopup);
        popupElements.divTeamHistoryForm = $("#divTeamHistoryForm", domElements.divPopup);
        popupElements.divGradeHistoryForm = $("#divGradeHistoryForm", domElements.divPopup);

        popupElements.divTeamHistoryGrid = $('#divTeamHistoryGrid', domElements.divPopup);
        popupElements.divGradeHistoryGrid = $('#divGradeHistoryGrid', domElements.divPopup);

        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtUserName = $('#txtUserName', domElements.divPopup);
        popupElements.txtCustId = $('#txtCustId', domElements.divPopup);
        popupElements.txtEmployeeId = $('#txtEmployeeId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
        popupElements.ddlGrade = $('#ddlGradePopup', domElements.divPopup);
        popupElements.ddlTeam = $('#ddlTeamPopup', domElements.divPopup);
        popupElements.dpkTeamEffectiveDate = $('#dpkTeamEffectiveDate', domElements.divPopup);
        popupElements.dpkGradeEffectiveDate = $('#dpkGradeEffectiveDate', domElements.divPopup);
    };

    // Bind event handlers to elements on the insert Trader popup.
    var bindNewTraderPopupEvent = function () {
        popupElements.txtUserName.focus();

        popupElements.btnSave.on('click', function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var parameters = {
                    Username: $.trim(popupElements.txtUserName.val()),
                    EmployeeId: $.trim(popupElements.txtEmployeeId.val()),
                    TeamId: popupElements.ddlTeam.val(),
                    grade: popupElements.ddlGrade.val()
                };
                insertTrader(parameters);
            }
            else {
                if (!popupElements.ddlTeam.val()) {
                    validator.ShowError(popupElements.ddlTeam.multiselect('getButton'), messages.RequiredFieldError, 'w');
                }
                if (!popupElements.ddlGrade.val()) {
                    validator.ShowError(popupElements.ddlGrade.multiselect('getButton'), messages.RequiredFieldError, 'w');
                }
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    var bindUpdateTraderPopupEvent = function (teamEffectiveDate, gradeEffectiveDate) {
        //Date picker
        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setMonth(maxDate.getMonth() + 1);

        //datepickerSetting.Today
        layout.CreateDatepicker(popupElements.dpkTeamEffectiveDate, 'txtTeamEffectiveDate',
            labels.TeamEffectiveDate, 'width-120', teamEffectiveDate, datepickerSetting.Today, maxDate, 'trader-width-200');
        layout.CreateDatepicker(popupElements.dpkGradeEffectiveDate, 'txtGradeEffectiveDate',
            labels.GradeEffectiveDate, 'width-120', gradeEffectiveDate, datepickerSetting.Today, maxDate, 'trader-width-200');

        $('#txtTeamEffectiveDate', domElements.divPopup).val(teamEffectiveDate);
        $('#txtGradeEffectiveDate', domElements.divPopup).val(gradeEffectiveDate);

        popupElements.ddlTeam.on('change', function () {
            $('#txtTeamEffectiveDate', domElements.divPopup).val(datepickerSetting.Today);
        });
        popupElements.ddlGrade.on('change', function () {
            $('#txtGradeEffectiveDate', domElements.divPopup).val(datepickerSetting.Today);
        });

        popupElements.btnSave.on('click', function () {
            if (validator.ValidateForm(popupElements.divUpdateTraderForm, 'w')) {
                var parameters = {
                    CustId: popupElements.txtCustId.val(),
                    NewTeamId: popupElements.ddlTeam.val(),
                    NewGrade: popupElements.ddlGrade.val(),
                    NewTeamEffectiveDate: popupElements.dpkTeamEffectiveDate.nexDatePicker('getSingleDate'),
                    NewGradeEffectiveDate: popupElements.dpkGradeEffectiveDate.nexDatePicker('getSingleDate')
                };

                var countNeedUpdate = 2;
                if (parameters.NewGrade === currentFilterVal.grade && parameters.NewGradeEffectiveDate === currentFilterVal.gradeEffectiveDate) {
                    parameters.NewGrade = null;
                    parameters.NewGradeEffectiveDate = null;
                    countNeedUpdate--;
                }
                if (parameters.NewTeamId === currentFilterVal.teamId && parameters.NewTeamEffectiveDate === currentFilterVal.teamEffectiveDate) {
                    parameters.NewTeamId = null;
                    parameters.NewTeamEffectiveDate = null;
                    countNeedUpdate--;
                }
                if (countNeedUpdate > 0) {
                    updateTrader(parameters);
                }
                else {
                    common.ShowInlineInfoMsg(popupElements.divErrorSuccessMsg, messages.UpdateNoChange, false);
                }
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    // Get all Traders
    var getAllTraders = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetAllTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderGrid(result.TraderInfoItems);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Insert new Trader
    var insertTrader = function (parameter) {
        common.DisableInput();
        var combineParameter = {
            insertCriteria: parameter,
            getCriteria: filterParameters
        };
        $.ajax({
            type: 'POST',
            url: urls.InsertTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(combineParameter),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddTraderSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.TraderInfoItems);
                } else {
                    common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.ErrorMessage);
                    return false;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Insert Trader
    var updateTrader = function (parameter) {
        common.DisableInput();
        var combineParameter = {
            updateCriteria: parameter,
            getCriteria: filterParameters
        };
        $.ajax({
            type: 'POST',
            url: urls.UpdateTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(combineParameter),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateTraderSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.TraderInfoItems);
                } else {
                    common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, result.ErrorMessage);
                    return false;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render grid.
    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-trader-link link" data-cust-id="{0}"';
        nameColFormat += 'data-username="{1}" data-trader-team="{2}" data-trader-grade="{3}"';
        nameColFormat += 'data-trader-employeeId="{4}" data-trader-teamEffectiveDate="{5}" data-trader-gradeEffectiveDate="{6}">{1}</span>';
        var teamDateColFormat = '<span class="view-teamHistory-link link" data-cust-id="{0}" data-username="{1}">{2}</span>';
        var gradeDateColFormat = '<span class="view-gradeHistory-link link" data-cust-id="{0}" data-username="{1}">{2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.UserName, Width: 130, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EmployeeId, Width: 100, Name: 'ColEmployee', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TeamEffectiveDate, Width: 120, Name: 'ColTeamEffectiveDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Grade, Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.GradeEffectiveDate, Width: 120, Name: 'ColGradeEffectiveDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left'}],
            showNumberColumn: true,
            gridExpandHeight: 150,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };
        var TraderNameCol = "";
        var TeamDateCol = "";
        var GradeDateCol = "";
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                TraderNameCol = hasEditRight ?
                                nameColFormat.format(item.CustId, item.UserName, item.TeamName, item.Grade, item.EmployeeId, item.TeamEffectiveDate,
                                item.GradeEffectiveDate)
                                : item.UserName;
                TeamDateCol = teamDateColFormat.format(item.CustId, item.UserName, item.TeamEffectiveDate);
                GradeDateCol = gradeDateColFormat.format(item.CustId, item.UserName, item.GradeEffectiveDate);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColName', Value: TraderNameCol },
                              { Name: 'ColEmployee', Value: item.EmployeeId },
                              { Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColTeamEffectiveDate', Value: TeamDateCol },
                              { Name: 'ColGrade', Value: item.Grade },
                              { Name: 'ColGradeEffectiveDate', Value: GradeDateCol },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTradersGrid.fanexGrid(gridOptions);
    };

    var renderTeamHistoryGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.Team, Width: 130, Name: 'ColTeamName', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: labels.EffectiveDate, Width: 100, Name: 'ColEffectiveDate', HeaderAlign: 'center', CellAlign: 'center'}],
            showNumberColumn: true,
            gridExpandHeight: 150
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColTeamName', Value: item.TeamName },
                                { Name: 'ColEffectiveDate', Value: item.EffectiveDate}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divTeamHistoryGrid.fanexGrid(gridOptions);
    };

    var makeMultiFilterDropdown = function () {
        domElements.ddlTeam.multiselect({
            selectedList: 1,
            minWidth: 150,
            height: 200,
            multiple: false
        }).multiselectfilter({ width: 85 });
        domElements.ddlGrade.multiselect({
            selectedList: 1,
            minWidth: 120,
            height: 200,
            header: false,
            multiple: false
        });
    };

    var makeMultiPopupDropdown = function () {
        popupElements.ddlGrade.multiselect({
            selectedList: 1,
            minWidth: 200,
            height: 200,
            noneSelectedText: labels.SelectAGrade,
            header: false,
            multiple: false
        });
        popupElements.ddlTeam.multiselect({
            selectedList: 1,
            minWidth: 200,
            height: 200,
            noneSelectedText: labels.SelectATeam,
            multiple: false
        }).multiselectfilter({ width: 135 });
    };

    var renderGradeHistoryGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.Grade, Width: 130, Name: 'ColGradeName', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.EffectiveDate, Width: 100, Name: 'ColEffectiveDate', HeaderAlign: 'center', CellAlign: 'center'}],
            showNumberColumn: true,
            gridExpandHeight: 150
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColGradeName', Value: item.Grade },
                                { Name: 'ColEffectiveDate', Value: item.EffectiveDate}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divGradeHistoryGrid.fanexGrid(gridOptions);
    };

    var reloadPage = function (data) {
        renderGrid(data);
    };

    // Initialize filter form data.
    var intializeFilterData = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetInitializedData,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                if (result.Teams.TeamInfoItems) {
                    cacheTeamData = result.Teams.TeamInfoItems;
                    updateTeamDropdown(cacheTeamData, domElements.ddlTeam, labels.AllTeams, defaultSelectVal);
                }
                updateGradeDropdown(domElements.ddlGrade, labels.AllGrades, defaultSelectVal);
                makeMultiFilterDropdown();
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Update Team drop-down list.
    var updateTeamDropdown = function (data, ddlDiv, defaultLabel, selectVal) {
        // Clear old values.
        ddlDiv.html('');
        var isAutoSelect = false;

        //Default value
        if (defaultLabel != null) {
            ddlDiv.append($('<option></option>').attr('value', defaultSelectVal).text(defaultLabel));
            isAutoSelect = true;
        }

        // Add new values.
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                ddlDiv.append($('<option></option>').attr('value', item.TeamId).text(item.TeamName));
                cacheTeamDataId[item.TeamName] = item.TeamId;
            });
        }

        //auto select val
        if (isAutoSelect || selectVal !== defaultSelectVal) {
            ddlDiv.val(selectVal);
        }
        else {
            ddlDiv.val('');
        }
    };

    // Update Grade drop-down list.
    var updateGradeDropdown = function (ddlDiv, defaultLabel, selectVal) {
        // Clear old values.
        ddlDiv.html('');
        var isAutoSelect = false;

        //Default value
        if (defaultLabel != null) {
            ddlDiv.append($('<option></option>').attr('value', defaultSelectVal).text(defaultLabel));
            isAutoSelect = true;
        }

        // Add new values.
        for (var i = 1; i <= 10; i++) {
            ddlDiv.append($('<option></option>').attr('value', i).text(i));
        }

        //auto select val
        if (isAutoSelect || selectVal !== defaultSelectVal) {
            ddlDiv.val(selectVal);
        }
        else {
            ddlDiv.val('');
        }
    };

    // Update Popup drop-down list.
    var updatePopupDropdown = function (type, selectTeam, selectGrade) {
        if (type === popupType.update) {
            updateTeamDropdown(cacheTeamData, popupElements.ddlTeam, null, selectTeam);
            updateGradeDropdown(popupElements.ddlGrade, null, selectGrade);
        }
        else {
            updateTeamDropdown(cacheTeamData, popupElements.ddlTeam, null, selectTeam);
            updateGradeDropdown(popupElements.ddlGrade, null, selectGrade);

            //edit to null val for validator to check data-val-required
            popupElements.ddlTeam.find(":selected").val('');
            popupElements.ddlGrade.find(":selected").val('');
        }

        //init multi select
        makeMultiPopupDropdown();
    };

    // Disable pop up form.
    var disablePopup = function () {
        popupElements.txtUserName.prop('disabled', true);
        popupElements.txtEmployeeId.prop('disabled', true);
        popupElements.ddlTeam.prop('disabled', true);
        popupElements.ddlGrade.prop('disabled', true);
        popupElements.dpkTeamEffectiveDate.prop('disabled', true);
        popupElements.dpkGradeEffectiveDate.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    // Init page fields and events
    var initPageFields = function () {
        //Title button
        //event: click on new Trader button.
        domElements.lnkAddNewTrader.on('click', function () {
            makeInsertTraderForm();
        });

        //Enter on fields
        domElements.txtUserName.on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });
        domElements.txtEmployeeId.on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });

        //btnSearch
        domElements.btnSearch.on('click', function () {
            filterParameters.teamId = domElements.ddlTeam.val();
            filterParameters.grade = domElements.ddlGrade.val();
            filterParameters.username = domElements.txtUserName.val();
            filterParameters.employeeId = domElements.txtEmployeeId.val();

            getAllTraders();
        });

        //Grid's event
        //event: click on Trader name
        domElements.divTradersGrid.on('click', 'span.edit-trader-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var username = $obj.attr('data-username');
            var employeeId = $obj.attr('data-trader-employeeId');
            var teamEffectiveDate = $obj.attr('data-trader-teamEffectiveDate');
            var gradeEffectiveDate = $obj.attr('data-trader-gradeEffectiveDate');
            var teamName = $obj.attr('data-trader-team');
            var grade = $obj.attr('data-trader-grade');

            //get teamId and grade by name
            var teamId = cacheTeamDataId[teamName];
            makeUpdateTraderForm(custId, username, employeeId, teamId, grade, teamEffectiveDate, gradeEffectiveDate);
        });

        //event: click on team name
        domElements.divTradersGrid.on('click', 'span.view-teamHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            makeTeamHistoryForm(custId, userName);
        });

        //event: click on grade
        domElements.divTradersGrid.on('click', 'span.view-gradeHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            makeGradeHistoryForm(custId, userName);
        });
    };

    // Display new Trader form.
    var makeTeamHistoryForm = function (custId, userName) {
        var form = domElements.divTeamHistoryForm.clone();

        refreshPopup();

        common.DisableInput();
        var param = {
            custId: custId
        };
        $.ajax({
            type: 'POST',
            url: urls.GetTeamHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function (result) {
                if (result) {
                    common.Popup(labels.TeamHistory + " - " + userName, form);
                    cachePopupElements();
                    renderTeamHistoryGrid(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Display new Trader form.
    var makeGradeHistoryForm = function (custId, userName) {
        var form = domElements.divGradeHistoryForm.clone();

        refreshPopup();

        //prepare data
        //cachePopupElements();
        common.DisableInput();
        var param = {
            custId: custId
        };
        $.ajax({
            type: 'POST',
            url: urls.GetGradeHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function (result) {
                if (result) {
                    common.Popup(labels.GradeHistory + " - " + userName, form);
                    cachePopupElements();
                    renderGradeHistoryGrid(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Display new Trader form.
    var makeInsertTraderForm = function () {
        var form = domElements.divInsertTraderForm.clone();

        refreshPopup();
        common.Modal(labels.NewTrader, form);

        //prepare event, data
        cachePopupElements();
        updatePopupDropdown(popupType.insert, defaultSelectVal, defaultSelectVal);
        bindNewTraderPopupEvent();
    };

    // Display update Trader form.
    var makeUpdateTraderForm = function (custId, username, employeeId, teamId, grade, teamEffectiveDate, gradeEffectiveDate) {
        var form = domElements.divUpdateTraderForm.clone();

        refreshPopup();
        common.Modal(labels.EditTrader, form);

        //prepare event, data
        cachePopupElements();

        //Prepare data for update form ;
        popupElements.txtUserName.val(username);
        popupElements.txtCustId.val(custId);
        popupElements.txtEmployeeId.val(employeeId);
        popupElements.txtUserName.prop('disabled', true);
        popupElements.txtEmployeeId.prop('disabled', true);
        updatePopupDropdown(popupType.update, teamId, grade);

        currentFilterVal.teamId = teamId.toString();
        currentFilterVal.teamEffectiveDate = teamEffectiveDate;
        currentFilterVal.grade = grade;
        currentFilterVal.gradeEffectiveDate = gradeEffectiveDate;

        bindUpdateTraderPopupEvent(teamEffectiveDate, gradeEffectiveDate);
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
        intializeFilterData();
    };
};