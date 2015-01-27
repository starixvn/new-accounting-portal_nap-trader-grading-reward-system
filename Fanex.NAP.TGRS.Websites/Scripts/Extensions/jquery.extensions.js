/* File Created: Nay 14, 2014 */
/*jshint strict: false*/
/*global moment, numeral */
////'use strict';

(function ($) {
    // Input field allows digits and on exceptional character at the beginning of the input value.
    $.fn.numberField = function (digits, allowNegative, firstChar) {
        var $this = $(this);

        // Get pointer position in the text box.
        var getCaret = function (element) {
            var position = 0;
            var ctrl = element.get(0);
            var ctrlSelStart = ctrl.selectionStart;
            var selection = document.selection;
            var selRange = null;

            if (ctrlSelStart || ctrlSelStart === '0') {
                position = ctrlSelStart;
            } else if (selection) {
                ctrl.focus();
                selRange = selection.createRange();
                selRange.moveStart('character', -ctrl.value.length);
                position = selRange.text.length;
            }

            return position;
        };

        // Set pointer position in the text box.
        var setCaret = function (element, position) {
            var ctrl = element.get(0);
            var selRange = null;

            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(position, position);
            } else if (ctrl.createTextRange) {
                selRange = ctrl.createTextRange();
                selRange.collapse(true);
                selRange.moveEnd('character', position);
                selRange.moveStart('character', position);
                selRange.select();
            }
        };

        var getSelectedText = function(element) {
            var ctrl = element.get(0);
            var value = ctrl.value;

            if (ctrl.selectionStart !== undefined) {
                return value.substr(ctrl.selectionStart, ctrl.selectionEnd - ctrl.selectionStart);
            } else if (document.selection) {
                return document.selection.createRange().text;
            } else {
                return '';
            }
        };

        var formatNumber = function (rawValue, decimalPos) {
            var value = null;

            // Ignore the case of when user has just input -0 or -0.0.
            if (rawValue !== '-0' && rawValue != '-0.0') {
                if (decimalPos < 0) {
                    value = numeral(rawValue).format('0,0');
                } else if (decimalPos < rawValue.length - 1) {
                    value = numeral(rawValue).format('0,0.0[000]');
                }
            } else {
                value = rawValue;
            }

            return value;
        };

        if ($this.attr('maxlength')) {
            $this.attr('original-maxlength', $this.attr('maxlength'));
        }

        $this.on('keypress', function (event) {
            var $obj = $(this);
            var value = $.trim($obj.val());
            var decimalPos = value.indexOf('.');
            var minusPos = value.indexOf('-');
            var cursorPos = getCaret($obj);
            var keyCode = event.which;
            var selectedText = getSelectedText($obj);
            var originalMaxlength = parseInt($this.attr('original-maxlength'));
            var maxlength = parseInt($obj.attr('maxlength'));

            if (minusPos >= 0) {
                if (originalMaxlength === maxlength) {
                    $obj.attr('maxlength', maxlength + 1);
                }
            } else if (originalMaxlength !== maxlength) {
                $obj.attr('maxlength', originalMaxlength);
            }

            // Allow ctrl, shilf, alt, tab, enter, backspace, delete, home, end, escape, left, right, up, down keys.
            if (event.ctrlKey || event.shilfKey || event.altkey ||
                (event.keyCode >= 35 && event.keyCode <= 40) ||
                ($.inArray(event.keyCode, [8, 9, 27, 13, 190]) !== -1) ||
                (keyCode === 0 && event.keyCode === 46)) {
                return;
            }

            // Allow decimal character if there is no decimal character has been input yet
            // and some digits have already been input before the decimal character.
            if ((digits > 0) &&
                (keyCode === 46) &&
                ((decimalPos < 0) || (decimalPos > 0 && cursorPos <= decimalPos)) &&
                (value.length > 0)) {
                return;
            }

            // Allow only one minus character at the begining of the value.
            if (allowNegative && keyCode === 45 &&
                ((cursorPos === 0 && minusPos < 0) || (selectedText.length === value.length))) {
                return;
            }

            // Allow digits.
            if ((48 <= keyCode) && (keyCode <= 57)) {
                // Prevent any digit if there is a alphabet character input.
                if (value.length > 0 && firstChar && firstChar.length > 0 &&
                    value[0].toLowerCase() === firstChar[0].toLowerCase() &&
                    selectedText.length !== value.length) {
                    return false;
                }

                // Check whether the number of digits after the decimal meets the requrement or not.
                if ((decimalPos < 0) ||
                    (decimalPos > 0 && cursorPos <= decimalPos) ||
                    ((decimalPos >= 0) && (value.length - decimalPos <= digits))) {
                    return;
                }
            }

            // Allow an exception at the beginning of string.
            if (firstChar && firstChar.length > 0 &&
                (value.length === 0 || selectedText.length === value.length) &&
                firstChar[0].toLowerCase() === String.fromCharCode(keyCode).toLowerCase()) {
                return;
            }

            return false;
        }).on('keyup', function (event) {
            var $obj = $(this);
            var value = $.trim($obj.val());
            var rawValue = value.replace(/,/g, '');

            if ($.isNumeric(rawValue)) {
                var decimalPos = rawValue.indexOf('.');
                var cursorPos = getCaret($obj);
                var cursorLastPos = cursorPos === value.length;
                var maxlength = parseInt($obj.attr('maxlength'));
                var lengthOffset = maxlength / 3 > 2 ? maxlength % 3 : 0;

                rawValue = rawValue === '' ? '0' : rawValue;
                value = formatNumber(rawValue, decimalPos) || value;

                if (value.length > maxlength) {
                    value = value.substring(0, maxlength + lengthOffset);
                    value = formatNumber(value.replace(/,/g, ''), decimalPos) || value;
                }

                if ((48 <= event.keyCode && event.keyCode <= 57) ||
                    (96 <= event.keyCode && event.keyCode <= 105) ||
                    (event.keyCode === 45 || event.keyCode === 46) ||
                    (event.keyCode === 109 || event.keyCode === 110)) {
                    cursorPos = cursorLastPos ? value.length : cursorPos;
                    $obj.val(value);
                    setCaret($obj, cursorPos);
                }
            }
        }).on('blur', function () {
            var $obj = $(this);
            var value = $.trim($obj.val());
            var rawValue = value.replace(/,/g, '');

            if ($.isNumeric(rawValue)) {
                var decimalPos = rawValue.indexOf('.');

                rawValue = rawValue === '' ? '0' : rawValue;

                if (decimalPos < 0) {
                    value = numeral(rawValue).format('0,0');
                } else if (decimalPos < rawValue.length - 1) {
                    value = numeral(rawValue).format('0,0.00[00]');
                }

                $obj.val(value);
            }
        });

        return $this;
    };

    // Auto-refresh control.
    $.fn.autoRefresh = function (values, defaultValue, callbackFunction, auto) {
        var $obj = $(this);
        var $refreshValue = $('<span class="refresh-value"></span>');
        var $refreshIcon = $('<span id="spanRefreshIcon" class="refresh-icon"></span>');
        var $dropdownIcon = $('<span class="dropdown-icon"></span>');
        var $options = $('<ul class="refresh-options"></ul>');
        var refreshTime = 0;
        var timeout;

        // Count down timer.
        var runTimer = function () {
            var counter = refreshTime;

            clearInterval(timeout);

            if (counter > 0) {
                timeout = setInterval(function () {
                    counter--;
                    $refreshValue.text(counter);

                    if (counter === 0) {
                        callbackFunction();
                        
                        if (auto) {
                            counter = refreshTime;
                        } else {
                            clearInterval(timeout);
                        }
                    }
                }, 1000);
            }
        };
        
        refreshTime = defaultValue || 0;
        defaultValue = refreshTime === 0 ? 'Not Refresh' : refreshTime;
        callbackFunction = callbackFunction || function () {};
        auto = auto === undefined ? true : auto;

        // Add not refresh value.
        $options.append($('<li class="option" data-value="0">Not Refresh</li>'));

        $.each(values, function (index, item) {
            $options.append($('<li class="option" data-value="' + item + '">' + item + ' sec</li>'));
        });

        $refreshValue.text(defaultValue);
        $refreshIcon.click(callbackFunction);
        $dropdownIcon.click(function () {
            $options.toggle();
        });

        $options.find('li').click(function () {
            var selectedValue = parseInt($(this).attr('data-value'));

            refreshTime = selectedValue;
            selectedValue = selectedValue === 0 ? 'Not Refresh' : selectedValue;
            $refreshValue.text(selectedValue);
            runTimer();
        });

        $('html').click(function (event) {
            if (!$(event.target).hasClass('dropdown-icon')) {
                $options.hide();
            }
        });

        $refreshIcon.append($refreshValue);
        $obj.addClass('auto-refresh').append($refreshIcon).append($dropdownIcon).append($options);
        runTimer();

        $obj.run = function () {
            runTimer();
        };

        $obj.stop = function () {
            clearInterval(timeout);
        };

        return $obj;
    };

    // Period type.
    $.fn.timeRange = function (opts) {
        var $obj = $(this);
        var currentDate = new Date();
        var defaultOptions = {
            minDate: null,
            maxDate: null,
            defaultFromDate: currentDate,
            defaultToDate: currentDate,
            allowYearRange: null,
            yearRanges: null,
            labelCss: 'col_3'
        };
        var elements = {
            ddlPeriodTypes: null,
            divDatePickers: null,
            divDatePickersInner: null,
            dpkFromDate: null,
            dpkToDate: null,
            divMonthPickers: null,
            divMonthFrom: null,
            divMonthTo: null,
            divYearPicker: null,
            ddlYear: null
        };
        var options = $.extend(defaultOptions, opts);

        var template = $('<div class="lbl-field ' + options.labelCss + '"><label>Period Type</label></div>' +
                         '<div class="edit-field"><select id="ddlPeriodType" class="col_3"></select></div>' +
                         '<div class="edit-field"><div></div></div>' +
                         '<div class="edit-field">' +
                            '<div class="ui-separate-label-small"></div>' +
                            '<div class="ui-month-picker"><div id="divMonthFrom"></div></div>' +
                            '<div class="ui-separate-label month-label">-</div>' +
                            '<div class="ui-month-picker second-month"><div id="divMonthTo"></div></div>' +
                         '</div>');
                         //'<div class="edit-field"><select id="ddlYear"></select></div>');

        var queryElements = function () {
            elements.ddlPeriodTypes = template.find('#ddlPeriodType');
            elements.divDatePickers = $(template.get(2));
            elements.divDatePickersInner = elements.divDatePickers.find('div');
            elements.divMonthPickers = $(template.get(3));
            elements.divMonthFrom = elements.divMonthPickers.find('#divMonthFrom');
            elements.divMonthTo = elements.divMonthPickers.find('#divMonthTo');
            elements.divYearPicker = $(template.get(4));
            elements.ddlYear = elements.divYearPicker.find('#ddlYear');
        };

        var initializePeriodTypes = function () {
            elements.ddlPeriodTypes.append($('<option value="1" selected>Date</option>'));
            elements.ddlPeriodTypes.append($('<option value="2">Month</option>'));
            //elements.ddlPeriodTypes.append($('<option value="3">Year</option>'));

            elements.ddlPeriodTypes.on('change', function () {
                var selectedValue = parseInt(elements.ddlPeriodTypes.val());

                switch (selectedValue) {
                    case 1:
                        elements.divDatePickers.show();
                        elements.divMonthPickers.hide();
                        elements.divYearPicker.hide();
                        break;

                    case 2:
                        elements.divDatePickers.hide();
                        elements.divMonthPickers.show();
                        elements.divYearPicker.hide();
                        break;

                    case 3:
                        elements.divDatePickers.hide();
                        elements.divMonthPickers.hide();
                        elements.divYearPicker.show();
                        break;
                }
            });
            elements.ddlPeriodTypes.multiselect({
                multiple: false,
                selectedList: 1,
                header: false,
                minWidth: 70,
                height: 47
            }).change();
        };

        var intializeDatePickers = function () {
            var configuration = null;
            var fromDateChangeHandler = function (selectedDate) {
                var limitedDate = moment(selectedDate).add('year', options.allowYearRange).add('day', -1);
                var maxDate = moment(options.maxDate) > limitedDate ? limitedDate.format('MM/DD/YYYY') : options.maxDate;

                elements.dpkToDate.datepicker('option', 'maxDate', maxDate);
            };
            var toDateChangeHandler = function (selectedDate) {
                var limitedDate = moment(selectedDate).add('year', options.allowYearRange * -1).add('day', 1);
                var minDate = moment(options.minDate) < limitedDate ? limitedDate.format('MM/DD/YYYY') : options.minDate;

                elements.dpkFromDate.datepicker('option', 'minDate', minDate);
            };

            configuration = {
                nexDatePickerType: 'daterange',
                firstDatePicker: {
                    Id: 'dpkFromDate',
                    Label: '',
                    InitDate: options.defaultFromDate,
                    LabelCss: 'ui-separate-label-small',
                    TextboxCss: 'edit-field width-auto'
                },
                secondDatePicker: {
                    Id: 'dpkToDate',
                    Label: '-',
                    InitDate: options.defaultToDate,
                    LabelCss: 'ui-separate-label',
                    TextboxCss: 'edit-field width-auto'
                },
                datePickerFormat: {
                    dateFormat: 'mm/dd/yy',
                    changeMonth: true,
                    changeYear: true,
                    showOtherMonths: true,
                    selectOtherMonths: true
                },
                onSelectDatePicker: function (selectedDate, control) {
                    if (control.attr('id') === 'dpkFromDate') {
                        fromDateChangeHandler(selectedDate);
                    } else {
                        toDateChangeHandler(selectedDate);
                    }
                }
            };

            if (options.minDate) {
                configuration.datePickerFormat.minDate = new Date(options.minDate);
            }

            if (options.maxDate) {
                configuration.datePickerFormat.maxDate = new Date(options.maxDate);
            }

            elements.divDatePickersInner.nexDatePicker(configuration);
            elements.dpkFromDate = elements.divDatePickers.find('#dpkFromDate');
            elements.dpkToDate = elements.divDatePickers.find('#dpkToDate');
        };

        var intializeMonthPickers = function () {
            var changeMonthFromHandler = function () {
                var selectedDate = elements.divMonthFrom.monPickr('getMonth', 'MM/dd/yyyy');
                var limitedDate = moment(selectedDate).add('year', options.allowYearRange).add('month', -1);
                var maxDate = moment(options.maxDate) > limitedDate ? limitedDate.format('MM/DD/YYYY') : options.maxDate;
                var minDate = moment(selectedDate).startOf('month').format('MM/DD/YYYY');

                elements.divMonthTo.monPickr('setMinMaxDate', minDate, maxDate);
            };
            var changeMonthToHandler = function () {
                var selectedDate = elements.divMonthTo.monPickr('getMonth', 'MM/dd/yyyy');
                var limitedDate = moment(selectedDate).add('year', options.allowYearRange * -1).add('month', 1);
                var minDate = moment(options.minDate) < limitedDate ? limitedDate.format('MM/DD/YYYY') : options.minDate;
                var maxDate = moment(selectedDate).endOf('month').format('MM/DD/YYYY');

                elements.divMonthFrom.monPickr('setMinMaxDate', minDate, maxDate);
            };

            elements.divMonthFrom.monPickr({
                plugInId: '#divMonthFrom',
                today: options.defaultFromDate,
                maxDate: options.maxDate,
                minDate: options.minDate,
                showDateRange: false,
                width: 118,
                zIndex: 99,
                afterChangeMonth: changeMonthFromHandler
            });
            elements.divMonthTo.monPickr({
                plugInId: '#divMonthTo',
                today: options.defaultFromDate, //options.defaultToDate,
                maxDate: options.maxDate,
                minDate: options.minDate,
                showDateRange: false,
                width: 118,
                zIndex: 99,
                afterChangeMonth: changeMonthToHandler
            });

            elements.divMonthFrom.on('click', 'input.monpickr-input', function () {
                elements.divMonthTo.monPickr('hideDropDown');
            });
            elements.divMonthTo.on('click', 'input.monpickr-input', function () {
                elements.divMonthFrom.monPickr('hideDropDown');
            });
        };

        var initalizeYearPicker = function () {
            var maxYear = (new Date(options.maxDate)).getFullYear();
            var minYear = (new Date(options.minDate)).getFullYear();

            if (!options.yearRanges) {
                options.yearRanges = [];

                for (var index = minYear; index < maxYear; index++) {
                    options.yearRanges.push(index);
                }
            }

            $.each(options.yearRanges, function (index, item) {
                elements.ddlYear.append($('<option value="' + item + '" selected>' + item +'</option>'));
            });
        };

        //options = $.extend(defaultOptions, options);
        $obj.hide().after(template);
        queryElements();
        initializePeriodTypes();
        intializeDatePickers();
        intializeMonthPickers();
        //initalizeYearPicker();

        template.getFrom = function () {
            var selectedValue = parseInt(elements.ddlPeriodTypes.val());
            var fromDate = '';

            switch (selectedValue) {
                case 1:
                    fromDate = elements.dpkFromDate.val();
                    break;

                case 2:
                    fromDate = elements.divMonthFrom.monPickr('getMonth', 'MM/dd/yyyy');
                    break;

                case 3:
                    fromDate = '01/01/' + elements.ddlYear.val();
                    break;
            }

            return fromDate;
        };

        template.getTo = function () {
            var selectedValue = parseInt(elements.ddlPeriodTypes.val());
            var toDate = '';

            switch (selectedValue) {
                case 1:
                    toDate = elements.dpkToDate.val();
                    break;

                case 2:
                    toDate = moment(elements.divMonthTo.monPickr('getMonth', 'MM/dd/yyyy')).endOf('month').format('MM/DD/YYYY');
                    break;

                case 3:
                    toDate = '12/31/' + elements.ddlYear.val();
                    break;
            }

            return toDate;
        };

        template.getPeriodType = function() {
            return parseInt(elements.ddlPeriodTypes.val());
        };

    return template;
    };

    // Clear field.
    $.fn.clearField = function (refresh) {
        var $input = $(this); //.addClass('clearable-input').wrap('<div class="clearable-field"></div>');
        var $xIcon = $('<span class="x-icon disabled"></span>').css('left', $input.width() - 8);

        if (!refresh) {
            $input.addClass('clearable-input').wrap('<div class="clearable-field"></div>').after($xIcon);
        } else {
            $xIcon = $input.next();
        }

        $input.on('focus', function () {
            if ($input.val().length > 0) {
                $xIcon.removeClass('disabled');
            }
        }).focusout(function () {
            $xIcon.addClass('disabled');
        }).keyup(function () {
            if ($input.val().length > 0) {
                $xIcon.removeClass('disabled');
            } else {
                $xIcon.addClass('disabled');
            }
        });

        $xIcon.on('mousedown', function () {
            if ($input.val().length > 0) {
                $input.val('');
                $xIcon.addClass('disabled');

                setTimeout(function () {
                    $input.focus();
                }, 50);
            }
        });

        return $input;
    };
})(jQuery);