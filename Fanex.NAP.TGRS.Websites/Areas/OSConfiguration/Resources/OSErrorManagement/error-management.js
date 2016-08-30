/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, errorManagementService */
////'use strict';

$(document).ready(function () {
    errorManagement.Initialize();
});

var errorManagement = (function ($) {
    var errorManagement = {};
    errorManagement.Errors = errorManagementService.Errors;
    errorManagement.Result = errorManagementService.Result;

    var timeout = null;
    var domElements = {
        ErrorGrid: null,
        lnkAddNewError: null,
        divInsertErrorForm: null,
        divUpdateErrorForm: null,
        divPopup: null
    };

    function normalizeString(str) {
        return str == null || str.length == 0 ? "-" : str;
    }

    errorManagement.GetAllErrors = function () {
        errorManagementService.GetAllErrors().then(function () {
            errorManagement.Errors = errorManagementService.Errors;

            renderGrid(errorManagement.Errors);
        });
    };

    errorManagement.OpenPopupAddNewError = function () {
        var form = $("#insertErrForm").clone();

        refreshPopup();
        common.Modal(labels.NewError, form);

        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                popupElements.btnSave.trigger('click');
            }
        });

        $("#btnSave", form).click(function () {
            if (validator.ValidateForm(form, 'w')) {
                var error = {
                    ErrorName: $("#errorName", form).val().trim(),
                    ErrorDesc: $("#errorDes", form).val().trim(),
                    Value: $("#errorVal", form).val().trim(),
                    Disabled: !$("#isEnabled", form).is(":checked")
                };

                if (parseInt(error.Value) == error.Value && error.Value > 0 && error.Value < 100) {
                    errorManagementService.InsertError(error).then(function () {
                        errorManagement.Result = errorManagementService.Result;

                        if (errorManagement.Result.Code === 0) {
                            common.ShowInlineSuccessMsg($("#divErrorSuccessMsg", form), messages.AddErrorSuccessfully, false, function () {
                                timeout = setTimeout(common.ClosePopup, 3000);
                            });

                            reloadPage();
                        } else {
                            common.ShowInlineErrorMsg($("#divErrorSuccessMsg", form), errorManagement.Result.Message);
                            return false;
                        }
                    });
                } else {
                    common.ShowInlineErrorMsg($("#divErrorSuccessMsg", form), messages.InvalidValueError);
                }
            }
        });

        $("#btnCancel", form).click(function () {
            common.ClosePopup();
        });
    };

    errorManagement.OpenPopupUpdateError = function (obj) {
        var form = $("#updateErrForm").clone();

        $("#errorName", form).val(obj.errName);
        $("#errorDes", form).val(obj.errDesc);
        $("#errorVal", form).val(obj.errVal);
        $("#isEnabled", form).prop("checked", obj.errEnabled == "false" ? false : true);

        refreshPopup();
        common.Modal(labels.EditError, form);

        $('input[type=text]').on('keydown', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                $("#btnSave", form).trigger('click');
            }
        });

        $("#btnSave", form).click(function () {
            if (validator.ValidateForm(form, 'w')) {
                var error = {
                    ErrorId: obj.errId,
                    NewErrorName: $("#errorName", form).val().trim(),
                    NewErrorDesc: $("#errorDes", form).val().trim(),
                    NewValue: $("#errorVal", form).val().trim(),
                    NewDisabled: !$("#isEnabled", form).is(":checked")
                };

                if (parseInt(error.NewValue) == error.NewValue && error.NewValue > 0 && error.NewValue < 100) {
                    errorManagementService.UpdateError(error).then(function () {
                        errorManagement.Result = errorManagementService.Result;

                        if (errorManagement.Result.Code === 0) {
                            common.ShowInlineSuccessMsg($("#divErrorSuccessMsg", form), messages.AddErrorSuccessfully, false, function () {
                                timeout = setTimeout(common.ClosePopup, 3000);
                            });

                            reloadPage();
                        } else {
                            common.ShowInlineErrorMsg($("#divErrorSuccessMsg", form), errorManagement.Result.Message);
                            return false;
                        }
                    });
                }
                else {
                    common.ShowInlineErrorMsg($("#divErrorSuccessMsg", form), messages.InvalidValueError);
                }
            }
        });

        $("#btnCancel", form).click(function () {
            common.ClosePopup();
        });
    };

    errorManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        errorManagement.GetAllErrors();
    };

    var cacheDOMElements = function () {
        domElements.ErrorGrid = $('#divErrGrid');
        domElements.lnkAddNewError = $('#newErrLink');
        domElements.divInsertErrorForm = $('#divInsertErrorForm').clone();
        domElements.divUpdateErrorForm = $('#divUpdateErrorForm').clone();

        $('#divHiddenForm').empty();
    };

    var renderGrid = function (data) {
        var nameColFormat = '<span class="edit-error-link link" ' +
            'data-error-id="{0}" data-error-name="{1}" data-error-desc ="{2}" data-error-value="{3}" data-error-enabled="{4}">{1}</span>';
        var descColFormat = '<span class="wordwrap-span" id="errorDesc_{0}">{1}</span>';
        var checkBox = '<input type="checkbox" data-error-id="{0}" {1}>';
        var deleteBtn = '<a class="error-delete-button" data-error-id="{0}"></a>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.ErrorName, Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Description, Width: 300, Name: 'ColDes', HeaderAlign: 'center', CellAlign: 'left', AllowTruncate: true },
                      { HeaderText: "Value", Width: 40, Name: 'ColVal', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.CreatedDate, Width: 180, Name: 'ColCreatedDate', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.CreatedBy, Width: 150, Name: 'ColCreatedBy', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Active", Width: 80, Name: 'ColEnable', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "", Width: 80, Name: 'ColDelete', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 100,
        };
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                var editableErrorNameCol = nameColFormat.format(item.ErrorId, item.ErrorName, item.ErrorDesc == null ? "" : item.ErrorDesc, item.Value, !item.Disabled);
                var errorNameCol = item.ErrorName;
                //errorDescCol = descColFormat.format(item.ErrorId, item.Description);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColName', Value: hasEditRight ? editableErrorNameCol : errorNameCol },
                              { Name: 'ColDes', Value: normalizeString(item.ErrorDesc) },
                              { Name: 'ColVal', Value: item.Value },
                              { Name: 'ColCreatedDate', Value: item.CreatedDateFormatted },
                              { Name: 'ColCreatedBy', Value: item.CreatedBy },
                              { Name: 'ColEnable', Value: checkBox.format(item.ErrorId, item.Disabled ? "" : "checked") },
                              { Name: 'ColDelete', Value: deleteBtn.format(item.ErrorId) }
                    ]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.ErrorGrid.fanexGrid(gridOptions);
    };

    var reloadPage = function () {
        errorManagement.GetAllErrors();
    };

    var handlePageEvents = function () {
        domElements.lnkAddNewError.on('click', function () {
            errorManagement.OpenPopupAddNewError();
        });

        domElements.ErrorGrid.on('click', 'span.edit-error-link', function () {
            var $obj = $(this);
            var obj = {
                errId: $obj.attr('data-error-id'),
                errName: $obj.attr('data-error-name'),
                errDesc: $obj.attr("data-error-desc"),
                errVal: $obj.attr("data-error-value"),
                errEnabled: $obj.attr("data-error-enabled")
            }
            errorManagement.OpenPopupUpdateError(obj);
        });

        domElements.ErrorGrid.on('change', 'input:checkbox', function () {
            var $this = $(this);

            var criteria = {
                ErrorId: $this.attr("data-error-id"),
                Disabled: !$this.prop("checked")
            };

            errorManagementService.UpdateErrorStatus(criteria, function (result) {
                if (result.Code == 0) {
                    common.ShowInfoMessage(criteria.Disabled ? "Error has been activated" : "Error has been deactivated");
                } else {
                    common.ShowErrorMessage(result.Message);
                }
            });
        });

        domElements.ErrorGrid.on("click", ".error-delete-button", function () {
            var $this = $(this);
            common.ShowConfirmMessage("Are you sure you want to delete this error?", function () {
                var criteria = {
                    ErrorId: $this.attr("data-error-id")
                };

                errorManagementService.DeleteError(criteria, function (result) {
                    if (result.Code == 0) {
                        common.ShowInfoMessage("Error has been deleted");
                        reloadPage();
                    } else {
                        common.ShowErrorMessage(result.Message);
                    }
                });
            });
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return errorManagement;
})(jQuery);