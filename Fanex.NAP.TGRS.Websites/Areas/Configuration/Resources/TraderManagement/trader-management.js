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
    };
    var popupType = {
        update: 1,
        insert: 2
    };
    var filterParameters = {
        teamId: null,
        gradeId: null,
        username: null,
        employeeId: null,
    };
    var domElements = {
        divTradersGrid: null,
        lnkAddNewTrader: null,
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
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
        dpkEffectiveDate: null,
        txtEffectiveDate: null
    };
    var cacheTeamData = null;
    var cacheGradeData = null;
    var cacheTeamDataId = {};
    var cacheGradeDataId = {};

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divTradersGrid = $('#divTradersGrid');
        domElements.lnkAddNewTrader = $('#lnkAddNewTrader');
        domElements.divInsertTraderForm = $('#divInsertTraderForm').clone();
        domElements.divUpdateTraderForm = $('#divUpdateTraderForm').clone();
        domElements.ddlGrade = $('#ddlGrade');
        domElements.ddlTeam = $('#ddlTeam');
        domElements.divPopup = $('#divPopup');
        domElements.btnSearch = $('#btnSearch');
        domElements.txtUserName = $('#txtUserName');
        domElements.txtEmployeeId = $('#txtEmployeeId');
        domElements.divTraderFilterForm= $('#divTraderFilterForm');
        $('#divHiddenForm').empty();
    };

    // Cache current active popup elements
    var cachePopupElements = function () {
        popupElements.divInsertTraderForm = $("#divInsertTraderForm", domElements.divPopup);
        popupElements.divUpdateTraderForm = $("#divUpdateTraderForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtUserName = $('#txtUserName', domElements.divPopup);
        popupElements.txtCustId = $('#txtCustId', domElements.divPopup);
        popupElements.txtEmployeeId = $('#txtEmployeeId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
        popupElements.ddlGrade = $('#ddlGrade', domElements.divPopup);
        popupElements.ddlTeam = $('#ddlTeam', domElements.divPopup);
        popupElements.dpkEffectiveDate = $('#dpkEffectiveDate', domElements.divPopup);
        popupElements.txtEffectiveDate = $('#txtEffectiveDate', domElements.divPopup);
    };

    // Bind event handlers to elements on the insert Trader popup.
    var bindNewTraderPopupEvent = function () {
        popupElements.btnSave.on('click', function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var parameters = {
                    Username:$.trim(popupElements.txtUserName.val()),
                    EmployeeId: $.trim(popupElements.txtEmployeeId.val()),
                    TeamId: popupElements.ddlTeam.val(),
                    GradeId: popupElements.ddlGrade.val()
                };

                insertTrader(parameters);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };
    var bindUpdateTraderPopupEvent = function (effectiveDate) {
        //Date picker
        var maxDate = new Date(datepickerSetting.Today);
        maxDate.setMonth(maxDate.getMonth() + 1);

        layout.CreateDatepicker(popupElements.dpkEffectiveDate, 'txtEffectiveDate',
            labels.EffectiveDate, 'width-80', effectiveDate, datepickerSetting.Today, maxDate, 'trader-width-200');

        popupElements.btnSave.on('click', function () {
            if (validator.ValidateForm(popupElements.divUpdateTraderForm, 'w')) {

                var parameters = {
                    CustId: popupElements.txtCustId.val(),
                    TeamId: popupElements.ddlTeam.val(),
                    GradeId: popupElements.ddlGrade.val(),
                    EffectiveDate: popupElements.dpkEffectiveDate.nexDatePicker('getSingleDate')
                };
                updateTrader(parameters);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    //Get all Traders
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

    //Insert new Trader
    var insertTrader = function (parameter) {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.InsertTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameter),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineInfoMsg(popupElements.divErrorSuccessMsg, messages.AddTraderSuccessfully, false, function () {
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
    //insert Trader
    var updateTrader = function (parameter) {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameter),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineInfoMsg(popupElements.divErrorSuccessMsg, messages.UpdateTraderSuccessfully, false, function () {
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
        nameColFormat += 'data-trader-employeeId="{4}" data-trader-effectiveDate="{5}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.UserName, Width: 150, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EmployeeId, Width: 100, Name: 'ColEmployee', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
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
        var editableTraderNameCol = "";
        var TraderNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTraderNameCol = nameColFormat.format(item.CustId, item.UserName, item.TeamName, item.GradeName, item.EmployeeId, item.EffectiveDate);
                TraderNameCol = item.TraderName;
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColName', Value: hasEditRight ? editableTraderNameCol : TraderNameCol },
                              { Name: 'ColEmployee', Value: item.EmployeeId },
                              { Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColGrade', Value: item.GradeName },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTradersGrid.fanexGrid(gridOptions);
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

                if (result.Grades.GradeInfoItems) {
                    cacheGradeData = result.Grades.GradeInfoItems;
                    updateGradeDropdown(cacheGradeData, domElements.ddlGrade, labels.AllGrades, defaultSelectVal);
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
    // Update Team drop-down list.
    var updateTeamDropdown = function (data, ddlDiv, defaultLabel, selectVal) {
        // Clear old values.
        ddlDiv.html('');

        //Default value
        if(defaultLabel != null)
        {
            ddlDiv.append($('<option></option>').attr('value', defaultSelectVal).text(defaultLabel));
        }

        // Add new values.
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                ddlDiv.append($('<option></option>').attr('value', item.TeamId).text(item.TeamName));
                cacheTeamDataId[item.TeamName]=item.TeamId;
            });
        }

        //auto select val
        ddlDiv.val(selectVal);
    };

    // Update Grade drop-down list.
    var updateGradeDropdown = function (data, ddlDiv, defaultLabel, selectVal) {
        // Clear old values.
        ddlDiv.html('');

        //Default value
        if(defaultLabel != null)
        {
            ddlDiv.append($('<option></option>').attr('value', defaultSelectVal).text(defaultLabel));
        }

        // Add new values.
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                ddlDiv.append($('<option></option>').attr('value', item.GradeId).text(item.GradeName));
                cacheGradeDataId[item.GradeName]=item.GradeId;
            });
        }

        //auto select val
        ddlDiv.val(selectVal);
    };

    // Update Popup drop-down list.
    var updatePopupDropdown = function (type, selectTeam, selectGrade) {
        if (type === popupType.update)
        {
            updateTeamDropdown(cacheTeamData, popupElements.ddlTeam, null, selectTeam);
            updateGradeDropdown(cacheGradeData, popupElements.ddlGrade, null, selectGrade);
        }
        else
        {
            updateTeamDropdown(cacheTeamData, popupElements.ddlTeam, labels.SelectATeam, selectTeam);
            updateGradeDropdown(cacheGradeData, popupElements.ddlGrade, labels.SelectAGrade, selectGrade);

            //edit to null val for validator to check data-val-required
            popupElements.ddlTeam.find(":selected").val('');
            popupElements.ddlGrade.find(":selected").val('');
        }
    };

    // Disable pop up form.
    var disablePopup = function () {
        popupElements.txtUserName.prop('disabled', true);
        popupElements.txtEmployeeId.prop('disabled', true);
        popupElements.ddlTeam.prop('disabled', true);
        popupElements.ddlGrade.prop('disabled', true);
        popupElements.dpkEffectiveDate.prop('disabled', true);
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
        domElements.txtUserName.off('keyup').on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });
        domElements.txtEmployeeId.off('keyup').on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });

        //btnSearch
        domElements.btnSearch.on('click', function () {
            // Delay 70ms for jQuery-UI combo-box to verify its state.
            setTimeout(function () {
                if (validator.CountErrors(domElements.divTraderFilterForm) === 0) {
                    filterParameters.teamId = domElements.ddlTeam.val();
                    filterParameters.gradeId = domElements.ddlGrade.val();
                    filterParameters.username = domElements.txtUserName.val();
                    filterParameters.employeeId = domElements.txtEmployeeId.val();

                    getAllTraders();
                }
            }, 70);
        });

        //Grid's event
        //event: click on Trader name
        domElements.divTradersGrid.on('click','span.edit-trader-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var username = $obj.attr('data-username');
            var employeeId = $obj.attr('data-trader-employeeId');
            var effectiveDate = $obj.attr('data-trader-effectiveDate');
            var teamName = $obj.attr('data-trader-team');
            var gradeName = $obj.attr('data-trader-grade');
            

            //get teamId and gradeId by name
            var teamId = cacheTeamDataId[teamName];
            var gradeId = cacheGradeDataId[gradeName];

            makeUpdateTraderForm(custId, username, employeeId, teamId, gradeId, effectiveDate);

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
    var makeUpdateTraderForm = function (custId, username, employeeId, teamId, gradeId, effectiveDate) {
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
        updatePopupDropdown(popupType.update, teamId, gradeId);

        bindUpdateTraderPopupEvent(effectiveDate);
    };

    var refreshPopup = function()
    {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
        intializeFilterData();
    };
};
