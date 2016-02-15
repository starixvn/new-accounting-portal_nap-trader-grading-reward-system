var profitMarginFactory = (function ($) {
    "use strict";

    return {
        getMargin: function () {
            return $.get(common.ResolveRootUrl('TargetedMargin/GetAllMargin'));
        }
    }
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

var profitMarginService = (function ($) {
    "use strict";

    function createSpreadTable(margins) {
        var rateFormat = "<span data-id={0}>{0}</span><input min=1 max=99 style='width: 100px' class='hide' type='number' value={1}>"

        var rows = [];

        for (var index = 0; index < margins.length; index++) {
            var margin = margins[index];
            var rowNum = index + 1;

            rows.push({
                Columns: [
                        { Name: "Row", Value: rowNum },
                        { Name: "BetType", Value: margin.BetType },
                        { Name: "Rate", Value: rateFormat.format(rowNum, margin.Rate) },
                ]
            });
        }

        return rows;
    }

    function registerEvent() {
        $('.table-cell:has(span[data-id])').on('click', function () {
            var span = $(this).children().first();

            if (gridState.focusedGrid != null && gridState.focusedGrid.attr('data-id') != span.attr('data-id')) {
                gridState.resetFocus();
            }

            gridState.setFocus(span);
        });
    }

    return {
        renderTable: function (marginList) {
            var gridOptions = {
                columns: [
                    { HeaderText: "#", Width: 100, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Bet Type", Width: 200, Name: "BetType", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Rate (%)", Width: 100, Name: "Rate", HeaderAlign: "center", CellAlign: "center" },
                ],
                bodyRows: createSpreadTable(marginList),
                gridExpandHeight: 250,
            };

            $("#marginGrid").fanexGrid(gridOptions);

            registerEvent();
        }
    }
})(jQuery);

$(function () {
    profitMarginFactory.getMargin().success(function (marginList) {
        profitMarginService.renderTable(marginList);
    })
})