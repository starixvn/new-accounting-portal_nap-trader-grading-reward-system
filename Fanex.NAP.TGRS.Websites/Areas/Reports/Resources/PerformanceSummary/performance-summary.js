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
        txtFromDate: null,
        dpkToDate: null,
        txtToDate: null,
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
    };
    var filterParameters = {
        RptType: null,
        fromDate: null,
        toDate: null
    };
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.dpkFromDate = $('#dpkFromDate');
        domElements.txtFromDate = $('#txtFromDate');
        domElements.dpkToDate = $('#dpkToDate');
        domElements.txtToDate = $('#txtToDate');
        domElements.btnSearch = $('#btnSearch');
        domElements.divGeneralInfo = $('#divGeneralInfo');

        domElements.divTeamGrid = $('#divTeamGrid');
        domElements.divTraderGrid = $('#divTraderGrid');
        domElements.divTopWinLeagueGrid = $('#divTopWinLeagueGrid');
        domElements.divTopLoseLeagueGrid = $('#divTopLoseLeagueGrid');
        domElements.divBetTypeGrid = $('#divBetTypeGrid');

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
        var toDate = new Date();
        var maxDate = new Date(toDate);
        maxDate.setDate(maxDate.getDate() - 1);
        var minDate = new Date(toDate);
        minDate.setDate(minDate.getDate() - 15);
        initDatePicker(datePeriodType.Date, minDate, maxDate);

        //btnSearch
        domElements.btnSearch.on('click', function () {
            setTimeout(function () {
                filterParameters.fromDate = domElements.dpkFromDate.nexDatePicker('getSingleDate');
                filterParameters.toDate = domElements.dpkToDate.nexDatePicker('getSingleDate');
                filterParameters.RptType = 1;
                getAllReports();
            }, 70);// Delay 70ms for jQuery-UI combo-box to verify its state.
        });
    };
    var initDatePicker = function(type, minDate, maxDate) {
        if (type === datePeriodType.Date) {
            layout.CreateDatepicker(domElements.dpkFromDate, 'txtFromDate',
            "", 'col_1', minDate, minDate, maxDate, 'col_5');
            layout.CreateDatepicker(domElements.dpkToDate, 'txtToDate',
                "", 'col_1', maxDate, minDate, maxDate, 'col_5');
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
