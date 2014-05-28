/* File Created: May 12, 2014 */
/* global Namespace, common, labels, layout */
'use strict';

$(document).ready(function () {
    var PerformanceSummary = new Fanex.TGRS.PerformanceSummary();
    PerformanceSummary.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary = function () {
    var $this = this;
    var maxYearRange = 3;
    var urls = {
        GetGeneralInfo: common.ResolveRootUrl('PerformanceSummary/GetGeneralInfo'),
        GetTeamReport: common.ResolveRootUrl('PerformanceSummary/GetTeamPerformance')
    };
    var datePeriodType = {
        Date: 1,
        Month: 2,
        Year: 3
    };
    var domElements = {
        dpkFromDate: null,
        dpkToDate: null,
        ddlYear: null,
        btnSearch: null,
        dpkFromDateCalendar: null,
        dpkToDateCalendar: null,

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
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.dpkFromDate = $('#dpkFromDate');
        domElements.dpkToDate = $('#dpkToDate');
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

    var getAllReports = function() {
        getSummaryInfo();
        getTeamReport();
    };

    var getSummaryInfo = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetGeneralInfo,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderGeneralInfo(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };
    var getTeamReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTeamReport,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(filterParameters),
            success: function (result) {
                if (result) {
                    renderTeamGrid(result);
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };
    // Init page fields and events
    var initPageFields = function () {
        //Date picker
        initDatePicker(datePeriodType.Year);

        //btnSearch
        domElements.btnSearch.on('click', function () {
            setTimeout(function () {
                filterParameters.FromDate = domElements.dpkFromDate.nexDatePicker('getSingleDate');
                filterParameters.ToDate = domElements.dpkToDate.nexDatePicker('getSingleDate');
                filterParameters.ReportType = domElements.ddlPeriodType.val();
                getAllReports();
            }, 70);// Delay 70ms for jQuery-UI combo-box to verify its state.
        });
    };
    var initDatePicker = function(type) {
        var toDate = new Date();
        var maxDate = null;
        var defaultFromDate = null;
        var minDate = new Date(toDate.getFullYear() - maxYearRange, 0, 1);

        if (type === datePeriodType.Date) {
            //max date is yesterdate
            maxDate = new Date(toDate);
            maxDate.setDate(maxDate.getDate() - 1);
            //default date: 2 weeks after yesterday
            defaultFromDate = new Date(toDate);
            defaultFromDate.setDate(toDate.getDate() - 14);

            layout.CreateDatepicker(domElements.dpkFromDate, 'txtFromDate',
            "", 'col_1', defaultFromDate, minDate, maxDate, 'col_5');
            layout.CreateDatepicker(domElements.dpkToDate, 'txtToDate',
                "", 'col_1', maxDate, minDate, maxDate, 'col_5');
        }
        else if(type === datePeriodType.Month) {
            //max date: end of last month
            maxDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
            //default date: begin of last month
            defaultFromDate = new Date(toDate.getFullYear(), toDate.getMonth() - 1, 1);

            layout.CreateDatepickerMY(domElements.dpkFromDate, 'txtFromDate',
            "", 'col_1', defaultFromDate, minDate, maxDate, '');
            layout.CreateDatepickerMY(domElements.dpkToDate, 'txtToDate',
                "", 'col_1', maxDate, minDate, maxDate, '');
        }
        else if(type === datePeriodType.Year) {
            //max date: end of last month
            var maxYear = toDate.getFullYear();
            //default date: begin of last month
            var minYear = maxYear - maxYearRange;

            for (var i = minYear; i <= maxYear; i++) {
                domElements.ddlYear.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            domElements.ddlYear.show();
            domElements.dpkFromDate.hide();
            domElements.dpkToDate.hide();
        }
    };

    var renderGeneralInfo = function(data) {
        domElements.divGeneralInfo.css({display: "block"});
        domElements.lblWinLoss.text(data.Winlost);
        domElements.lblMargin.text(data.Margin);
        domElements.lblTurnOver.text(data.Turnover);
        domElements.lblMatches.text(data.MatchCount);
    };

    // Render team grid.
    var renderTeamGrid = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.Team, Width: 200, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Winloss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Margin, Width: 150, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 150
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

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };
};
