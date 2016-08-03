/* File Created: Jul 29, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, teamManagementService */
////'use strict';

$(document).ready(function () {
    teamManagement.Initialize();
});

var teamManagement = (function ($) {
    var teamManagement = {};
    teamManagement.Teams = teamManagementService.Teams;
    teamManagement.Result = teamManagementService.Result;

    var timeout = null;
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

    teamManagement.GetAllTeam = function () {
        teamManagementService.GetAllTeam().then(function () {
            teamManagement.Teams = teamManagementService.Teams;

            renderGrid(teamManagement.Teams);
        });
    };

    teamManagement.OpenPopupAddNewTeam = function () {
        var form = domElements.divInsertTeamForm.clone();

        refreshPopup();
        common.Modal(labels.NewTeam, form);
        cachePopupElements();

        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTeamForm, 'w')) {
                var team = {
                    Description: $.trim(popupElements.txtTeamDes.val()),
                    TeamName: $.trim(popupElements.txtTeamName.val())
                };

                teamManagementService.InsertTeam(team).then(function () {
                    teamManagement.Result = teamManagementService.Result;

                    if (teamManagement.Result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddTeamSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        reloadPage();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, teamManagement.Result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    teamManagement.OpenPopupUpdateTeam = function (teamId, teamName, teamDes) {
        var form = domElements.divUpdateTeamForm.clone();

        refreshPopup();
        common.Modal(labels.EditTeam, form);
        cachePopupElements();

        popupElements.txtTeamName.val(teamName);
        popupElements.txtTeamDes.val(teamDes);
        popupElements.txtTeamId.val(teamId);

        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateTeamForm, 'w')) {
                var team = {
                    TeamId: $.trim(popupElements.txtTeamId.val()),
                    Description: $.trim(popupElements.txtTeamDes.val()),
                    TeamName: $.trim(popupElements.txtTeamName.val())
                };

                teamManagementService.UpdateTeam(team).then(function () {
                    teamManagement.Result = teamManagementService.Result;
                    if (teamManagement.Result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateTeamSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });
                        disablePopup();
                        reloadPage();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, teamManagement.Result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    teamManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        teamManagement.GetAllTeam();
    };

    var cacheDOMElements = function () {
        domElements.divTeamsGrid = $('#divTeamsGrid');
        domElements.lnkAddNewTeam = $('#lnkAddNewTeam');
        domElements.divInsertTeamForm = $('#divInsertTeamForm').clone();
        domElements.divUpdateTeamForm = $('#divUpdateTeamForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

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

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-team-link link" data-team-id="{0}" data-team-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="teamDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.TeamName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      //{ HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 80, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 100
        };
        var editableTeamNameCol = "";
        //var teamDescCol = "";
        var teamNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTeamNameCol = nameColFormat.format(item.TeamId, item.TeamName);
                teamNameCol = item.TeamName;
                //teamDescCol = descColFormat.format(item.TeamId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableTeamNameCol : teamNameCol },
                              //{ Name: 'ColDes', Value: teamDescCol },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDateFormatted },
                              { Name: 'ColCreatedBy', Value: item.CreatedBy }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTeamsGrid.fanexGrid(gridOptions);
    };

    var reloadPage = function () {
        teamManagement.GetAllTeam();
    };

    var disablePopup = function () {
        popupElements.txtTeamName.prop('disabled', true);
        popupElements.txtTeamDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    var handlePageEvents = function () {
        domElements.lnkAddNewTeam.off('click');
        domElements.lnkAddNewTeam.on('click', function () {
            teamManagement.OpenPopupAddNewTeam();
        });

        domElements.divTeamsGrid.off('click');
        domElements.divTeamsGrid.on('click', 'span.edit-team-link', function () {
            var $obj = $(this);
            var teamId = $obj.attr('data-team-id');
            var teamName = $obj.attr('data-team-name');
            var teamDes = $("#teamDesc_" + teamId).text();

            teamManagement.OpenPopupUpdateTeam(teamId, teamName, teamDes);
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return teamManagement;
})(jQuery);