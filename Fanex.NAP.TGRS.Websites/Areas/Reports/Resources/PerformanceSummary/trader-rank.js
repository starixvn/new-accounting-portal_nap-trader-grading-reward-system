/* File Created: May 12, 2014 */
/* global Namespace, common, labels, filterParameters */
'use strict';

$(document).ready(function () {
    var TraderRank = new Fanex.TGRS.PerformanceSummary.TraderRank();
    TraderRank.Initialize();
});

Namespace.Register("Fanex.TGRS.PerformanceSummary");
Fanex.TGRS.PerformanceSummary.TraderRank = function () {
    var $this = this;
    var urls = {
        GetTraderRankData: common.ResolveRootUrl('Reports/PerformanceSummary/GetTraderRankData'),
        GetGradeHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetGradeHistory'),
        GetTeamHistory: common.ResolveRootUrl('Reports/PerformanceSummary/GetTeamHistory')
    };
    var domElements = {
        ddlType: null,
        divRankGrid: null,
        divHistoryGrid: null,
        divHistoryDetailGrid: null,
        divHistoryForm: null,
    };

    var popupElements = {
        divHistoryGrid: null,
        lblTraderName: null,
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.ddlType = $('#ddlType');
        domElements.divRankGrid = $('#divRankGrid');
        domElements.divHistoryForm = $('#divHistoryForm').clone();
        $('#divHiddenForm').empty();
    };

    var cachePopupElements = function () {
        popupElements.divHistoryDetailGrid = $("#divHistoryDetailGrid", domElements.divPopup);
        popupElements.divHistoryGrid = $("#divHistoryGrid", domElements.divPopup);
        popupElements.lblTraderName = $("#lblTraderName", domElements.divPopup);
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
        //btnSearch
        domElements.ddlType.on('change', function () {
            var selectType = $("option:selected", this).val() * 1;
            filterParameters.Top = selectType;
            getReports();
        });

        //team history icon click
        domElements.divRankGrid.on('click', 'span.view-teamHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            makeTeamHistoryForm(custId, userName);
        });

        //grade history icon click
        domElements.divRankGrid.on('click', 'span.view-gradeHistory-link', function () {
            var $obj = $(this);
            var custId = $obj.attr('data-cust-id');
            var userName = $obj.attr('data-username');
            makeGradeHistoryForm(custId, userName);
        });
    };

    // Render rank grid.
    var renderRankGrid = function (data) {
        var teamDateColFormat = '<span class="view-teamHistory-link link" data-cust-id="{0}" data-username="{1}">{2}</span>';
        var gradeDateColFormat = '<span class="view-gradeHistory-link link" data-cust-id="{0}" data-username="{1}">{2}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 80, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.Trader, Width: 150, Name: 'ColTrader', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Team, Width: 180, Name: 'ColTeam', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.Grade, Width: 100, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.NoOfMatches, Width: 100, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.IntegerFormat
                      },
                      { HeaderText: labels.Turnover, Width: 100, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Winloss, Width: 100, Name: 'ColWinloss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }],
            gridExpandHeight: 150
        };
        var bodyData = [];
        var row;
        var TeamDateCol = "";
        var GradeDateCol = "";
        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                TeamDateCol = teamDateColFormat.format(item.CustId, item.UserName, item.TeamName);
                GradeDateCol = gradeDateColFormat.format(item.CustId, item.UserName, item.Grade);
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                              { Name: 'ColTrader', Value: item.UserName },
                              { Name: 'ColTeam', Value: TeamDateCol },
                              { Name: 'ColGrade', Value: GradeDateCol },
                              { Name: 'ColNoOfMatches', Value: item.MatchCount },
                              { Name: 'ColTurnover', Value: item.Turnover },
                              { Name: 'ColWinloss', Value: item.Winlost },
                              { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divRankGrid.fanexGrid(gridOptions);
    };

    // Display new Trader form.
    var makeTeamHistoryForm = function (custId, userName) {
        var form = domElements.divHistoryForm.clone();

        common.DisableInput();
        var param = {
            CustId: custId,
            FromDate: filterParameters.FromDate,
            ToDate: filterParameters.ToDate
        };
        $.ajax({
            type: 'POST',
            url: urls.GetTeamHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function (result) {
                if (result) {
                    common.Popup(labels.TeamHistory, form);
                    cachePopupElements();
                    popupElements.lblTraderName.text(userName);
                    renderTeamHistoryGrid(result);
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

    // Display new Trader form.
    var makeGradeHistoryForm = function (custId, userName) {
        var form = domElements.divHistoryForm.clone();

        common.DisableInput();
        var param = {
            CustId: custId,
            FromDate: filterParameters.FromDate,
            ToDate: filterParameters.ToDate
        };
        $.ajax({
            type: 'POST',
            url: urls.GetGradeHistory,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function (result) {
                if (result) {
                    common.Popup(labels.GradeHistory, form);
                    cachePopupElements();
                    popupElements.lblTraderName.text(userName);
                    renderGradeHistoryGrid(result);
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

    var renderTeamHistoryGrid = function (data) {
        //general
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.NewTeam, Width: 130, Name: 'ColTeamName', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: labels.EffectiveDate, Width: 100, Name: 'ColEffectiveDate', HeaderAlign: 'center', CellAlign: 'center'}],
            showNumberColumn: true,
            gridExpandHeight: 150,
            showTitle: true,
            titleInfo: {
                text: labels.TeamHistory
            }
        };
        var bodyData = [];
        var row;
        if (data.TeamHistoryGeneral && data.TeamHistoryGeneral.length > 0) {
            $.each(data.TeamHistoryGeneral, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColTeamName', Value: item.TeamName },
                                { Name: 'ColEffectiveDate', Value: item.EffectiveDate}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divHistoryGrid.fanexGrid(gridOptions);

        //detail
        gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.Team, Width: 130, Name: 'ColTeamName', HeaderAlign: 'center', CellAlign: 'left' },
                        { HeaderText: labels.NoOfMatches, Width: 130, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.IntegerFormat },
                        { HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat },
                        { HeaderText: labels.Winloss, Width: 130, Name: 'ColWinloss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat },
                        { HeaderText: labels.BetCount, Width: 130, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.IntegerFormat },
                        { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat}],
            showNumberColumn: true,
            gridExpandHeight: 150
        };

        bodyData = [];
        row = null;
        if (data.TeamHistoryDetail && data.TeamHistoryDetail.length > 0) {
            $.each(data.TeamHistoryDetail, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColTeamName', Value: item.TeamName },
                                { Name: 'ColNoOfMatches', Value: item.MatchCount },
                                { Name: 'ColTurnover', Value: item.Turnover },
                                { Name: 'ColWinloss', Value: item.WinLost },
                                { Name: 'ColBetCount', Value: item.BetCount },
                                { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divHistoryDetailGrid.fanexGrid(gridOptions);
    };

    var renderGradeHistoryGrid = function (data) {
        //general
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.NewGrade, Width: 130, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right' },
                        { HeaderText: labels.EffectiveDate, Width: 100, Name: 'ColEffectiveDate', HeaderAlign: 'center', CellAlign: 'center'}],
            showNumberColumn: true,
            gridExpandHeight: 150,
            showTitle: true,
            titleInfo: {
                text: labels.GradeHistory
            }
        };
        var bodyData = [];
        var row;
        if (data.GradeHistoryGeneral && data.GradeHistoryGeneral.length > 0) {
            $.each(data.GradeHistoryGeneral, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColGrade', Value: item.Grade },
                                { Name: 'ColEffectiveDate', Value: item.EffectiveDate}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divHistoryGrid.fanexGrid(gridOptions);

        //detail
        gridOptions = {
            columns: [{ HeaderText: '#', Width: 70, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.Grade, Width: 130, Name: 'ColGrade', HeaderAlign: 'center', CellAlign: 'right' },
                        { HeaderText: labels.NoOfMatches, Width: 130, Name: 'ColNoOfMatches', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.IntegerFormat },
                        { HeaderText: labels.Turnover, Width: 130, Name: 'ColTurnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat },
                        { HeaderText: labels.Winloss, Width: 130, Name: 'ColWinloss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat },
                        { HeaderText: labels.BetCount, Width: 130, Name: 'ColBetCount', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.IntegerFormat },
                        { HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat}],
            showNumberColumn: true,
            gridExpandHeight: 150
        };

        bodyData = [];
        row = null;
        if (data.GradeHistoryDetail && data.GradeHistoryDetail.length > 0) {
            $.each(data.GradeHistoryDetail, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index },
                                { Name: 'ColGrade', Value: item.Grade },
                                { Name: 'ColNoOfMatches', Value: item.MatchCount },
                                { Name: 'ColTurnover', Value: item.Turnover },
                                { Name: 'ColWinloss', Value: item.WinLost },
                                { Name: 'ColBetCount', Value: item.BetCount },
                                { Name: 'ColMargin', Value: item.Margin || labels.NA}]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        popupElements.divHistoryDetailGrid.fanexGrid(gridOptions);
    };

    var getReports = function () {
        getReportByType(urls.GetTraderRankData, renderRankGrid);
    };

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
        getReports();
    };
};
