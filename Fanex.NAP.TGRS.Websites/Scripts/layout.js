/* File Created: April 29, 2014 */
/* global Namespace, common */
/* exported layout */
'use strict';

Namespace.Register("Fanex.TGRS.Layout");
Fanex.TGRS.Layout = function () {
    var $this = this;

    // Create date picker.
    $this.CreateDatepicker = function ($obj, id, label, labelCss, defaultDate, minDate, maxDate, pickerCss) {
        var configObj = {};

        labelCss = labelCss || 'col_2';
        pickerCss = pickerCss || 'col_6 width-auto';

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

    // Create date range picker.
    $this.CreateDateRange = function ($obj, fromLabel, toLabel, defaultDate, minDate, maxDate) {
        var configObj = {
            nexDatePickerType: 'daterange',
            firstDatePicker: {
                Id: 'dpkFromDate',
                Label: fromLabel,
                InitDate: defaultDate,
                LabelCss: 'lbl-field col_2',
                TextboxCss: 'edit-field col_6 width-auto'
            },
            secondDatePicker: {
                Id: 'dpkToDate',
                Label: toLabel,
                InitDate: defaultDate,
                LabelCss: 'lbl-field col_2',
                TextboxCss: 'edit-field col_6 width-auto'
            },

            datePickerFormat: {
                dateFormat: common.Formats.DateFormat,
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true
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