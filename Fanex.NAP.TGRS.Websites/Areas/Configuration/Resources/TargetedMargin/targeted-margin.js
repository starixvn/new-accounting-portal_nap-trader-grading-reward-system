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

    function createSpreadTable(margins) {
        var rateFormat = "<span data-id={0}>{1}</span><input maxlength=5  style='width: 50px; height: 12px' class='hide'  value={1}>";
        var rows = [];

        for (var index = 0; index < margins.length; index++) {
            var margin = margins[index];
            var rowNum = index + 1;

            rows.push({
                Columns: [
                        { Name: "Row", Value: rowNum },
                        { Name: "BetType", Value: margin.BetType },
                        {
                            Name: "AfternoonRate", Value: rateFormat.format(margin.AfternoonMargin.TargetedMarginId, (margin.AfternoonMargin.Rate * 100).toFixed(2))
                        },
                        {
                            Name: "NightRate", Value: rateFormat.format(margin.NightMargin.TargetedMarginId, (margin.NightMargin.Rate * 100).toFixed(2))
                        },
                        { Name: "MidnightRate", Value: rateFormat.format(margin.MidnightMargin.TargetedMarginId, (margin.MidnightMargin.Rate * 100).toFixed(2)) }
                ]
            });
        }

        return rows;
    }

    function registerEvent() {
        $('.free-grid-td-2:has(span[data-id]), .free-grid-td-3:has(span[data-id]), .free-grid-td-4:has(span[data-id])').on('click', function () {
            gridState.resetFocus();
            var span = $(this).find('span[data-id]');

            if (gridState.focusedGrid != null && gridState.focusedGrid.attr('data-id') != span.attr('data-id')) {
                gridState.resetFocus();
            }

            gridState.setFocus(span);
        });

        $('input').on('change', function () {
            var input = $(this);
            var span = $(this).prev();
            var original = span.html();
            var changedVal = input.val();

            if (isNaN(changedVal)) {
                input.val(original);
                common.ShowErrorMessage(messages.notANumber);
                return;
            }

            changedVal = parseFloat(changedVal).toFixed(2);
            if (changedVal <= 0 || changedVal >= 100) {
                input.val(original);
                common.ShowErrorMessage(messages.rateRange);
                return;
            }

            targetedMarginFactory.updateMargin({
                TargetedMarginId: span.attr("data-id"),
                Rate: changedVal
            }).success(function (data) {
                if (data.Code != 0) {
                    common.ShowErrorMessage(data.Message);
                    input.val(original);
                    return;
                }

                common.ShowInfoMessage(messages.success);
                span.html(changedVal);
                input.attr("value", changedVal);
                gridState.resetFocus();
            });
        });

        $('body').on('keyup', function (event) {
            if (event.keyCode == 27) {
                gridState.resetFocus();
            }
        });
    }

    return {
        renderTable: function (marginList) {
            var gridOptions = {
                columns: [
                    { HeaderText: "#", Width: 100, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Bet Type", Width: 300, Name: "BetType", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Afternoon (%)", Width: 100, Name: "AfternoonRate", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Night (%)", Width: 100, Name: "NightRate", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Midnight (%)", Width: 100, Name: "MidnightRate", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createSpreadTable(marginList),
                gridExpandHeight: 100,
            };

            $("#marginGrid").fanexGrid(gridOptions);

            targetedMarginFactory.getHostPermission().success(function (result) {
                if (result) {
                    $("span[data-id]").addClass("link");
                    registerEvent();
                }
            });
        }
    };
})(jQuery);

$(function () {
    targetedMarginFactory.getMargin().success(function (marginList) {
        targetedMarginService.renderTable(marginList);
    });
});