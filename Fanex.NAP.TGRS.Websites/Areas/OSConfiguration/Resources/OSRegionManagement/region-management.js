/* File Created: Feb 15, 2017 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, regionManagementService */
////'use strict';

$(document).ready(function () {
    regionManagement.Initialize();
});

var regionManagement = (function ($) {
    var regionManagement = {};
    regionManagement.Regions = regionManagementService.Regions;
    regionManagement.Result = regionManagementService.Result;

    var timeout = null;
    var domElements = {
        divRegionsGrid: null,
        lnkAddNewRegion: null,
        divInsertRegionForm: null,
        divUpdateRegionForm: null,
        divPopup: null
    };

    var popupElements = {
        divInsertRegionForm: null,
        divUpdateRegionForm: null,
        txtRegionName: null,
        txtRegionDes: null,
        txtRegionId: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    regionManagement.GetAllRegion = function () {
        regionManagementService.GetAllRegion().then(function () {
            regionManagement.Regions = regionManagementService.Regions;

            renderGrid(regionManagement.Regions);
        });
    };

    regionManagement.OpenPopupAddNewRegion = function () {
        var form = domElements.divInsertRegionForm.clone();

        refreshPopup();
        common.Modal(labels.NewRegion, form);
        cachePopupElements();

        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertRegionForm, 'w')) {
                var region = {
                    Description: $.trim(popupElements.txtRegionDes.val()),
                    RegionName: $.trim(popupElements.txtRegionName.val())
                };

                regionManagementService.InsertRegion(region).then(function () {
                    regionManagement.Result = regionManagementService.Result;

                    if (regionManagement.Result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddRegionSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        reloadPage();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, regionManagement.Result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    regionManagement.OpenPopupUpdateRegion = function (regionId, regionName, regionDes) {
        var form = domElements.divUpdateRegionForm.clone();

        refreshPopup();
        common.Modal(labels.EditRegion, form);
        cachePopupElements();

        popupElements.txtRegionName.val(regionName);
        popupElements.txtRegionDes.val(regionDes);
        popupElements.txtRegionId.val(regionId);

        $('input[type=text]').off('keydown');
        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateRegionForm, 'w')) {
                var region = {
                    RegionId: $.trim(popupElements.txtRegionId.val()),
                    Description: $.trim(popupElements.txtRegionDes.val()),
                    RegionName: $.trim(popupElements.txtRegionName.val())
                };

                regionManagementService.UpdateRegion(region).then(function () {
                    regionManagement.Result = regionManagementService.Result;
                    if (regionManagement.Result.Code === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateRegionSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });
                        disablePopup();
                        reloadPage();
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, regionManagement.Result.Message);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    regionManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        regionManagement.GetAllRegion();
    };

    var cacheDOMElements = function () {
        domElements.divRegionsGrid = $('#divRegionsGrid');
        domElements.lnkAddNewRegion = $('#lnkAddNewRegion');
        domElements.divInsertRegionForm = $('#divInsertRegionForm').clone();
        domElements.divUpdateRegionForm = $('#divUpdateRegionForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

    var cachePopupElements = function () {
        popupElements.divInsertRegionForm = $("#divInsertRegionForm", domElements.divPopup);
        popupElements.divUpdateRegionForm = $("#divUpdateRegionForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtRegionName = $('#txtRegionName', domElements.divPopup);
        popupElements.txtRegionDes = $('#txtRegionDes', domElements.divPopup);
        popupElements.txtRegionId = $('#txtRegionId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
    };

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-region-link link" data-region-id="{0}" data-region-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="regionDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: 'Regions', Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.LeagueCount, Width: 80, Name: 'ColLeagueCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 100
        };
        var editableRegionNameCol = "";
        //var regionDescCol = "";
        var regionNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableRegionNameCol = nameColFormat.format(item.RegionId, item.RegionName);
                regionNameCol = item.RegionName;
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableRegionNameCol : regionNameCol },
                              { Name: 'ColLeagueCount', Value: item.LeagueCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDateFormatted },
                              { Name: 'ColCreatedBy', Value: item.CreatedBy }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divRegionsGrid.fanexGrid(gridOptions);
    };

    var reloadPage = function () {
        regionManagement.GetAllRegion();
    };

    var disablePopup = function () {
        popupElements.txtRegionName.prop('disabled', true);
        popupElements.txtRegionDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    var handlePageEvents = function () {
        domElements.lnkAddNewRegion.off('click');
        domElements.lnkAddNewRegion.on('click', function () {
            regionManagement.OpenPopupAddNewRegion();
        });

        domElements.divRegionsGrid.off('click');
        domElements.divRegionsGrid.on('click', 'span.edit-region-link', function () {
            var $obj = $(this);
            var regionId = $obj.attr('data-region-id');
            var regionName = $obj.attr('data-region-name');
            var regionDes = $("#regionDesc_" + regionId).text();

            regionManagement.OpenPopupUpdateRegion(regionId, regionName, regionDes);
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return regionManagement;
})(jQuery);