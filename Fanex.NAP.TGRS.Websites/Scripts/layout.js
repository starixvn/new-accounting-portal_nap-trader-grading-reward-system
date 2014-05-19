/* File Created: April 29, 2014 */
/* global Namespace, common */
/* exported layout */
'use strict';

Namespace.Register("Fanex.TGRS.Layout");
Fanex.TGRS.Layout = function () {
    var $this = this;

    // Create date picker.
    $this.CreateDatepicker = function ($obj, id, label, labelCss, defaultDate, minDate, maxDate, pickerCss, onChangeHandler) {
        var configObj = {};

        labelCss = labelCss || 'col_2';
        pickerCss = pickerCss || 'col_6 width-auto';
        onChangeHandler = onChangeHandler || function () { };

        configObj = {
            nexDatePickerType: 'single',
            firstDatePicker: {
                Id: id,
                Label: label,
                InitDate: defaultDate,
                LabelCss: 'lbl-field ' + labelCss,
                TextboxCss: 'edit-field ' + pickerCss
            },
            datePickerFormat: {
                dateFormat: common.Formats.DateFormat,
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true
            },
            onSelectDatePicker: onChangeHandler
        };

        if (minDate) {
            configObj.datePickerFormat.minDate = new Date(minDate);
        }

        if (maxDate) {
            configObj.datePickerFormat.maxDate = new Date(maxDate);
        }

        return $obj.nexDatePicker(configObj);
    };

    // Create date range picker.
    $this.CreateDateRange = function (
                                $obj,
                                fromLabel,
                                fromLabelCss,
                                fromCss,
                                defaultFromDate,
                                toLabel,
                                toLabelCss,
                                toCss,
                                defaultToDate,
                                minDate,
                                maxDate,
                                onFromDateChangeHandler,
                                onToDateChangeHandler) {
        var configObj = null;

        fromLabelCss = fromLabelCss || 'col_3';
        toLabelCss = toLabelCss || 'col_3';
        fromCss = fromCss || 'col_6 width-auto';
        toCss = toCss || 'col_6 width-auto';
        onFromDateChangeHandler = onFromDateChangeHandler || function () { };
        onToDateChangeHandler = onToDateChangeHandler || function () { };

        configObj = {
            nexDatePickerType: 'daterange',
            firstDatePicker: {
                Id: 'dpkFromDate',
                Label: fromLabel,
                InitDate: defaultFromDate,
                LabelCss: 'lbl-field' + ' ' + fromLabelCss,
                TextboxCss: 'edit-field' + ' ' + fromCss
            },
            secondDatePicker: {
                Id: 'dpkToDate',
                Label: toLabel,
                InitDate: defaultToDate,
                LabelCss: 'lbl-field' + ' ' + toLabelCss,
                TextboxCss: 'edit-field' + ' ' + toCss
            },
            datePickerFormat: {
                dateFormat: common.Formats.DateFormat,
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true
            },
            onSelectDatePicker: function (selectedDate, control) {
                if (control.attr('id') === 'dpkFromDate') {
                    onFromDateChangeHandler(selectedDate, control);
                } else {
                    onToDateChangeHandler(selectedDate, control);
                }
            }
        };

        if (minDate) {
            configObj.datePickerFormat.minDate = new Date(minDate);
        }

        if (maxDate) {
            configObj.datePickerFormat.maxDate = new Date(maxDate);
        }

        return $obj.nexDatePicker(configObj);
    };
};

var layout = new Fanex.TGRS.Layout();