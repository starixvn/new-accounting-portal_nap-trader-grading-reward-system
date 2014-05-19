/* File Created: April 29, 2014 */
/* global Namespace */
/* exported validator */
'use strict';

Namespace.Register("Fanex.TGRS.Validator");
Fanex.TGRS.Validator = function () {
    var $this = this;

    $this.ShowError = function ($obj, message, gravity) {
        if ($obj.is(':hidden')) {
            return;
        }

        $obj.attr('title', message);
        $obj.tipsy({
            trigger: 'manual',
            gravity: gravity ? gravity : 'sw',
            classStyle: 'error',
            inDocument: false,
            opacity: 0.97
        });
        $obj.tipsy('show').triggerHandler('raiseError');

        // FireFox will not re-focus to the control until blur event finshes.
        setTimeout(function () {
            $obj.focus();
        }, 0);

        // Hide error when changing the field.
        $obj.change(function () {
            $this.ClearError($obj);
        });
    };

    $this.ClearError = function ($obj) {
        $obj.tipsy('hide');
        $obj.removeAttr('original-title').triggerHandler('clearError');
    };

    $this.ClearErrors = function ($form) {
        $form.find('[original-title]').each(function () {
            $this.ClearError($(this));
        });
    };

    $this.ValidateRequiredField = function ($obj, gravity) {
        var $ele = $obj;
        var errMsg = $obj.attr('data-val-required');
        var value;

        if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
            $ele = $obj.find('input:first');
        }

        value = $.trim($ele.val());

        if (errMsg && !$ele.prop('disabled') && !value) {
            $this.ShowError($obj, errMsg, gravity);

            return false;
        } else {
            return true;
        }
    };

    $this.ValidateNumberField = function ($obj, gravity) {
        if (!$obj.attr('original-title')) {
            var $ele = $obj;
            var errMsg = $obj.attr('data-val-number');
            var value;

            if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
                $ele = $obj.find('input:first');
            }

            value = $.trim($ele.val().replace(/,/g, ''));

            if (errMsg && !$ele.prop('disabled') && (value !== '') && (!$.isNumeric(value))) {
                $this.ShowError($obj, errMsg, gravity);

                return false;
            }
        }

        return true;
    };

    $this.ValidateMinLengthField = function ($obj, gravity) {
        if (!$obj.attr('original-title')) {
            var $ele = $obj;
            var errMsg = $obj.attr('data-val-length');
            var minLen = parseInt($obj.attr('data-min-length'));
            var value;

            if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
                $ele = $obj.find('input:first');
            }

            value = $ele.val();

            if (errMsg && !$ele.prop('disabled') && (value.length < minLen)) {
                $this.ShowError($obj, errMsg, gravity);

                return false;
            }
        }

        return true;
    };

    $this.ValidateMaxLengthField = function ($obj, gravity) {
        if (!$obj.attr('original-title')) {
            var $ele = $obj;
            var errMsg = $obj.attr('data-val-length');
            var maxLen = parseInt($obj.attr('data-max-length'));
            var value;

            if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
                $ele = $obj.find('input:first');
            }

            value = $ele.val();

            if (errMsg && !$ele.prop('disabled') && (value.length > maxLen)) {
                $this.ShowError($obj, errMsg, gravity);

                return false;
            }
        }

        return true;
    };

    $this.ValidateRegexField = function ($obj, gravity) {
        if (!$obj.attr('original-title')) {
            var $ele = $obj;
            var errMsg = $obj.attr('data-val-regex');
            var pattern = new RegExp($obj.attr('data-val-regex-pattern'));
            var value;

            if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
                $ele = $obj.find('input:first');
            }

            value = $ele.val();

            if (errMsg && !$ele.prop('disabled') && !pattern.test(value)) {
                $this.ShowError($obj, errMsg, gravity);

                return false;
            }
        }

        return true;
    };

    $this.ValidateIPField = function ($obj, gravity) {
        if (!$obj.attr('original-title')) {
            var $ele = $obj;
            var errMsg = $obj.attr('data-val-ip');
            var isValid = true;
            var ip;
            var ipArray;

            if (!$obj.is('input') && !$obj.is('select') && !$obj.is('textarea')) {
                $ele = $obj.find('input:first');
            }

            ip = $.trim($ele.val());
            ipArray = ip.split('.');

            if (errMsg && !$ele.prop('disabled')) {
                $.each(ipArray, function (index, part) {
                    if (part !== '' && parseInt(part) > 255) {
                        isValid = false;
                    }
                });
            }

            if (!isValid) {
                $this.ShowError($obj, errMsg, gravity);

                return false;
            }
        }

        return true;
    };

    $this.ValidateForm = function ($form, gravity) {
        var errorCounter = 0;

        $this.ClearErrors($form);

        $('[data-val-required]', $form).each(function () {
            if (!$this.ValidateRequiredField($(this), gravity)) {
                errorCounter++;
            }
        });

        $('[data-val-number]', $form).each(function () {
            if (!$this.ValidateNumberField($(this), gravity)) {
                errorCounter++;
            }
        });

        $('[data-val-length]', $form).each(function () {
            if (!$this.ValidateMinLengthField($(this), gravity)) {
                errorCounter++;
            }
        });

        $('[data-val-length]', $form).each(function () {
            if (!$this.ValidateMaxLengthField($(this), gravity)) {
                errorCounter++;
            }
        });

        $('[data-val-regex]', $form).each(function () {
            if (!$this.ValidateRegexField($(this), gravity)) {
                errorCounter++;
            }
        });

        $('[data-val-ip]', $form).each(function () {
            if (!$this.ValidateIPField($(this), gravity)) {
                errorCounter++;
            }
        });

        return errorCounter === 0;
    };
    $this.GetValidatedFields = function ($form) {
        var fields = [];

        fields.push($('[data-val-required]', $form));
        fields.push($('[data-val-number]', $form));
        fields.push($('[data-val-length]', $form));
        fields.push($('[data-val-regex]', $form));
        fields.push($('[data-val-ip]', $form));

        return fields;
    };
    $this.CountErrors = function ($form) {
        return $('[original-title]', $form).length;
    };
};

var validator = new Fanex.TGRS.Validator();