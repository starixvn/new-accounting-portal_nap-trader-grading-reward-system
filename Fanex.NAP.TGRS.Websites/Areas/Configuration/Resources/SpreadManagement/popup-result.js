var spreadPopupResult = (function ($) {
    "use strict";

    var spreadPopupResult = {};

    var urls = {
        PopupResult: common.ResolveRootUrl('SpreadManagement/PopupResult'),
        UpdateSpreads: common.ResolveRootUrl('SpreadManagement/UpdateSpreads')
    };

    spreadPopupResult.save = function () {
        $.ajax({
            url: "SpreadManagement/UpdateSpread",
            type: "POST",
            processData: false,
            contentType: false,
            beforeSend: function () {
                alert('This process may take a while...');
            },
            success: function (result) {
                alert('done for updating spreads');
                try{
                    common.ClosePopup();
                }
                catch(err) { }
            }
        });
    };

    // Render grid.
    spreadPopupResult.renderGrid = function (data) {
        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "League Id", Width: 70, Name: "LeagueId", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "League Name", Width: 258, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet Type Id", Width: 70, Name: "BetTypeId", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Bet Type Name", Width: 250, Name: "BetTypeName", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Spread", Width: 50, Name: "Spread", HeaderAlign: "center", CellAlign: "center" }
            ],
            showNumberColumn: true,
            gridExpandHeight: 350
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