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

    traderManagement.OpenPopupUpdateTrader = function (traderId, traderName, traderDes) {
        var form = domElements.divUpdateTraderForm.clone();

        refreshPopup();
        common.Modal(labels.EditTrader, form);
        cachePopupElements();

        popupElements.txtTraderName.val(traderName);
        popupElements.txtTraderDes.val(traderDes);
        popupElements.txtTraderId.val(traderId);

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

    traderManagement.OpenPopupTraderTeamHistory = function () {

    };

    traderManagement.OpenPopupTraderGradeHistory = function () {

    };

    traderManagement.OpenPopupTraderEPADeduction = function () {

    };

    traderManagement.OpenPopupTraderError = function () {

    };

    traderManagement.OpenPopupAddNewTraderError = function () {

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
    };

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-trader-link link" data-trader-id="{0}" data-trader-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="traderDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.TraderName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 80, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' }],
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
                editableTraderNameCol = nameColFormat.format(item.TraderId, item.TraderName);
                traderNameCol = item.TraderName;
                traderDescCol = descColFormat.format(item.TraderId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableTraderNameCol : traderNameCol },
                              { Name: 'ColDes', Value: traderDescCol },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername }]
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
            var traderDes = $("#traderDesc_" + traderId).text();

            traderManagement.OpenPopupUpdateTrader(traderId, traderName, traderDes);
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return traderManagement;
})(jQuery);