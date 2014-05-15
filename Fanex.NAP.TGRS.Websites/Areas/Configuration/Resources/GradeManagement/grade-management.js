/* File Created: May 12, 2014 */
/* global Namespace, common, labels, hasEditRight, validator, messages */
'use strict';

$(document).ready(function () {
    var gradeManagement = new Fanex.TGRS.GradeManagement();
    gradeManagement.Initialize();
});

Namespace.Register("Fanex.TGRS.GradeManagement");
Fanex.TGRS.GradeManagement = function () {
    var $this = this;
    var timeout = null;
    var urls = {
        GetAllGrade: common.ResolveRootUrl('GradeManagement/GetAllGrade'),
        InsertGrade: common.ResolveRootUrl('GradeManagement/InsertGrade'),
        UpdateGrade: common.ResolveRootUrl('GradeManagement/UpdateGrade')
    };
    var domElements = {
        divGradesGrid: null,
        lnkAddNewGrade: null,
        divInsertGradeForm: null,
        divUpdateGradeForm: null,
        divPopup: null
    };
    var popupElements = {
        divInsertGradeForm: null,
        divUpdateGradeForm: null,
        txtGradeName: null,
        txtGradeDes: null,
        txtGradeId: null,
        btnSave: null,
        btnCancel: null,
        popupType: 0,
        divErrorSuccessMsg: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divGradesGrid = $('#divGradesGrid');
        domElements.lnkAddNewGrade = $('#lnkAddNewGrade');
        domElements.divInsertGradeForm = $('#divInsertGradeForm').clone();
        domElements.divUpdateGradeForm = $('#divUpdateGradeForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

    // Cache current active popup elements
    var cachePopupElements = function () {
        popupElements.divInsertGradeForm = $("#divInsertGradeForm", domElements.divPopup);
        popupElements.divUpdateGradeForm = $("#divUpdateGradeForm", domElements.divPopup);
        popupElements.divErrorSuccessMsg = $('#divErrorSuccessMsg', domElements.divPopup);
        popupElements.txtGradeName = $('#txtGradeName', domElements.divPopup);
        popupElements.txtGradeDes = $('#txtGradeDes', domElements.divPopup);
        popupElements.txtGradeId = $('#txtGradeId', domElements.divPopup);
        popupElements.btnSave = $('#btnSave', domElements.divPopup);
        popupElements.btnCancel = $('#btnCancel', domElements.divPopup);
    };

    // Bind event handlers to elements on the insert grade popup.
    var bindNewGradePopupEvent = function () {
        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertGradeForm, 'w')) {
                var gradeName = $.trim(popupElements.txtGradeName.val());
                var gradeDes = $.trim(popupElements.txtGradeDes.val());

                insertGrade(gradeName, gradeDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };
    var bindUpdateGradePopupEvent = function () {
        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divUpdateGradeForm, 'w')) {
                var txtGradeId = $.trim(popupElements.txtGradeId.val());
                var gradeName = $.trim(popupElements.txtGradeName.val());
                var gradeDes = $.trim(popupElements.txtGradeDes.val());

                updateGrade(txtGradeId, gradeName, gradeDes);
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    //Get all grades
    var getAllGrades = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetAllGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                if (result) {
                    renderGrid(result.GradeInfoItems);
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

    //Insert new grade
    var insertGrade = function (gradeName, description) {
        var isertingParameters = {
            GradeName: gradeName,
            Description: description
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.InsertGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(isertingParameters),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineInfoMsg(popupElements.divErrorSuccessMsg, messages.AddGradeSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.GradeInfoItems);
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
    //insert grade
    var updateGrade = function (gradeId, gradeName, gradeDes) {
        var updateParameters = {
            GradeId: gradeId,
            GradeName: gradeName,
            Description: gradeDes
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateGrade,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(updateParameters),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInlineInfoMsg(popupElements.divErrorSuccessMsg, messages.UpdateGradeSuccessfully, false, function () {
                        timeout = setTimeout(common.ClosePopup, 3000);
                    });
                    disablePopup();
                    reloadPage(result.UpdatedItems.GradeInfoItems);
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
        var nameColFormat = '<span class="edit-grade-link link" data-grade-id="{0}" data-grade-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="gradeDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.GradeName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 80, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left'}],
            showNumberColumn: true,
            gridExpandHeight: 100,
        };
        var editableGradeNameCol = "";
        var gradeDescCol = "";
        var gradeNameCol = "";
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                editableGradeNameCol = nameColFormat.format(item.GradeId, item.GradeName);
                gradeNameCol = item.GradeName;
                gradeDescCol = descColFormat.format(item.GradeId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColName', Value: hasEditRight ? editableGradeNameCol : gradeNameCol },
                              { Name: 'ColDes', Value: gradeDescCol },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divGradesGrid.fanexGrid(gridOptions);
    };
    var reloadPage = function (data) {
        renderGrid(data);
    };

    // Disable pop up form.
    var disablePopup = function () {
        popupElements.txtGradeName.prop('disabled', true);
        popupElements.txtGradeDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    // Handle page's events.
    var handlePageEvents = function () {
        //Title button
        //event: click on new grade button.
        domElements.lnkAddNewGrade.on('click', function () {
            makeInsertGradeForm();
        });

        //Grid's event
        //event: click on grade name
        domElements.divGradesGrid.on('click','span.edit-grade-link', function () {
            var $obj = $(this);
            var gradeId = $obj.attr('data-grade-id');
            var gradeName = $obj.attr('data-grade-name');
            var gradeDes = $("#gradeDesc_"+gradeId).text();

            makeUpdateGradeForm(gradeId, gradeName, gradeDes);
        });
    };

    // Display new grade form.
    var makeInsertGradeForm = function () {
        var form = domElements.divInsertGradeForm.clone();

        refreshPopup();
        common.Modal(labels.NewGrade, form);

        //prepare event, data
        cachePopupElements();
        bindNewGradePopupEvent();
    };
    // Display update grade form.
    var makeUpdateGradeForm = function (gradeId, gradeName, gradeDes) {
        var form = domElements.divUpdateGradeForm.clone();

        refreshPopup();
        common.Modal(labels.EditGrade, form);

        //prepare event, data
        cachePopupElements();
        bindUpdateGradePopupEvent();
        popupElements.txtGradeName.val(gradeName);
        popupElements.txtGradeDes.val(gradeDes);
        popupElements.txtGradeId.val(gradeId);
    };

    var refreshPopup = function()
    {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    $this.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        getAllGrades();
    };
};
