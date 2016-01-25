/* File Created: Jan 22, 2016 */
/*jshint strict: false*/

var spreadManagementFactory = (function ($) {
    "use strict";

    return {
        getAllSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/GetAllSpread'), criteria);
        },

        updateSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/UpdateSpread'), criteria);
        },

        deleteSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/DeleteSpread'), criteria);
        },

        exportSpreadList: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/ExportSpreadList'), criteria);
        }
    };

})(jQuery);

var spreadManagementService = (function ($) {
    "use strict";

    var spreadManagementService = {};

    spreadManagementService.filter = {
        pageIndex: 0,
        pageSize: 50,
        leagueName: ''
    };

    spreadManagementService.Search = function () {
        $('#PageSize').val(spreadManagementService.filter.pageSize);
        $('#PageIndex').val(spreadManagementService.filter.pageIndex);
        spreadManagementService.filter.leagueName = $('#LeagueName').text();

        var searchParams = {
            LeagueName: spreadManagementService.filter.leagueName,
            PageSize: spreadManagementService.filter.pageSize,
            PageIndex: spreadManagementService.filter.pageIndex + 1
        };

        spreadManagementFactory.getAllSpread(searchParams).success(function (spreadList) {
            renderSpreadTable(spreadList);
        });

        function renderSpreadTable(spreadList) {
            spreadManagementService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "LeagueId", Width: 100, Name: "LeagueId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "League Name", Width: 350, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "BetTypeId", Width: 500, Name: "BetTypeId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Bet Type Name", Width: 150, Name: "BetTypeName", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Spread", Width: 50, Name: "Spread", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createSpreadTable(spreadList.SpreadInfoItems),
                hideYBackGroundScroller: true,
                gridExpandHeight: 180,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1, 3],
                showPager: true,
                customPager: true,
                pagerOption: {
                    itemsPerPage: spreadManagementService.filter.pageSize,
                    currentPage: spreadManagementService.filter.pageIndex,
                    totalItem: spreadList.TotalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

            $("#divSpreadGrid").fanexGrid(spreadManagementService.gridOptions);
        }

        function createSpreadTable(spreads) {
            var rows = [];

            for (var index = 0; index < spreads.length; index++) {
                var spread = spreads[index];
                rows.push({
                    Columns: [
                        { Name: "Row", Value: spread.Row },
                        { Name: "LeagueId", Value: spread.LeagueId },
                        { Name: "LeagueName", Value: spread.LeagueName },
                        { Name: "BetTypeId", Value: spread.BetTypeId },
                        { Name: "BetTypeName", Value: spread.BetTypeName },
                        { Name: "Spread", Value: spread.Spread }
                    ]
                });
            }

            return rows;
        }

        function reRenderAfterPaged(pageIndex, itemsPerPage) {
            if (itemsPerPage !== $('#PageSize').val()) {
                $('#PageIndex').val(0);
                spreadManagementService.filter.pageIndex = 0;
            } else {
                $('#PageIndex').val(pageIndex);
                spreadManagementService.filter.pageIndex = pageIndex;
            }

            $('#PageSize').val(itemsPerPage);
            spreadManagementService.filter.pageSize = itemsPerPage;

            spreadManagementService.gridOptions.pagerOption.currentPage = pageIndex;
            spreadManagementService.Search();

            return false;
        }
    };

    return spreadManagementService;
})(jQuery);

$(document).ready(function () {
    spreadManagementService.Search();
});
