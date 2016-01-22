var spreadPopupResult = (function ($) {
    "use strict";

    var spreadPopupResult = {};

    var urls = {
        PopupResult: common.ResolveRootUrl('SpreadManagement/PopupResult'),
        UpdateSpreads: common.ResolveRootUrl('SpreadManagement/UpdateSpreads')
    };

    spreadPopupResult.save = function () {
        alert('save shit');
    };
   
    // Render grid.
    spreadPopupResult.renderGrid = function (data) {
        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "LeagueId", Width: 100, Name: "LeagueId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "League Name", Width: 100, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "BetTypeId", Width: 100, Name: "BetTypeId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet Type Name", Width: 100, Name: "BetTypeName", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Spread", Width: 50, Name: "Spread", HeaderAlign: "center", CellAlign: "center" }
            ],
            showNumberColumn: true,
            gridExpandHeight: 150            
        };

        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'Row', Value: index + 1 },
                            { Name: 'LeagueId', Value: item.LeagueId },
                            { Name: 'LeagueName', Value: item.LeagueName },
                            { Name: 'BetTypeId', Value: item.BetTypeId },
                            { Name: 'BetTypeName', Value: item.BetTypeName },
                            { Name: 'Spread', Value: item.Spread}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        $('#divUploadResultGrid').fanexGrid(gridOptions);
    };

    return spreadPopupResult;

})(jQuery);