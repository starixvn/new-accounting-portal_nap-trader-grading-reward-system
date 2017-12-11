function TraderPerformanceMonthly() {
    var bettypeSelector =
        $("#bettypeSelector")
            .multiselect({
                selectedList: 1,
                minWidth: 150,
                multiple: false,
                header: false,
                height: 120
            });

    var traderSearch = $("#traderSearch");

    var liveSelector =
        $("#liveSelector")
            .multiselect({
                selectedList: 1,
                minWidth: 100,
                multiple: false,
                header: false,
                height: 75
            });

    var gridOptions =
        {
            customizeHeader: true,
            showFooter: true,
            //numberOfFrozenColumn: 1 + Object.keys(columns.trader).length,
            showDistinctRow: false,
            showTree: true
        }

    var grid = $("#table");

    var index = 0;

    function getData() {
        common.DisableInput();

        var url = common.ResolveRootUrl("Reports/TraderMonthlyReport/GetMonthlyData");

        var filter =
            {
                bettype: bettypeSelector.val(),
                tradername: traderSearch.val(),
                livestatus: liveSelector.val()
            };

        $.post(url, filter, renderData);
    }

    function renderGroup(group) {       
        var obj = { Columns: [] };

        var row = group.Shift;

        renderTrader(row.Trader, obj, true);
        renderSummary(row.FstHalf, "fst", obj, columns.avg);
        renderSummary(row.SndHalf, "snd", obj, columns.avg);
        renderSummary(row.CurrentYear, "this year", obj, columns.avg);
        renderSummary(row.LastYear, "last year", obj, columns.avg);

        for (var i = 0; i < 12; i++) {
            renderSummary(row.Months[i + 1], i + 1, obj, columns.month);
        }

        obj.SubRows = group.Data.map(renderRow);

        return obj;
    }

    function renderRow(row) {
        var obj = { Columns: [] };

        renderTrader(row.Trader, obj, false);
        renderSummary(row.FstHalf, "fst", obj, columns.avg);
        renderSummary(row.SndHalf, "snd", obj, columns.avg);
        renderSummary(row.CurrentYear, "this year", obj, columns.avg);
        renderSummary(row.LastYear, "last year", obj, columns.avg);

        for (var i = 0; i < 12; i++) {
            renderSummary(row.Months[i + 1], i + 1, obj, columns.month);
        }

        return obj;
    }

    function renderTrader(trader, obj, isSummary) {
        for (var prop in columns.trader) {
            var column = columns.trader[prop];
            var value = trader[column];

            if (value === null) {
                if (!isSummary) {
                    obj.Columns.push({
                        Name: column,
                        Value: "-"
                    });
                }
            } else {
                var col =
                    {
                        Name: isSummary? "#" : column,
                        Value: value
                    };

                if (isSummary) {
                    col.MergeColNumber = 1 + Object.keys(columns.trader).length;
                }

                obj.Columns.push(col);
            }
        }

        if (!isSummary) {
            obj.Columns.unshift({
                Name: "#",
                Value: index++
            });
        }

        //if (isSummary) obj.CssClass = "shift-summary";
    }

    function renderSummary(summary, prefix, obj, columns) {
        for (var prop in columns) {
            var column = columns[prop];

            if (summary === null || summary === undefined) {
                obj.Columns.push({
                    Name: "{0}/{1}".format(prefix, column),
                    Value: "-"
                });
            } else {
                var value = summary[column];

                obj.Columns.push({
                    Name: "{0}/{1}".format(prefix, column),
                    Value: value === null ? "-" : value
                });
            }
        }
    }

    function renderTotal(row) {
        var obj = { Columns: [] };

        obj.Columns.push({
            Name: "#",
            MergeColNumber: 1 + Object.keys(columns.trader).length,
            Value: labels.Overall,
            CellAlign: "right"
        });

        renderSummary(row.FstHalf, "fst", obj, columns.avg);
        renderSummary(row.SndHalf, "snd", obj, columns.avg);
        renderSummary(row.CurrentYear, "this year", obj, columns.avg);
        renderSummary(row.LastYear, "last year", obj, columns.avg);

        for (var i = 0; i < 12; i++) {
            renderSummary(row.Months[i + 1], i + 1, obj, columns.month);
        }

        return [obj];
    }

    function renderData(result) {
        index = 1;
        gridOptions.bodyRows = result.Data.map(renderGroup);
        gridOptions.footerRows = renderTotal(result.Total);

        grid.fanexGrid(gridOptions)

        common.EnableInput();

        console.log(gridOptions);
    }

    function getHeaders() {
        var groupHeaders = [{ Columns: [] }];

        groupHeaders[0].Columns.push({
            HeaderText: "#",
            Name: "#",
            MergeRowNumber: 2
        })

        for (var key in columns.trader) {
            groupHeaders[0].Columns.push({
                HeaderText: columns.trader[key],
                Name: columns.trader[key],
                MergeRowNumber: 2
            })
        }

        var avgLength = Object.keys(columns.avg).length;
        var monthLength = Object.keys(columns.month).length;

        groupHeaders[0].Columns.push({
            HeaderText: labels.FstHalf,
            Name: "fst/Match",
            MergeColNumber: avgLength
        })

        groupHeaders[0].Columns.push({
            HeaderText: labels.SndHalf,
            Name: "snd/Match",
            MergeColNumber: avgLength
        })

        groupHeaders[0].Columns.push({
            HeaderText: labels.ThisYear,
            Name: "this year/Match",
            MergeColNumber: avgLength
        })

        groupHeaders[0].Columns.push({
            HeaderText: labels.LastYear,
            Name: "last year/Match",
            MergeColNumber: avgLength
        })

        for (var i = 0; i < 12; i++) {
            var d = new Date("2001/{0}/1".format(i + 1));
            var s = d.toLocaleString("en-US", { month: "short" });
            groupHeaders[0].Columns.push({
                HeaderText: labels.Month.format(s),
                Name: (i + 1) + "/Match",
                MergeColNumber: monthLength
            })
        }

        gridOptions.groupHeaderRows = groupHeaders;
    }

    function getColumns() {
        var c = [];

        c.push({
            HeaderText: "#",
            Name: "#",
            Width: 40,
            HeaderAlign: "center",
            CellAlign: "left",
            ShowCollapseExpand: true
        });

        // trader
        for (var key in columns.trader) {
            var width = 100;

            if (key.includes("Grade")) width = 40
            else if(key == "Remark") width = 250

            c.push({
                HeaderText: columns.trader[key],
                Name: columns.trader[key],
                Width: width,
                HeaderAlign: "center",
                CellAlign: "center",
                AllowTruncate: true
            });
        }

        // fst half
        for (var key in columns.avg) {
            c.push({
                HeaderText: columns.avg[key],
                Name: "fst/" + columns.avg[key],
                Width: 120,
                HeaderAlign: "center",
                CellAlign: "center",
                FormatNegative: "$",
                FormatNumber: key.match(/Match|Bet/) ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
            });
        }

        // snd half
        for (var key in columns.avg) {
            c.push({
                HeaderText: columns.avg[key],
                Name: "snd/" + columns.avg[key],
                Width: 120,
                HeaderAlign: "center",
                CellAlign: "center",
                FormatNegative: "$",
                FormatNumber: key.match(/Match|Bet/) ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
            });
        }

        // this year
        for (var key in columns.avg) {
            c.push({
                HeaderText: columns.avg[key],
                Name: "this year/" + columns.avg[key],
                Width: 120,
                HeaderAlign: "center",
                CellAlign: "center",
                FormatNegative: "$",
                FormatNumber: key.match(/Match|Bet/) ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
            });
        }

        // last year
        for (var key in columns.avg) {
            c.push({
                HeaderText: columns.avg[key],
                Name: "last year/" + columns.avg[key],
                Width: 120,
                HeaderAlign: "center",
                CellAlign: "center",
                FormatNegative: "$",
                FormatNumber: key.match(/Match|Bet/) ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
            });
        }

        // month
        for (var i = 0; i < 12; i++) {
            for (var key in columns.month) {
                c.push({
                    HeaderText: columns.month[key],
                    Name: (i + 1) + "/" + columns.month[key],
                    Width: 120,
                    HeaderAlign: "center",
                    CellAlign: "center",
                    FormatNegative: "$",
                    FormatNumber: key.match(/Match|Bet/) ? common.Formats.IntegerFormat : common.Formats.DecimalFormat
                });
            }
        }

        gridOptions.columns = c;
    }

    getHeaders();
    getColumns();

    $("#btnGenerate").click(getData);
}

$(TraderPerformanceMonthly);