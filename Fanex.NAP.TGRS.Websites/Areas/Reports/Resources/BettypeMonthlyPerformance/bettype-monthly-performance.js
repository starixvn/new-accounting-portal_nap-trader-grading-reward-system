function bettypeMonthlyPerformance() {
    var performanceDetailHelper = new Fanex.NAP.TGRS.PerformanceDetail.Helper();

    performanceDetailHelper.IntializeFilterData();

    var bettypeSelector =
        $("#bettypeSelector")
            .multiselect({
                selectedList: 2,
                minWidth: 200,
                height: 200,
                allSelectedText: "All Bet Types",
                create: function () {
                    performanceDetailHelper.SelectDefaultBettypes($(this), performanceDetailHelper.GetDefaultBettypes());
                }
            })
            .multiselectfilter({ width: 135 })
            .change(() => validator.ClearError(bettypeSelector.next()));

    var yearSelector =
        $("#yearSelector")
            .multiselect({
                selectedList: 1,
                minWidth: 10,
                multiple: false,
                header: false,
                height: 100
            });

    var showHideCloumnsSelector = $("#idColumns");

    var grid = $("#table")

    $("#btnGenerate").click(generateData);

    var gridOptions =
        {
            customizeHeader: true,
            showFooter: true,
            numberOfFrozenColumn: 1,
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            titleInfo:
                {
                    showExcelButton: true,
                    exportExcelFunction: generateExcel,
                },
            showColumnsShowHide: false,
            autoResizeColumn: true,
            columnsNeedHide: [],
            gridExpandHeight: 230,
            allowTruncate: true,
            defaultCollapseAllGroups: true,
            virtualScroller: true
        }

    var data = { Data: null, Total: null };

    var columnList = [];

    initColumn();

    var currentSelected = null;

    function readCookie() {
        return (Cookies.getJSON("bettype-columns") || {}).data;
    }

    function setCookie(val) {
        Cookies.set("bettype-columns", { data: val });
    }

    function resetCookie() {
        Cookies.remove("bettype-columns");
    }

    function initColumn() {
        $("option", showHideCloumnsSelector).each(function (idx, ele) {
            ele.value = 1 + 5 * idx;
            columnList.push(ele.value);
        });

        showHideCloumnsSelector
            .multiselect({
                header: false,
                minWidth: 150,
                height: 180,
                noneSelectedText: 'Select columns',
                allSelectedText: 'All columns selected',
                selectedText: '# columns selected',
            })

        var cookie = readCookie();

        if (cookie == null) {
            showHideCloumnsSelector.val(columnList).multiselect("refresh");
        }
        else {
            showHideCloumnsSelector.val(cookie).multiselect("refresh");
        }
    }

    function generateData() {
        var url = common.ResolveRootUrl("Reports/BettypeMonthlyPerformance/GenerateData");

        var filter =
            {
                bettypes: (bettypeSelector.val() || []).join(","),
                year: yearSelector.val()
            }

        generateHeaders(filter);

        generateColumns(filter);

        if (validateBettypes()) {
            common.DisableInput();

            $.get(url, filter, function (json) {
                data = json;
                renderData(filter);
                showHideColumn();
                common.EnableInput();
            });
        }
    }

    function validateBettypes() {
        var val = bettypeSelector.val();

        if (val == null) {
            validator.ShowError(bettypeSelector.next(), "Required field!", "w");

            return false;
        }

        return true;
    }

    function generateHeaders(filter) {
        var result = { Columns: [] };

        result.Columns.push({
            HeaderText: "Bet Type",
            Name: "bet-type",
            MergeRowNumber: 2
        });

        var columns = 5;

        result.Columns.push({
            HeaderText: "Half Year 1 to 6",
            Name: "fst-match",
            MergeColNumber: columns
        });

        result.Columns.push({
            HeaderText: "Half Year 7 to 12",
            Name: "snd-match",
            MergeColNumber: columns
        });

        result.Columns.push({
            HeaderText: filter.year,
            Name: `${filter.year}-match`,
            MergeColNumber: columns
        });

        for (var i = 0; i < 12; i++) {
            var date = moment(`${filter.year}-${i + 1}-1`, "YYYY-MM-DD");

            result.Columns.push({
                HeaderText: `${date.format("MMM")} - ${filter.year}`,
                Name: `${i + 1}-match`,
                MergeColNumber: columns
            });
        }

        gridOptions.groupHeaderRows = [result];
    }

    function generateColumns(filter) {
        function generateSummaryColumn(prefix, text, header, isInteger) {
            return {
                HeaderText: text,
                Name: `${prefix}-${header}`,
                Width: 120,
                HeaderAlign: "center",
                CellAlign: "right",
                FormatNegative: "$",
                FormatNumber: isInteger ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
            }
        };

        function generateSummary(prefix) {
            var match = generateSummaryColumn(prefix, "Match", "match", true);

            var turnover = generateSummaryColumn(prefix, "Turnover", "turnover", false);

            var winloss = generateSummaryColumn(prefix, "Winloss", "winloss", false);

            var margin = generateSummaryColumn(prefix, "Margin(%)", "margin", false);

            var tickets = generateSummaryColumn(prefix, "Bet Count", "bet-count", true);

            return [match, turnover, winloss, margin, tickets];
        }

        var result = [];

        result.push({
            HeaderText: "Bet Type",
            Name: "bet-type",
            Width: 200,
            HeaderAlign: "center",
        });

        generateSummary("fst").forEach(v => result.push(v));

        generateSummary("snd").forEach(v => result.push(v));

        generateSummary(filter.year).forEach(v => result.push(v));

        for (var i = 0; i < 12; i++) {
            generateSummary(`${i + 1}`).forEach(v => result.push(v));
        }

        gridOptions.columns = result;
    }

    function showHideColumn() {
        var selected = showHideCloumnsSelector.val();

        if (data.Data != null) {
            var val = new Set(selected);

            var columns = []

            columnList.filter(v => !val.has(v)).forEach(function (v) {
                for (var i = 0; i < 5; i++) {
                    var k = parseInt(v);
                    columns.push(k + i);
                }
            });

            grid.fanexGrid("hideColumns", gridOptions, columns);
        }

        currentSelected = selected;

        setCookie(selected || []);
    }

    function renderData(filter) {
        function renderSummary(prefix, summary) {
            var result = [];

            result.push({
                Name: `${prefix}-match`,
                Value: summary == null ? "-" : summary.MatchCount
            });

            result.push({
                Name: `${prefix}-turnover`,
                Value: summary == null ? "-" : summary.Turnover
            });

            result.push({
                Name: `${prefix}-winloss`,
                Value: summary == null ? "-" : summary.Winloss
            });

            result.push({
                Name: `${prefix}-margin`,
                Value: summary == null ? "-" : summary.Margin * 100
            });

            result.push({
                Name: `${prefix}-bet-count`,
                Value: summary == null ? "-" : summary.BetCount
            });

            return result;
        }

        function renderRow(row, isTotal) {
            var result = [];

            if (isTotal) {
                result.push({
                    Name: `bet-type`,
                    Value: "Total",
                    CellAlign: "right"
                });
            }
            else {
                result.push({
                    Name: `bet-type`,
                    Value: row.BettypeName
                });
            }

            renderSummary("fst", row.FstHalf).forEach(v => result.push(v));
            renderSummary("snd", row.SndHalf).forEach(v => result.push(v));
            renderSummary(filter.year, row.FullYear).forEach(v => result.push(v));

            for (var i = 0; i < 12; i++) {
                var month = `${i + 1}`;
                renderSummary(month, row.Months[month]).forEach(v => result.push(v));
            }

            return { Columns: result };
        }

        if (data.Data != null) {
            gridOptions.bodyRows = data.Data.map(v => renderRow(v));
            gridOptions.footerRows = [renderRow(data.Total, true)];
        }
        else {
            gridOptions.bodyRows = [];
            gridOptions.footerRows = [];
        }

        grid.fanexGrid(gridOptions);
    }

    function generateExcel() {
        var url = common.ResolveRootUrl("Reports/BettypeMonthlyPerformance/GenerateExcel");

        var filter =
            {
                bettypes: (bettypeSelector.val() || []).join(","),
                year: yearSelector.val(),
                columns: (currentSelected || []).join(",")
            };

        common.DownloadFile(url, filter);
    }
}

$(bettypeMonthlyPerformance);