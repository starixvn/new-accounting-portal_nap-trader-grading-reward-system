function leagueExclution() {
    var leagueGrid = $("#league-grid"),
        exclusionForm = $("#league-exclusion-form");

    function renderGrid(json) {
        function renderRow(obj, idx) {
            var columns =
                [
                    { Name: "No", Value: 0 },
                    { Name: "League", Value: obj.LeagueName },
                    { Name: "Remove", Value: `<span class="league-exclusion-box spread-delete-button" data-index="${idx}"></span>` }
                ];

            var row = { Columns: columns };

            return row;
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", CellAlign: "center" },
                { HeaderText: "League", Width: 700, Name: "League" },
                { HeaderText: "Remove", Width: 60, Name: "Remove", CellAlign: "center" }
            ];

        var gridOptions =
        {
            columns,
            bodyRows: (json || []).map(renderRow),
            showNumberColumn: true,
            gridExpandHeight: 250
        };

        leagueGrid.fanexGrid(gridOptions);

        common.bindDataToFanexGrid(leagueGrid, json);

        $(".league-exclusion-box", leagueGrid).click(function (e) {
            var obj = common.getGridData(e.target);

            common.ShowConfirmMessage(`Do you want to remove ${obj.LeagueName} from exclusion list?`, function () {
                changeLeagueExclusion(obj, false);                
            });
        });
    }

    function changeLeagueExclusion(obj, isChecked) {
        console.log(obj);

        console.log(isChecked);

        var criteria = {
            LeagueId: obj.LeagueId,
            IsAdded: isChecked
        };

        var url = "LeagueExclusion/UpdateLeague";

        $.get(url, criteria, function () {
            requestData();
        });
    }

    function renderPickLeagueGrid(json, target) {
        function renderRow(obj, idx) {
            var columns =
                [
                    { Name: "No", Value: 0 },
                    { Name: "League", Value: obj.LeagueName },
                    { Name: "Remove", Value: `<input type="checkbox" data-index="${idx}" />` }
                ];

            var row = { Columns: columns };

            return row;
        }

        var columns =
            [
                { HeaderText: "#", Width: 60, Name: "No", CellAlign: "center" },
                { HeaderText: "League", Width: 700, Name: "League" },
                { HeaderText: "Exclude", Width: 60, Name: "Remove", CellAlign: "center" }
            ];

        var gridOptions =
        {
            columns,
            bodyRows: (json || []).map(renderRow),
            showNumberColumn: true,
            gridHeight: 200,
            fullHeight: false,
            marginRight: 0
        };

        target.fanexGrid(gridOptions);

        common.bindDataToFanexGrid(target, json);

        $("input", target).change(function (e) {
            var obj = common.getGridData(e.target);

            changeLeagueExclusion(obj, $(e.target).is(":checked"));
        });
    }

    function requestData() {
        common.DisableInput();

        var url = "LeagueExclusion/GetLeagues";

        $.get(url, {}, function (json) {
            renderGrid(json);

            common.EnableInput();
        });
    }

    function searchLeague(form) {
        common.DisableInput();

        var league = $("#league-name", form).val();

        if (league == null || league.length == 0) {
            common.ShowErrorMessage("Invalid League Name!");
        }
        else {
            var searchString = JSON.stringify(league);

            var url = "LeagueExclusion/SearchLeague";

            $.get(url, { searchString }, function (json) {
                renderPickLeagueGrid(json, $("#avaiable-league-grid", form));

                common.EnableInput();
            });
        }
    }

    requestData();

    $("#exclude-league-button").click(function () {
        var clone = exclusionForm.clone();

        common.Popup("League Exclusion Form", clone);

        $("#btnCancel", clone).click(common.ClosePopup);

        $("#btnSearch", clone).click(() => searchLeague(clone));
    });
}

$(leagueExclution);