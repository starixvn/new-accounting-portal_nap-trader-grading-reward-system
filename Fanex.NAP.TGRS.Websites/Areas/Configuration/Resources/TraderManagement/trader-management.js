/* File Created: May 12, 2014 */
/* global Namespace, common, labels, hasEditRight, validator, messages */
'use strict';

$(document).ready(function () {
    var TraderManagement = new Fanex.TGRS.TraderManagement();
    TraderManagement.Initialize();
});

Namespace.Register("Fanex.TGRS.TraderManagement");
Fanex.TGRS.TraderManagement = function () {
    var $this = this;
    var timeout = null;
    var urls = {
        GetAllTrader: common.ResolveRootUrl('TraderManagement/GetAllTrader'),
        InsertTrader: common.ResolveRootUrl('TraderManagement/InsertTrader'),
        UpdateTrader: common.ResolveRootUrl('TraderManagement/UpdateTrader')
    };
    var domElements = {
        divTradersGrid: null,
        lnkAddNewTrader: null,
        divInsertTraderForm: null,
        divUpdateTraderForm: null,
        divPopup: null
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
        divErrorSuccessMsg: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divTradersGrid = $('#divTradersGrid');
        domElements.lnkAddNewTrader = $('#lnkAddNewTrader');
        domElements.divInsertTraderForm = $('#divInsertTraderForm').clone();
        domElements.divUpdateTraderForm = $('#divUpdateTraderForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

    // Cache current active popup elements
    var cachePopupElements = function () {
        popupElements.divInsertTraderForm = $("#divInsertTraderForm", domElements.divPopup);
        popupElements.divUpdateTraderForm = $("#divUpdateTraderForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtTraderName = $('#txtTraderName', domElements.divPopup);
        popupElements.txtTraderDes = $('#txtTraderDes', domElements.divPopup);
        popupElements.txtTraderId = $('#txtTraderId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
    };

    // Bind event handlers to elements on the insert Trader popup.
    var bindNewTraderPopupEvent = function () {
        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertTraderForm, 'w')) {
                var TraderName = $.trim(popupElements.txtTraderName.val());
                var TraderDes = $.trim(popupElements.txtTraderDes.val());

                insertTrader(TraderName, TraderDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };
    var bindUpdateTraderPopupEvent = function () {
        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateTraderForm, 'w')) {
                var txtTraderId = $.trim(popupElements.txtTraderId.val());
                var TraderName = $.trim(popupElements.txtTraderName.val());
                var TraderDes = $.trim(popupElements.txtTraderDes.val());

                updateTrader(txtTraderId, TraderName, TraderDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    //Get all Traders
    var getAllTraders = function () {
        $.ajax({
            type: 'POST',
            url: urls.GetAllTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
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
    var insertTrader = function (TraderName, description) {
        var isertingParameters = {
            TraderName: TraderName,
            Description: description
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.InsertTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(isertingParameters),
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
    var updateTrader = function (TraderId, TraderName, TraderDes) {
        var updateParameters = {
            TraderId: TraderId,
            TraderName: TraderName,
            Description: TraderDes
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateTrader,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(updateParameters),
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
        var nameColFormat = '<span class="edit-Trader-link link" data-Trader-id="{0}" data-Trader-name="{1}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.UserName, Width: 150, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.EmployeeId, Width: 150, Name: 'ColEmployee', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Team, Width: 150, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left'}],
            showNumberColumn: true,
            gridExpandHeight: 100,
        };
        var editableTraderNameCol = "";
        var TraderNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableTraderNameCol = nameColFormat.format(item.CustId, item.UserName);
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

    // Disable pop up form.
    var disablePopup = function () {
        popupElements.txtTraderName.prop('disabled', true);
        popupElements.txtTraderDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    // Handle page's events.
    var handlePageEvents = function () {
        //Title button
        //event: click on new Trader button.
        domElements.lnkAddNewTrader.on('click', function () {
            makeInsertTraderForm();
        });

        //Grid's event
        //event: click on Trader name
        domElements.divTradersGrid.on('click','span.edit-Trader-link', function () {
            var $obj = $(this);
            var TraderId = $obj.attr('data-Trader-id');
            var TraderName = $obj.attr('data-Trader-name');
            var TraderDes = $("#TraderDesc_"+TraderId).text();

            makeUpdateTraderForm(TraderId, TraderName, TraderDes);
        });
    };

    // Display new Trader form.
    var makeInsertTraderForm = function () {
        var form = domElements.divInsertTraderForm.clone();

        refreshPopup();
        common.Modal(labels.NewTrader, form);

        //prepare event, data
        cachePopupElements();
        bindNewTraderPopupEvent();
    };
    // Display update Trader form.
    var makeUpdateTraderForm = function (TraderId, TraderName, TraderDes) {
        var form = domElements.divUpdateTraderForm.clone();

        refreshPopup();
        common.Modal(labels.EditTrader, form);

        //prepare event, data
        cachePopupElements();
        bindUpdateTraderPopupEvent();
        popupElements.txtTraderName.val(TraderName);
        popupElements.txtTraderDes.val(TraderDes);
        popupElements.txtTraderId.val(TraderId);
    };

    var refreshPopup = function()
    {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    $this.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        getAllTraders();
    };
};
