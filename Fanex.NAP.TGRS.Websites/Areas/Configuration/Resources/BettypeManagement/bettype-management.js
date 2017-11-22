function BettypeManagement() {
    var grid = $('#divTeamsGrid');

    function createColumns(columnLabel) {
        var obj = 
            {
                HeaderText: columnLabel,
                Name: columnLabel,
                HeaderAlign: 'center',
                CellAlign: 'center',
                Width: 80
            };

        return obj
    }

    function renderValue(value) {
        if (typeof value === "boolean") return "<input type='checkbox' " + (value ? "checked": "") + "/>";

        if (value === null || value === undefined) return "-";
        return value;
    }

    function createRow(value, index) {
        var columns = [];

        columns[0] = { Name: "#", Value: index + 1 };

        for (var i = 0; i < bettypeColumns.length; i++) {
            columns[i + 1] = { Name: bettypeColumns[i], Value: renderValue(value[bettypeColumns[i]]) };
        }

        return {Columns: columns};
    }

    function renderColumns(columns) {
        columns[1].CellAlign = "left";
        columns[1].Width = 250
    }

    function renderGrid(data) {
        var tmp = bettypeColumns.slice();
        tmp.unshift("#");
        var columns = tmp.map(createColumns);
        var gridOptions = {};

        renderColumns(columns);

        gridOptions.columns = columns;
        gridOptions.bodyRows = data.map(createRow);
        grid.showNumberColumn = true;

        grid.fanexGrid(gridOptions);
    }

    function getBettypes() {
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/GetAllBettype')
        $.post(url, renderGrid);
    }

    getBettypes();
}

$(BettypeManagement);