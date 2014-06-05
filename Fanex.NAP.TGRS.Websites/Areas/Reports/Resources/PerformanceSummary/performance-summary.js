/* File Created: May 12, 2014 */
/* global Namespace, common, labels, layout, numeral, yearOptions  */
'use strict';

$(document).ready(function () {
    var PerformanceSummary = new Fanex.TGRS.PerformanceSummary.PerformanceSummary();
    PerformanceSummary.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary.PerformanceSummary = function () {
    var $this = this;
    var maxYearRange = yearOptions.maxYearRange;
    var maxYearRangeSelect = yearOptions.maxYearRangeSelect;

    var urls = {
        GetReports: common.ResolveRootUrl('Reports/PerformanceSummary/GetReports'),
        GetTraderRank: common.ResolveRootUrl('Reports/PerformanceSummary/TraderRank')
    };
    var datePeriodType = {
        Date: 1,
        Month: 2,
        Year: 3
    };
    var domElements = {
        divDatePair: null,
        divFromMonthContainer: null,
        divFromMonth: null,
        divToMonthContainer: null,
        divToMonth: null,
        ddlYear: null,
        btnSearch: null,
        divGeneralInfo: null,
        lblWinLoss: null,
        lblMargin: null,
        lblTurnOver: null,
        lblMatches: null,
        divTeamGrid: null,
        divTraderGrid: null,
        divTopWinLeagueGrid: null,
        divTopLoseLeagueGrid: null,
        divBetTypeGrid: null,
        ddlPeriodType: null
    };
    var filterParameters = {
        ReportType: null,
        FromDate: null,
        ToDate: null
    };
    var selectYearDate = {
        FromDate: null,
        ToDate: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divDatePair = $('#divDatePair');
        domElements.divFromMonthContainer = $('#divFromMonthContainer');
        domElements.divFromMonth = $('#divFromMonth');
        domElements.divToMonthContainer = $('#divToMonthContainer');
        domElements.divToMonth = $('#divToMonth');
        domElements.ddlYear = $('#ddlYear');
        domElements.btnSearch = $('#btnSearch');
        domElements.divGeneralInfo = $('#divGeneralInfo');
        domElements.divTeamGrid = $('#divTeamGrid');
        domElements.divTraderGrid = $('#divTraderGrid');
        domElements.divTopWinLeagueGrid = $('#divTopWinLeagueGrid');
        domElements.divTopLoseLeagueGrid = $('#divTopLoseLeagueGrid');
        domElements.divBetTypeGrid = $('#divBetTypeGrid');
        domElements.ddlPeriodType = $('#ddlPeriodType');

        domElements.lblWinLoss = $("#lblWinLoss", domElements.divGeneralInfo);
        domElements.lblMargin = $("#lblMargin", domElements.divGeneralInfo);
        domElements.lblTurnOver = $("#lblTurnOver", domElements.divGeneralInfo);
        domElements.lblMatches = $("#lblMatches", domElements.divGeneralInfo);
    };

    function getReports() {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetReports,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderReports(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    }

    // Init page fields and events
    var initPageFields = function () {
        //Date picker
        initDatePicker();
        changeDatePicker(datePeriodType.Date);
        //btnSearch
        domElements.btnSearch.on('click', function () {
            filterParameters.ReportType = domElements.ddlPeriodType.val() * 1;
            if (filterParameters.ReportType === datePeriodType.Date) {
                filterParameters.FromDate = $("#dpkFromDate").val();
                filterParameters.ToDate = $("#dpkToDate").val();
            }
            else if (filterParameters.ReportType === datePeriodType.Month) {
                var fromDateVal = domElements.divFromMonth.monPickr("getMonth", common.Formats.MonthFormat);
                var fromDate = new Date(fromDateVal);
                var toDateVal = domElements.divToMonth.monPickr("getMonth", common.Formats.MonthFormat);
                var toDate = new Date(toDateVal);
                toDate = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0);

                filterParameters.FromDate = fromDate.toStringFormat(common.Formats.ShortDateFormat);
                filterParameters.ToDate = toDate.toStringFormat(common.Formats.ShortDateFormat);
            }
            else {
                filterParameters.FromDate = selectYearDate.FromDate.toStringFormat(common.Formats.ShortDateFormat);
                filterParameters.ToDate = selectYearDate.ToDate.toStringFormat(common.Formats.ShortDateFormat);
            }
            console.log(filterParameters.FromDate);
            console.log(filterParameters.ToDate);
            getReports();
        });

        domElements.ddlPeriodType.on('change', function () {
            var selectType = $("option:selected", this).val() * 1;
            changeDatePicker(selectType);
        });
        domElements.ddlYear.on('change', function () {
            var selectYear = $("option:selected", this).val() * 1;
            selectYearDate.FromDate = new Date(selectYear, 0, 1);
            selectYearDate.ToDate = new Date(selectYear + 1, 0, 1);
        });

        //event: click on top 10
        domElements.divTraderGrid.on('click', '.top10-link', function () {
            makeTopForm();
        });

        //event: click on top 10
        domElements.divTraderGrid.on('click', '.bottom10-link', function () {
            makeBottomForm();
        });
    };

    // Display new Trader form.
    var makeTopForm = function () {
        var urlFormat = urls.GetTraderRank + "?Top={0}&IsBottom={1}&ReportType={2}&FromDate={3}&ToDate={4}";
        var fromDate = filterParameters.FromDate;
        var toDate = filterParameters.ToDate;
        var url = urlFormat.format(10, 0, filterParameters.ReportType, fromDate, toDate);
        window.open(url, '_blank');
    };

    // Display new Trader form.
    var makeBottomForm = function () {
        var urlFormat = urls.GetTraderRank + "?Top={0}&IsBottom={1}&ReportType={2}&FromDate={3}&ToDate={4}";
        var fromDate = filterParameters.FromDate;
        var toDate = filterParameters.ToDate;
        var url = urlFormat.format(10, 1, filterParameters.ReportType, fromDate, toDate);
        window.open(url, '_blank');
    };

    var changeMaxDate = function () {
        var dateVal = $("#dpkFromDate").val();
        //max date is select date + [maxYearRangeSelect] year
        var maxDate = new Date(dateVal);
        maxDate.setYear(maxDate.getFullYear() + maxYearRangeSelect);
        maxDate.setDate(maxDate.getDate() - 1);

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        //if maxdate > yesterday, set maxdate = yesterday
        if (maxDate > yesterday) {
            maxDate = yesterday;
        }

        $("#dpkToDate").datepicker('option', 'maxDate', maxDate);
    };

    var changeMaxMonth = function () {
        var dateVal = domElements.divFromMonth.monPickr("getMonth", 'MMM dd, yyyy');

        //max date is select date + [maxYearRangeSelect] year
        var minDate = new Date(dateVal);
        var maxDate = new Date(dateVal);
        maxDate.setYear(maxDate.getFullYear() + maxYearRangeSelect);
        maxDate.setDate(maxDate.getDate() - 1);

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        //if maxdate > yesterday, set maxdate = yesterday
        if (maxDate > yesterday) {
            maxDate = yesterday;
        }

        domElements.divToMonth.monPickr('setMinMaxDate', minDate, maxDate);
    };

    var initDatePicker = function () {
        var toDate = new Date();
        var maxDate = null;
        var defaultFromDate = null;
        var minDate = new Date(toDate.getFullYear() - maxYearRange, 0, 1);

        //Date Pair
        //max date is yesterdate
        maxDate = new Date(toDate);
        maxDate.setDate(maxDate.getDate() - 1);
        //default date: 2 weeks after yesterday
        defaultFromDate = new Date(toDate);
        defaultFromDate.setDate(toDate.getDate() - 14);

        layout.CreateDatePair(
            domElements.divDatePair,
            '', 'hide', null,
            defaultFromDate,
            ' - ', 'col_1 align-center', null,
            maxDate, minDate, maxDate, changeMaxDate, null);

        //Month
        //max date: end of last month
        maxDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        //default date: begin of last month
        defaultFromDate = new Date(toDate.getFullYear(), toDate.getMonth() - 1, 1);

        //Date Month
        domElements.divFromMonth.monPickr({
            plugInId: '#divFromMonth',
            today: defaultFromDate,
            maxDate: maxDate,
            minDate: minDate,
            showDateRange: false,
            fromDayId: 'monthFromDate',
            toDayId: 'monthToDate',
            fromDayLabel: ' ',
            toDayLabel: ' ',
            afterChangeMonth: changeMaxMonth,
            log: function (msg) {
                console.warn(msg);
            }
        });

        domElements.divToMonth.monPickr({
            plugInId: '#divToMonth',
            today: defaultFromDate,
            maxDate: maxDate,
            minDate: minDate,
            showDateRange: false,
            fromDayId: 'monthFromDate',
            toDayId: 'monthToDate',
            fromDayLabel: ' ',
            toDayLabel: ' ',
            log: function (msg) {
                console.warn(msg);
            }
        });

        //Year
        //max date: end of last month
        var maxYear = toDate.getFullYear() - 1;
        //default date: begin of last month
        var minYear = maxYear - maxYearRange;
        for (var i = minYear; i <= maxYear; i++) {
            domElements.ddlYear.append(
                $('<option></option>').val(i).html(i)
            );
        }
        domElements.ddlYear.val(maxYear);

        //Begin of current year
        selectYearDate.FromDate = new Date(maxYear, 0, 1);
        //End of current year (begin of next year - 1)
        selectYearDate.ToDate = new Date(maxYear + 1, 0, 0);
    };

    var changeDatePicker = function (type) {
        if (type === datePeriodType.Date) {
            domElements.ddlYear.hide();
            domElements.divFromMonthContainer.hide();
            domElements.divToMonthContainer.hide();
            $(".month_lbl_field").hide();
            $("#dpkFromDate").show();
            $("#dpkToDate").show();
            $(".ui_nexdatepicker_lbl_field").show();
        }
        else if (type === datePeriodType.Month) {
            domElements.ddlYear.hide();
            domElements.divFromMonthContainer.show();
            domElements.divToMonthContainer.show();
            $(".month_lbl_field").show();
            $("#dpkFromDate").hide();
            $("#dpkToDate").hide();
            $(".ui_nexdatepicker_lbl_field").hide();
        }
        else if (type === datePeriodType.Year) {
            domElements.ddlYear.show();
            domElements.divFromMonthContainer.hide();
            domElements.divToMonthContainer.hide();
            $(".month_lbl_field").hide();
            $("#dpkFromDate").hide();
            $("#dpkToDate").hide();
            $(".ui_nexdatepicker_lbl_field").hide();
        }
    };

    var renderReports = function (data) {
        renderGeneralInfo(data.GeneralInfo);
        renderTeamGrid(data.TeamPerformances);
        renderWinLeagueGrid(data.WinLeagues);
        renderLoseLeagueGrid(data.LoseLeagues);
        renderTraderGrid(data.TraderPerformance);
        renderBetTypeGrid(data.BetTypePerformances);
    };

    var renderGeneralInfo = function (data) {
        domElements.divGeneralInfo.css({ display: "block" });
        domElements.lblWinLoss.text(numeral(data.Winlost).format(common.Formats.DecimalFormat));
        if (data.Margin != null) {
            domElements.lblMargin.text(numeral(data.Margin).format(common.Formats.DecimalFormat));
        }
        else {
            domElements.lblMargin.text(labels.NA);
        }
        domElements.lblTurnOver.text(numeral(data.Turnover).format(common.Formats.DecimalFormat));
        domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));
    };

    // Render team grid.
    var renderTeamGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.Team, Width: 350, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.TeamPerformance,
                showButtonsWhenNoData: true
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColTeam', Value: item.TeamName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTeamGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderWinLeagueGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5WinningLeagues
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColLeague', Value: item.LeagueName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTopWinLeagueGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderLoseLeagueGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5LosingLeagues
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColLeague', Value: item.LeagueName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTopLoseLeagueGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderTraderGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.TraderPerformance, Width: 350, Name: 'ColTraderType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.MinMargin, Width: 150, Name: 'ColMinMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.MaxMargin, Width: 100, Name: 'ColMaxMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.TraderPerformance
            }
        };
        var bodyData = [];
        var top10Col = '<span class="top10-link link">' + labels.Top10ByMargin + '</span>';
        var bottom10Col = '<span class="bottom10-link link">' + labels.Bottom10ByMargin + '</span>';
        var row;
        if (data) {
            row = {
                Columns: [{ Name: 'ColTraderType', Value: top10Col },
                              { Name: 'ColMinMargin', Value: data.TopMinMargin || labels.NA },
                              { Name: 'ColMaxMargin', Value: data.TopMaxMargin || labels.NA}]
            };
            bodyData.push(row);

            row = {
                Columns: [{ Name: 'ColTraderType', Value: bottom10Col },
                              { Name: 'ColMinMargin', Value: data.BottomMinMargin || labels.NA },
                              { Name: 'ColMaxMargin', Value: data.BottomMaxMargin || labels.NA}]
            };
            bodyData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTraderGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderBetTypeGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.BetType, Width: 350, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.BetTypePerformance
            }
        };
        var bodyData = [];
        var row;
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColBetType', Value: item.TypeName },
                              { Name: 'ColTurnOver', Value: item.Turnover },
                              { Name: 'ColWinLoss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divBetTypeGrid.fanexGrid(gridOptions);
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };
};
