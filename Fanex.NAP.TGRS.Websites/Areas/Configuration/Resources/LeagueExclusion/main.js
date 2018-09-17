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

            common.ShowConfirmMessage(`Do you want to remove ${obj.LeagueName} from league exclusion list?`, function () {
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
            gridHeight: 380,
            fullHeight: false,
            showPager: true,
            pagerOption: {
                itemsPerPage: 50,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 200]
            }
        };

        target.fanexGrid(gridOptions);
        target.fanexGrid(gridOptions);
        target.fanexGrid(gridOptions);

        common.bindDataToFanexGrid(target, json);

        target.on("change", "input", function (e) {
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
        var league = $("#league-name", form).val();

        if (league == null || league.length < 3 || league.includes("<") || league.includes(">")) {
            common.ShowErrorMessage("Invalid League Name!");

            setTimeout(common.CloseMsgBox, 1500);
        }
        else {
            common.DisableInput();

            var searchString = JSON.stringify(league);

            var url = "LeagueExclusion/SearchLeague";

            $.get(url, { searchString }, function (json) {
                renderPickLeagueGrid(json, $("#avaiable-league-grid", form));

                $(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable").css("width", "910px");

                common.EnableInput();
            });
        }
    }
                                                                                                                                                                                                             
    requestData();

    $("#exclude-league-button")
        .click(function () {
            var clone = exclusionForm.clone();

            common.Popup("League Exclusion", clone, { resizable: false });

            $("#btnCancel", clone).click(common.ClosePopup);

            $("#btnSearch", clone).click(() => searchLeague(clone));

            $("input", clone).keydown(function (e) {
                if (e.keyCode == 13) {
                    searchLeague(clone);
                }
            });
        });
}

$(leagueExclution);