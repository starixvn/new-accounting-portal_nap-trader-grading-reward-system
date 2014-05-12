/* File Created: May 12, 2014 */
/* global Namespace, common, labels, hasEditRight */
'use strict';

$(document).ready(function () {
    var teamManagement = new Fanex.TGRS.TeamManagement();
    teamManagement.Initialize();
});

Namespace.Register("Fanex.TGRS.TeamManagement");
Fanex.TGRS.TeamManagement = function () {
    var $this = this;
    var urls = {
        ViewAllTeam: common.ResolveRootUrl('TeamManagement/GetAllTeam')
    };
    var domElements = {
        divTeamsGrid: null,
        lnkAddNewTeam: null,
        divNewTeamForm: null
    };
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divTeamsGrid = domElements.divTeamsGrid || $('#divTeamsGrid');
        domElements.lnkAddNewTeam = domElements.lnkAddNewTeam || $('#lnkAddNewTeam');
        domElements.divNewTeamForm = domElements.divNewTeamForm || $('#divNewTeamForm');
    };

    //Get all team data
    var getAllTeamData = function () {
        $.ajax({
            type: 'POST',
            url: urls.ViewAllTeam,
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

    // Render grid.
    var renderGrid = function (data) {
        var editTeamFormat = '<span class="editTeam-link link" data-team-id="{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.TeamName, Width: 150, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 100, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left'}],
            showNumberColumn: true,
            gridExpandHeight: 200,
        };
        var editableTeamNameCol = "";
        var teamNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTeamNameCol = editTeamFormat.format(item.TeamId, item.TeamName);
                teamNameCol = item.TeamName;
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColName', Value: hasEditRight ? editableTeamNameCol : teamNameCol },
                              { Name: 'ColDes', Value: item.Description },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername}]
                };
                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divTeamsGrid.fanexGrid(gridOptions);
    };

    // Handle grid's events.
    var handleGridEvents = function () {
        domElements.lnkAddNewTeam.on('click', function () {
            displayAddNewForm();
        });
    };

    // Display request form.
    var displayAddNewForm = function () {
        var form = domElements.divNewTeamForm.clone();

        common.CloseMsgBox();
        common.Modal(labels.NewTeam, form);
        //cachePopupElements();
        //bindPopupEventhandlers();
    };
    $this.Initialize = function () {
        cacheDOMElements();
        getAllTeamData();
        handleGridEvents();
    };
};
