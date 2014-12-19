/* File Created: May 12, 2014 */
/* global Namespace, common, labels, hasEditRight, validator, messages */
'use strict';

$(document).ready(function () {
    var teamManagement = new Fanex.TGRS.TeamManagement();
    teamManagement.Initialize();
});

Namespace.Register("Fanex.TGRS.TeamManagement");
Fanex.TGRS.TeamManagement = function () {
    var $this = this;
    var timeout = null;
    var urls = {
        GetAllTeam: common.ResolveRootUrl('TeamManagement/GetAllTeam'),
        InsertTeam: common.ResolveRootUrl('TeamManagement/InsertTeam'),
        UpdateTeam: common.ResolveRootUrl('TeamManagement/UpdateTeam')
    };
    var domElements = {
        divTeamsGrid: null,
        lnkAddNewTeam: null,
        divInsertTeamForm: null,
        divUpdateTeamForm: null,
        divPopup: null
    };
    var popupElements = {
        divInsertTeamForm: null,
        divUpdateTeamForm: null,
        txtTeamName: null,
        txtTeamDes: null,
        txtTeamId: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTeamsGrid = $('#divTeamsGrid');
        domElements.lnkAddNewTeam = $('#lnkAddNewTeam');
        domElements.divInsertTeamForm = $('#divInsertTeamForm').clone();
        domElements.divUpdateTeamForm = $('#divUpdateTeamForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

    // Cache current active popup elements
    var cachePopupElements = function () {
        popupElements.divInsertTeamForm = $("#divInsertTeamForm", domElements.divPopup);
        popupElements.divUpdateTeamForm = $("#divUpdateTeamForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtTeamName = $('#txtTeamName', domElements.divPopup);
        popupElements.txtTeamDes = $('#txtTeamDes', domElements.divPopup);
        popupElements.txtTeamId = $('#txtTeamId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
    };

    // Bind event handlers to elements on the insert team popup.
    var bindNewTeamPopupEvent = function () {
        popupElements.txtTeamName.clearField(true).focus();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTeamForm, 'w')) {
                var teamName = $.trim(popupElements.txtTeamName.val());
                var teamDes = $.trim(popupElements.txtTeamDes.val());

                insertTeam(teamName, teamDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    var bindUpdateTeamPopupEvent = function () {
        popupElements.txtTeamName.clearField(true);

        // Waiting for clearField function completed.
        setTimeout(function () {
            popupElements.txtTeamName.focus();
        }, 10);

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateTeamForm, 'w')) {
                var txtTeamId = $.trim(popupElements.txtTeamId.val());
                var teamName = $.trim(popupElements.txtTeamName.val());
                var teamDes = $.trim(popupElements.txtTeamDes.val());

                updateTeam(txtTeamId, teamName, teamDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    //Get all teams
    var getAllTeams = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetAllTeam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                if (result) {
                    renderGrid(result.TeamInfoItems);
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

    //Insert new team
    var insertTeam = function (teamName, description) {
        var insertParameters = {
            TeamName: teamName,
            Description: description
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.InsertTeam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(insertParameters),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddTeamSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.TeamInfoItems);
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

    //Insert team
    var updateTeam = function (teamId, teamName, teamDes) {
        var updateParameters = {
            TeamId: teamId,
            TeamName: teamName,
            Description: teamDes
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateTeam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(updateParameters),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateTeamSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.TeamInfoItems);
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
        var nameColFormat = '<span class="edit-team-link link" data-team-id="{0}" data-team-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="teamDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.TeamName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 280, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 80, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.AvgGrade, Width: 120, Name: 'ColAvgGrade', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left'}],
            showNumberColumn: true,
            gridExpandHeight: 100
        };
        var editableTeamNameCol = "";
        var teamDescCol = "";
        var teamNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTeamNameCol = nameColFormat.format(item.TeamId, item.TeamName);
                teamNameCol = item.TeamName;
                teamDescCol = descColFormat.format(item.TeamId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableTeamNameCol : teamNameCol },
                              { Name: 'ColDes', Value: teamDescCol },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColAvgGrade', Value: item.AvgGrade },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTeamsGrid.fanexGrid(gridOptions);
    };

    var reloadPage = function (data) {
        renderGrid(data);
    };

    // Disable pop up form.
    var disablePopup = function () {
        popupElements.txtTeamName.prop('disabled', true);
        popupElements.txtTeamDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    // Handle page's events.
    var handlePageEvents = function () {
        //Title button
        //event: click on new team button.
        domElements.lnkAddNewTeam.on('click', function () {
            makeInsertTeamForm();
        });

        //Grid's event
        //event: click on team name
        domElements.divTeamsGrid.on('click','span.edit-team-link', function () {
            var $obj = $(this);
            var teamId = $obj.attr('data-team-id');
            var teamName = $obj.attr('data-team-name');
            var teamDes = $("#teamDesc_"+teamId).text();

            makeUpdateTeamForm(teamId, teamName, teamDes);
        });
    };

    // Display new team form.
    var makeInsertTeamForm = function () {
        var form = domElements.divInsertTeamForm.clone();

        refreshPopup();
        common.Modal(labels.NewTeam, form);

        //prepare event, data
        cachePopupElements();
        bindNewTeamPopupEvent();
    };

    // Display update team form.
    var makeUpdateTeamForm = function (teamId, teamName, teamDes) {
        var form = domElements.divUpdateTeamForm.clone();

        refreshPopup();
        common.Modal(labels.EditTeam, form);

        //prepare event, data
        cachePopupElements();
        bindUpdateTeamPopupEvent();
        popupElements.txtTeamName.val(teamName);
        popupElements.txtTeamDes.val(teamDes);
        popupElements.txtTeamId.val(teamId);
    };

    var refreshPopup = function() {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    $this.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        getAllTeams();
    };
};