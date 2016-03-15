/* File Created: Jan 22, 2016 */
/*jshint strict: false, camelcase: false*/
/* global common, validator, messages */

var targetedMarginFactory = (function ($) {
    "use strict";

    return {
        getMargin: function () {
            return $.get(common.ResolveRootUrl('TargetedMargin/GetAllMargin'));
        },
        updateMargin: function (modifiedMargin) {
            return $.post(common.ResolveRootUrl('TargetedMargin/UpdateMargin'), modifiedMargin);
        },
        getHostPermission: function () {
            return $.get(common.ResolveRootUrl('TargetedMargin/GetHostPermission'));
        }
    };
})(jQuery);

var gridState = {
    focusedGrid: null,
    resetFocus: function () {
        if (this.focusedGrid == null) {
            return;
        }

        this.focusedGrid.removeClass('hide').next().addClass('hide');
    },
    setFocus: function (span) {
        span.addClass('hide');
        span.next().removeClass('hide');
        this.focusedGrid = span;
    }
};

var targetedMarginService = (function ($) {
    "use strict";

    var targetedMarginService = {};

    targetedMarginService.hasHostPermission = false;

    targetedMarginService.result = null;

    targetedMarginService.Search = function () {
        common.DisableInput();

        targetedMarginFactory.getHostPermission().success(function (result) {
            targetedMarginService.hasHostPermission = result;

            targetedMarginFactory.getMargin().success(function (marginList) {
                renderTable(marginList);

                common.EnableInput();
            });
        });
    };

    targetedMarginService.Update = function (targetedMarginId, newTargetedMargin) {
        var criteria = {
            TargetedMarginId: targetedMarginId,
            Rate: (newTargetedMargin * 1).toFixed(2)
        };

        return targetedMarginFactory.updateMargin(criteria).success(function (result) {
            targetedMarginService.result = result;
        });
    };

    function createTargetedMarginTable(margins) {
        var targetedMarginFormat = '<span class="targeted-margin-link link" data-targeted-margin-id="{0}">{1}</span>' +
                              '<input type="text" maxlength="5" class="targeted-margin hide" style="width: 94px !important;height: 15px;"/>';
        var targetedMarginFormatNoHost = '<span class="targeted-margin-link link" data-targeted-margin-id="{0}">{1}</span>';

        var rows = [];

        for (var index = 0; index < margins.length; index++) {
            var margin = margins[index];
            var rowNum = index + 1;

            rows.push({
                Columns: [
                        { Name: "Row", Value: rowNum },
                        { Name: "BetType", Value: margin.BetType },
                        {
                            Name: "AfternoonRate", Value: targetedMarginService.hasHostPermission ?
                                targetedMarginFormat.format(margin.AfternoonMargin.TargetedMarginId, (margin.AfternoonMargin.Rate * 100).toFixed(2)) :
                                targetedMarginFormatNoHost.format(margin.AfternoonMargin.TargetedMarginId, (margin.AfternoonMargin.Rate * 100).toFixed(2))
                        },
                        {
                            Name: "NightRate", Value: targetedMarginService.hasHostPermission ?
                                targetedMarginFormat.format(margin.NightMargin.TargetedMarginId, (margin.NightMargin.Rate * 100).toFixed(2)) :
                                targetedMarginFormatNoHost.format(margin.NightMargin.TargetedMarginId, (margin.NightMargin.Rate * 100).toFixed(2))
                        },
                        {
                            Name: "MidnightRate", Value: targetedMarginService.hasHostPermission ?
                                targetedMarginFormat.format(margin.MidnightMargin.TargetedMarginId, (margin.MidnightMargin.Rate * 100).toFixed(2)) :
                                targetedMarginFormatNoHost.format(margin.MidnightMargin.TargetedMarginId, (margin.MidnightMargin.Rate * 100).toFixed(2))
                        }
                ]
            });
        }

        return rows;
    }

    function renderTable(marginList) {
        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 100, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Bet Type", Width: 300, Name: "BetType", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Afternoon (%)", Width: 100, Name: "AfternoonRate", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Night (%)", Width: 100, Name: "NightRate", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Midnight (%)", Width: 100, Name: "MidnightRate", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: createTargetedMarginTable(marginList),
            gridExpandHeight: 100,
        };

        $("#divTargetedMarginGrid").fanexGrid(gridOptions);

        if (targetedMarginService.hasHostPermission) {
            handleGridEvents();
        }
    };

    var handleGridEvents = function () {
        var targetedMarginLinks = $('#divTargetedMarginGrid').find('span.targeted-margin-link');
        var targetedMarginInputs = $('#divTargetedMarginGrid').find('input.targeted-margin');

        // Format the benchmark value which is input into the text box.
        targetedMarginInputs.numberField(5, false);

        var oldTargetedMargin = 0;

        // When user clicks on benchmark link.
        targetedMarginLinks.on('click', function () {
            var $link = $(this);
            var $input = $link.next();
            var targetedMargin = $link.text();
            oldTargetedMargin = parseFloat(targetedMargin).toFixed(2);

            // Disable other active fields.
            $.each(targetedMarginLinks, function (index, link) {
                $(link).removeClass('hide').next().addClass('hide').tipsy('hide');
            });

            // Fill current value into text box.
            $link.addClass('hide');
            $input.val(targetedMargin).removeClass('hide').focus().select();
        });
        
        // Handle key up event.
        targetedMarginInputs.on('keyup', function (event) {
            var $input = $(this);
            var $link = $input.prev();
            var newTargetedMargin = parseFloat($input.val()).toFixed(2);

            if (event.keyCode === 13 && validateTargetedMargin($input) && oldTargetedMargin !== newTargetedMargin) {
                var targetedMarginId = $link.attr('data-targeted-margin-id');

                targetedMarginService.Update(targetedMarginId, newTargetedMargin).then(function () {
                    if (targetedMarginService.result.IsSuccessful) {

                        common.ShowInfoMessage(messages.success);

                        $link.text((newTargetedMargin * 1).toFixed(2));
                        $input.addClass('hide');
                        $link.removeClass('hide');
                        $input.tipsy('hide');
                    } else {
                        common.ShowErrorMessage(targetedMarginService.result.Message);
                    }
                });
            } else if (event.keyCode === 27) {
                $input.addClass('hide');
                $link.removeClass('hide');
                $input.tipsy('hide');
            }
        });
    }

    var validateTargetedMargin = function ($input) {
        var value = $input.val().replace(/,/g, '');
        var isValid = $.isNumeric(value);

        if (isValid) {
            value = parseFloat(value);
            isValid = 0 < value && value <= 100;
        }

        if (!isValid) {
            validator.ShowError($input, 'The value is between 0.xx and 99.xx', 'e');
        }

        return isValid;
    };

    return targetedMarginService;
})(jQuery);

$(function () {
    targetedMarginService.Search();
});