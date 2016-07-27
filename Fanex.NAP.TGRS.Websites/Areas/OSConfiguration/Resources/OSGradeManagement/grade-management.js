/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, gradeManagementService */
////'use strict';

$(document).ready(function () {
    gradeManagement.Initialize();
});

var gradeManagement = (function ($) {
    var gradeManagement = {};
    gradeManagement.Grades = gradeManagementService.Grades;
    gradeManagement.Result = gradeManagementService.Result;

    var timeout = null;
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

    gradeManagement.GetAllGrade = function () {
        gradeManagementService.GetAllGrade().then(function () {
            gradeManagement.Grades = gradeManagementService.Grades;

            renderGrid(gradeManagement.Grades.GradeInfoItems);
        });
    };

    gradeManagement.OpenPopupAddNewGrade = function () {
        var form = domElements.divInsertGradeForm.clone();

        refreshPopup();
        common.Modal(labels.NewGrade, form);
        cachePopupElements();

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertGradeForm, 'w')) {
                var grade = {
                    GradeName: $.trim(popupElements.txtGradeName.val()),
                    Description: $.trim(popupElements.txtGradeDes.val())
                };

                gradeManagementService.InsertGrade(grade).then(function () {
                    gradeManagement.Result = gradeManagementService.Result;

                    if (gradeManagement.Result.ErrorCode === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.AddGradeSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });

                        disablePopup();
                        reloadPage(gradeManagement.Result.UpdatedItems.GradeInfoItems);
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, gradeManagement.Result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    gradeManagement.OpenPopupUpdateGrade = function (gradeId, gradeName, gradeDes) {
        var form = domElements.divUpdateGradeForm.clone();

        refreshPopup();
        common.Modal(labels.EditGrade, form);
        cachePopupElements();

        popupElements.txtGradeName.val(gradeName);
        popupElements.txtGradeDes.val(gradeDes);
        popupElements.txtGradeId.val(gradeId);

        popupElements.btnSave.click(function () {
            if (validator.ValidateForm(popupElements.divInsertGradeForm, 'w')) {
                var grade = {
                    GradeId: $.trim(popupElements.txtGradeId.val()),
                    GradeName: $.trim(popupElements.txtGradeName.val()),
                    Description: $.trim(popupElements.txtGradeDes.val())
                };

                gradeManagementService.UpdateGrade(grade).then(function () {
                    gradeManagement.Result = gradeManagementService.Result;

                    if (gradeManagement.Result.ErrorCode === 0) {
                        common.ShowInlineSuccessMsg(popupElements.divErrorSuccessMsg, messages.UpdateGradeSuccessfully, false, function () {
                            timeout = setTimeout(common.ClosePopup, 3000);
                        });
                        disablePopup();
                        reloadPage(gradeManagement.Result.UpdatedItems.GradeInfoItems);
                    } else {
                        common.ShowInlineErrorMsg(popupElements.divErrorSuccessMsg, gradeManagement.Result.ErrorMessage);
                        return false;
                    }
                });
            }
        });

        popupElements.btnCancel.click(function () {
            common.ClosePopup();
        });
    };

    gradeManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        gradeManagement.GetAllGrade();
    };

    var cacheDOMElements = function () {
        domElements.divGradesGrid = $('#divGradesGrid');
        domElements.lnkAddNewGrade = $('#lnkAddNewGrade');
        domElements.divInsertGradeForm = $('#divInsertGradeForm').clone();
        domElements.divUpdateGradeForm = $('#divUpdateGradeForm').clone();
        domElements.divPopup = $('#divPopup');

        $('#divHiddenForm').empty();
    };

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

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-grade-link link" data-grade-id="{0}" data-grade-name="{1}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="gradeDesc_{0}">{1}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.GradeName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.TraderCount, Width: 80, Name: 'ColTraderCount', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 100
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
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableGradeNameCol : gradeNameCol },
                              { Name: 'ColDes', Value: gradeDescCol },
                              { Name: 'ColTraderCount', Value: item.TraderCount },
                              { Name: 'ColCreatedDate', Value: item.CreatedDate },
                              { Name: 'ColCreatedBy', Value: item.CreatedUsername }]
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

    var disablePopup = function () {
        popupElements.txtGradeName.prop('disabled', true);
        popupElements.txtGradeDes.prop('disabled', true);
        popupElements.btnSave.prop('disabled', true);
        popupElements.btnCancel.prop('disabled', true);
    };

    var handlePageEvents = function () {
        domElements.lnkAddNewGrade.off('click');
        domElements.lnkAddNewGrade.on('click', function () {
            gradeManagement.OpenPopupAddNewGrade();
        });

        domElements.divGradesGrid.off('click');
        domElements.divGradesGrid.on('click', 'span.edit-grade-link', function () {
            var $obj = $(this);
            var gradeId = $obj.attr('data-grade-id');
            var gradeName = $obj.attr('data-grade-name');
            var gradeDes = $("#gradeDesc_" + gradeId).text();

            gradeManagement.OpenPopupUpdateGrade(gradeId, gradeName, gradeDes);
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return gradeManagement;
})(jQuery);