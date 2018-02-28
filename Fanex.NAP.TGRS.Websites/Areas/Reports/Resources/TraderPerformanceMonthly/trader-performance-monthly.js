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

    var yearSelector =
        $("#yearSelector")
            .multiselect({
                selectedList: 1,
                minWidth: 150,
                multiple: false,
                header: false,
                height: 100
            });

    var shiftSelector =
        $("#shiftSelector")
            .multiselect({
                selectedList: 1,
                minWidth: 150,
                multiple: false,
                header: false,
                height: 120
            });

    var gradeSelector =
        $("#gradeSelector")
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
            numberOfFrozenColumn: 1 + Object.keys(columns.trader).length,
            showDistinctRow: false,
            showTree: true,
            showTitle: true,
            showColumnsShowHide: false,
            autoResizeColumn: true,
            columnsNeedHide: [],
            gridExpandHeight: 230,
            titleInfo:
            {
                showExcelButton: true,
                exportExcelFunction: getExcel,
                customButtons: '<span id="idShowhideColum" class="text-right" style="color:red;">Manage Columns</span>'
            }
        }

    var grid = $("#table");

    var index = 0;

    var filter = null;

    var showColumns = [];

    getShowColumns();

    createShowHideColumnMenu(grid, showColumns);

    registerShowHideColumnEvent(grid, gridOptions);

    function getShowColumns() {
        for (var i = 0; i < 7 + 5 * 7 + 12 * 5; i++) {
            showColumns.push(i);
        }
    }

    function getExcel() {
        var url = common.ResolveRootUrl("Reports/TraderMonthlyReport/ExportExcel");

        common.DownloadFile(url, filter);
    }

    function getData() {
        common.DisableInput();

        var url = common.ResolveRootUrl("Reports/TraderMonthlyReport/GetMonthlyData");

        filter =
            {
                bettype: bettypeSelector.val(),
                tradername: traderSearch.val(),
                Year: yearSelector.val(),
                Shift: shiftSelector.val(),
                Grade: gradeSelector.val()
            };

        labels.ThisYear = filter.Year;
        labels.LastYear = parseInt(filter.Year) - 1;
        labels.Month = "{0} - " + labels.ThisYear;

        getHeaders();
        getColumns();

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
                        Name: isSummary ? "#" : column,
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
            renderSummary(row.Months != null ? row.Months[i + 1] : null, i + 1, obj, columns.month);
        }

        return [obj];
    }

    function renderData(result) {
        index = 1;

        if (result !== null && result.Data !== null && result.Data.length > 0) {
            gridOptions.bodyRows = result.Data.map(renderGroup);
            gridOptions.footerRows = renderTotal(result.Total);
        }
        else {
            gridOptions.bodyRows = [];
            gridOptions.footerRows = [];
        }

        grid.fanexGrid(gridOptions);

        common.EnableInput();
    }

    function registerShowHideColumnEvent(gridElement, gridOptions) {
        var checkboxColumns = $(".menu-column input[type='checkbox']");

        checkboxColumns.off("change");

        checkboxColumns.on("change", function () {
            var columnIndex = $(this).data("index");
            var isChecked = $(this).prop("checked");

            if (columnIndex < 7) {
                var index = $(gridOptions.columnsNeedHide).index(columnIndex);

                if (isChecked) {
                    //Show the grid column
                    if (index > -1) {
                        //remove column index
                        gridOptions.columnsNeedHide.splice(index, 1);
                    }
                } else {
                    //Hide the grid column
                    if (index === -1) {
                        //insert column index
                        gridOptions.columnsNeedHide.push(columnIndex);
                    }
                }
            }
            else {
                var startIndex = 0;
                var endIndex = 0;
                if (columnIndex < 11) {
                    startIndex = (columnIndex - 6) * 7;
                    endIndex = startIndex + 7;
                }
                else {
                    startIndex = (columnIndex - 11) * 5 + 4 * 7 + 7;
                    endIndex = startIndex + 5;
                }

                for (var i = startIndex ; i < endIndex; i++) {
                    var index = $(gridOptions.columnsNeedHide).index(i);

                    if (isChecked) {
                        //Show the grid column
                        if (index > -1) {
                            //remove column index
                            gridOptions.columnsNeedHide.splice(index, 1);
                        }
                    } else {
                        //Hide the grid column
                        if (index === -1) {
                            //insert column index
                            gridOptions.columnsNeedHide.push(i);
                        }
                    }
                }
            }

            $(gridElement).fanexGrid("hideColumns", gridOptions, gridOptions.columnsNeedHide);
            $(gridElement).fanexGrid("resizeGrid", gridOptions);
        });
    };

    function createShowHideColumnMenu(gridElement, showColumns) {
        var gridTitle = $('<div class="grid-title" >' +
                            '<div class="grid-title-label" ></div>' +
                            '<div class="grid-toolbox col-sm-3"></div>' +
                        '</div>');
        var hideColumnsParentDiv = $('<div class="text-right"></div>');
        var hideColumnsButton = $('<span class="text-related">Manage Columns</span><a class="icon icon-related" href></a>');
        var hideColumnsMenu = $('<div class="menu-column col-sm-10 text-left"></div>');

        var hideColumnsForm = generateFormForMenu(showColumns);

        hideColumnsMenu.append(hideColumnsForm);
        hideColumnsParentDiv.append(hideColumnsButton).append(hideColumnsMenu);

        gridTitle.insertBefore(gridElement);

        $(".grid-title .grid-toolbox").append(hideColumnsParentDiv);
        $(".grid-toolbox").append(hideColumnsParentDiv);

        hideColumnsMenu.hide();

        hideColumnsButton.click(function (event) {
            event.preventDefault();

            hideColumnsMenu.show();
        });

        hideMenuWhenClickOutside(hideColumnsMenu);
    };

    function hideMenuWhenClickOutside(hideColumnsMenu) {
        $(document).on("mouseup", function (e) {
            var container = hideColumnsMenu;

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                container.hide();
            }
        });
    };

    function generateFormForMenu(showColumns) {
        var hideColumnsForm = $('<form class="form-horizontal "></form>');
        var definedColumns = getHeaders();

        $(definedColumns[0].Columns).each(function (idx, column) {
            if (idx > 0) {
                //default set checked for all checkboxes
                var checkbox = '<input type="checkbox" checked data-index="' + idx + '" id="' + idx + '">' +
                               '<label class="checkbox-label" for="' + idx + '">' + column.HeaderText + '</label>';

                var index = $(showColumns).index(idx);
                //check if the showColumns contain the index of this column.
                if (index === -1) {
                    //remove 'checked' for the hide column
                    checkbox = checkbox.replace("checked", "");
                }

                hideColumnsForm.append('<div class="form-group">' +
                                            '<span class="checkbox">' +
                                                checkbox +
                                            '</span>' +
                                    '<div>');
            }
        });

        return hideColumnsForm;
    };

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

        return groupHeaders;
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
            else if (key == "Remark") width = 250

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

    $("#btnGenerate").click(getData);
}

$(TraderPerformanceMonthly);