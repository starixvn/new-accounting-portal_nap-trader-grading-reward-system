/* File Created: May 12, 2014 */
/* global Namespace, common, labels, layout, numeral */
'use strict';

$(document).ready(function () {
    var PerformanceSummary = new Fanex.TGRS.PerformanceSummary.PerformanceSummary();
    PerformanceSummary.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary.PerformanceSummary = function () {
    var $this = this;
    var maxYearRange = 3;
    var urls = {
        GetGeneralInfo: common.ResolveRootUrl('Reports/PerformanceSummary/GetGeneralInfo'),
        GetTeamPerformance: common.ResolveRootUrl('Reports/PerformanceSummary/GetTeamPerformance'),
        GetTraderPerformance: common.ResolveRootUrl('Reports/PerformanceSummary/GetTraderPerformance'),
        GetBetTypePerformance: common.ResolveRootUrl('Reports/PerformanceSummary/GetBetTypePerformance'),
        GetTopWinLeague: common.ResolveRootUrl('Reports/PerformanceSummary/GetTopWinLeague'),
        GetTopLoseLeague: common.ResolveRootUrl('Reports/PerformanceSummary/GetTopLoseLeague'),
        GetTopTrader: common.ResolveRootUrl('Reports/PerformanceSummary/GetTopTrader'),
        GetTraderRank: common.ResolveRootUrl('Reports/PerformanceSummary/TraderRank')
    };
    var datePeriodType = {
        Date: 1,
        Month: 2,
        Year: 3
    };
    var domElements = {
        dpkFromDate: null,
        dpkToDate: null,
        dpkFromMonth: null,
        dpkToMonth: null,
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
        ddlPeriodType: null,
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
//    var selectMonthDate = {
//        FromDate: null,
//        ToDate: null
//    };
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.dpkFromDate = $('#dpkFromDate');
        domElements.dpkToDate = $('#dpkToDate');
        domElements.dpkFromMonth = $('#dpkFromMonth');
        domElements.dpkToMonth = $('#dpkToMonth');
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

    function getReportByType(reportUrl, renderFunction) {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: reportUrl,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderFunction(result);
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
            setTimeout(function () {
                filterParameters.ReportType = domElements.ddlPeriodType.val()*1;
                if (filterParameters.ReportType === datePeriodType.Date)
                {
                    filterParameters.FromDate = domElements.txtFromDate.val();
                    filterParameters.ToDate = domElements.txtToDate.val();
                }
                else if (filterParameters.ReportType === datePeriodType.Month)
                {
                    filterParameters.FromDate = domElements.dpkFromMonth.nexDatePicker('getSingleFromMonth');
                    filterParameters.ToDate = domElements.dpkToMonth.nexDatePicker('getSingleToMonth');
                }
                else
                {
                    filterParameters.FromDate = selectYearDate.FromDate;
                    filterParameters.ToDate = selectYearDate.ToDate;
                }
                getAllReports();
            }, 70);// Delay 70ms for jQuery-UI combo-box to verify its state.
        });

        domElements.ddlPeriodType.on('change', function () {
            var selectType = $("option:selected", this).val()*1;
            changeDatePicker(selectType);
        });
        domElements.ddlYear.on('change', function () {
            var selectYear = $("option:selected", this).val()*1;
            selectYearDate.FromDate = new Date(selectYear, 0, 1);
            selectYearDate.ToDate = new Date(selectYear + 1, 0, 1);
        });

        domElements.txtFromMonth.on('change', function () {
                alert('month change');
//            var fromDate = new Date(domElements.txtFromMonth.val());
//            var toDate = new Date(domElements.txtToMonth.val());
//            selectMonthDate.FromDate = new Date(selectYear, 0, 1);
//            selectMonthDate.ToDate = new Date(selectYear + 1, 0, 1);
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
        var url = urlFormat.format(10, 0, filterParameters.ReportType, filterParameters.FromDate, filterParameters.ToDate);
        window.open(url, '_blank');
    };

    // Display new Trader form.
    var makeBottomForm = function () {
        var urlFormat = urls.GetTraderRank + "?Top={0}&IsBottom={1}&ReportType={2}&FromDate={3}&ToDate={4}";
        var url = urlFormat.format(10, 1, filterParameters.ReportType, filterParameters.FromDate, filterParameters.ToDate);
        window.open(url, '_blank');
    };

    var initDatePicker = function() {
        var toDate = new Date();
        var maxDate = null;
        var defaultFromDate = null;
        var minDate = new Date(toDate.getFullYear() - maxYearRange, 0, 1);

        //Date
        //max date is yesterdate
        maxDate = new Date(toDate);
        maxDate.setDate(maxDate.getDate() - 1);
        //default date: 2 weeks after yesterday
        defaultFromDate = new Date(toDate);
        defaultFromDate.setDate(toDate.getDate() - 14);

        layout.CreateDatepicker(domElements.dpkFromDate, 'txtFromDate',
        "", 'col_1', defaultFromDate, minDate, maxDate, '');
        layout.CreateDatepicker(domElements.dpkToDate, 'txtToDate',
            "", 'col_1', maxDate, minDate, maxDate, '');

        //Month
        //max date: end of last month
        maxDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        //default date: begin of last month
        defaultFromDate = new Date(toDate.getFullYear(), toDate.getMonth() - 1, 1);

        layout.CreateDatepickerMY(domElements.dpkFromMonth, 'txtFromMonth',
            "", 'col_1', defaultFromDate, minDate, maxDate, '');
        layout.CreateDatepickerMY(domElements.dpkToMonth, 'txtToMonth',
            "", 'col_1', maxDate, minDate, maxDate, '');

        //Year
        //max date: end of last month
        var maxYear = toDate.getFullYear();
        //default date: begin of last month
        var minYear = maxYear - maxYearRange;
        for (var i = minYear; i <= maxYear; i++) {
            domElements.ddlYear.append(
                $('<option></option>').val(i).html(i)
            );
        }
        domElements.ddlYear.val(maxYear);

        selectYearDate.FromDate = new Date(maxYear, 0, 1);
        selectYearDate.ToDate = new Date(maxYear + 1, 0, 0);

        domElements.txtFromDate = $('#txtFromDate');
        domElements.txtToDate = $('#txtToDate');
        domElements.txtFromMonth = $('#txtFromMonth');
        domElements.txtToMonth = $('#txtToMonth');
    };

    var changeDatePicker = function(type) {
        if (type === datePeriodType.Date) {
            domElements.ddlYear.hide();
            domElements.txtFromMonth.hide();
            domElements.txtToMonth.hide();
            domElements.txtFromDate.show();
            domElements.txtToDate.show();
        }
        else if(type === datePeriodType.Month) {
            domElements.ddlYear.hide();
            domElements.txtFromMonth.show();
            domElements.txtToMonth.show();
            domElements.txtFromDate.hide();
            domElements.txtToDate.hide();
        }
        else if(type === datePeriodType.Year) {
            domElements.ddlYear.show();
            domElements.txtFromMonth.hide();
            domElements.txtToMonth.hide();
            domElements.txtFromDate.hide();
            domElements.txtToDate.hide();
        }
    };

    var renderGeneralInfo = function(data) {
        domElements.divGeneralInfo.css({display: "block"});
        domElements.lblWinLoss.text(numeral(data.Winlost).format(common.Formats.DecimalFormat));
        if (data.Margin != null)
        {
            domElements.lblMargin.text(numeral(data.Margin).format(common.Formats.DecimalFormat));
        }
        else
        {
            domElements.lblMargin.text(labels.NA);
        }
        domElements.lblTurnOver.text(numeral(data.Turnover).format(common.Formats.DecimalFormat));
        domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));
    };

    // Render team grid.
    var renderTeamGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat }],
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
                              { Name: 'ColMargin', Value: item.Margin }]
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
            columns: [{ HeaderText: labels.League, Width: 200, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5WinLeague
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
                              { Name: 'ColMargin', Value: item.Margin }]
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
            columns: [{ HeaderText: labels.League, Width: 200, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.Top5LoseLeague
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
                              { Name: 'ColMargin', Value: item.Margin }]
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
            columns: [{ HeaderText: labels.TraderPerformance, Width: 200, Name: 'ColTraderType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColMinMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColMaxMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat }],
            gridExpandHeight: 50,
            showTitle: true,
            titleInfo: {
                text: labels.TraderPerformance
            }
        };
        var bodyData = [];
        var top10Col = '<span class="top10-link link">'+ labels.Top10ByMargin +'</span>';
        var bottom10Col = '<span class="bottom10-link link">'+labels.Bottom10ByMargin+'</span>';
        var row;
        if (data) {
            row = {
                    Columns: [{ Name: 'ColTraderType', Value: top10Col },
                              { Name: 'ColMinMargin', Value: data.TopMinMargin|| labels.NA },
                              { Name: 'ColMaxMargin', Value: data.TopMaxMargin|| labels.NA }]
                };
            bodyData.push(row);

            row = {
                    Columns: [{ Name: 'ColTraderType', Value: bottom10Col },
                              { Name: 'ColMinMargin', Value: data.BottomMinMargin|| labels.NA },
                              { Name: 'ColMaxMargin', Value: data.BottomMaxMargin|| labels.NA }]
                };
            bodyData.push(row);
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTraderGrid.fanexGrid(gridOptions);
    };

    // Render win league grid.
    var renderBetTypeGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.BetType, Width: 200, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat },
                      { HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                       FormatNumber: common.Formats.DecimalFormat }],
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
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divBetTypeGrid.fanexGrid(gridOptions);
    };

    var getAllReports = function() {
        getReportByType(urls.GetGeneralInfo, renderGeneralInfo);
        getReportByType(urls.GetTeamPerformance, renderTeamGrid);
        getReportByType(urls.GetTopWinLeague, renderWinLeagueGrid);
        getReportByType(urls.GetTopLoseLeague, renderLoseLeagueGrid);
        getReportByType(urls.GetBetTypePerformance, renderBetTypeGrid);
        getReportByType(urls.GetTraderPerformance, renderTraderGrid);
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };
};
