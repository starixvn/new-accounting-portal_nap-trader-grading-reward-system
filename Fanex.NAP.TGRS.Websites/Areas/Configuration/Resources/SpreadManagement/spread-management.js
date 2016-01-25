/* File Created: May 12, 2014 */
/*jshint strict: false*/

var spreadManagementFactory = (function ($) {
    "use strict";

    return {
        getAllSpread: function (criteria) {
            return $.post('SpreadManagement/GetAllSpread', criteria);
        },

        updateSpread: function (criteria) {
            return $.post('SpreadManagement/UpdateSpread', criteria);
        },

        deleteSpread: function (criteria) {
            return $.post('SpreadManagement/DeleteSpread', criteria);
        },

        exportSpreadList: function (criteria) {
            return $.post('SpreadManagement/ExportSpreadList', criteria);
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

    spreadManagementService.renderSpreadTable = function (spreadList) {
        spreadManagementService.gridOptions =
        {
            columns: [
                { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "LeagueId", Width: 100, Name: "LeagueId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "League Name", Width: 350, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "BetTypeId", Width: 500, Name: "BetTypeId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet Type Name", Width: 150, Name: "BetTypeName", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Spread", Width: 50, Name: "Spread", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "", Width: 50, Name: "DeleteSpread", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: spreadManagementService.createSpreadTable(spreadList.SpreadInfoItems),
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
                pagerSelectCallBack: spreadManagementService.reRenderAfterPaged
            }
        };

        $("#divSpreadGrid").fanexGrid(spreadManagementService.gridOptions);
    }

    spreadManagementService.createSpreadTable = function (spreads) {
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
                    { Name: "Spread", Value: "<div contenteditable onfocusout='updateSpread(this)' onfocusin='registerValue(" + spread.LeagueId + "," + spread.BetTypeId + "," + spread.Spread + ")'>" + spread.Spread + "</div>" },
                    {
                        Name: "DeleteSpread",
                        Value: "<img style='cursor: pointer;width:20px; height=20px;' src='../Areas/Configuration/Resources/SpreadManagement/Delete.ico' onclick='deleteSpread(" + spread.LeagueId + "," + spread.BetTypeId + ")'>"
                    }
                ]
            });
        };

        return rows;
    }

    spreadManagementService.reRenderAfterPaged = function (pageIndex, itemsPerPage) {
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
            spreadManagementService.renderSpreadTable(spreadList);
        });
    };

    return spreadManagementService;
})(jQuery);

$(document).ready(function () {
    spreadManagementService.Search();

    $("#excelBtn").click(function () {
        spreadManagementFactory.exportSpreadList({ leagueName: spreadManagementService.filter.leagueName });
    })
})

var updateObj = {
    LeagueId: null,
    BetTypeId: null,
    Spread: null
}

function deleteSpread(leagueId, bettypeId) {
    common.ShowConfirmMessage("Are you sure you want to delete this ?", function () {
        $.post("/spreadmanagement/deletespread", { LeagueId: leagueId, BetTypeId: bettypeId }, function (result) {
            common.ShowInfoMessage("success!");
            spreadManagementService.Search();
        }, function (result) {
            common.ShowErrorMessage(result);
        });
    });
};

function updateSpread(div) {
    var value = parseInt(div.innerHTML);

    if (isNaN(value)) {
        common.ShowErrorMessage("Please enter a valid number!");
        return;
    }

    if (value != updateObj.Spread) {
        updateObj.Spread = value;
        spreadManagementFactory.updateSpread(updateObj).success(function (result) {
            if (result.IsSuccessful) {
                common.ShowInfoMessage("success");
                spreadManagementService.Search();
            }
            else {
                common.ShowErrorMessage(result.Message);
            }
        })
    }
}

function registerValue(league, bet, spread) {
    updateObj.LeagueId = league;
    updateObj.BetTypeId = bet;
    updateObj.Spread = spread;
}