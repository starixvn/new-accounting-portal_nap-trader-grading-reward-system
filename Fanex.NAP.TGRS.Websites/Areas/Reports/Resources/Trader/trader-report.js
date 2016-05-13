$(document).ready(function () {
    var TraderReport = new Fanex.TGRS.TraderReport.TraderReport();
    TraderReport.Initialize();
});

Namespace.Register("Fanex.TGRS.TraderReport");
Fanex.TGRS.TraderReport.TraderReport = function () {
    var $this = this;
    var domElements = {
        divDateRange: null,
        btnSearch: null,
        divGeneralInfo: null,
        divTopTrader: null,
        divBottomTrader: null
    };
    var filterParameters = {
        ReportType: null,
        FromDate: null,
        ToDate: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        // Use class selector for Sport and League to overcome the duplication issue caused by jquery.combobox.
        domElements.divDateRange = $('#divDateRange');
        domElements.divDatePair = $('#divDatePair');
        domElements.divFromMonthContainer = $('#divFromMonthContainer');
        domElements.divFromMonth = $('#divFromMonth');
        domElements.divToMonthContainer = $('#divToMonthContainer');
        domElements.divToMonth = $('#divToMonth');
        domElements.ddlYear = $('#ddlYear');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.divGeneralInfo = $('#divGeneralInfo');

        domElements.lblWinLoss = $("#lblWinLoss", domElements.divGeneralInfo);
        domElements.lblMargin = $("#lblMargin", domElements.divGeneralInfo);
        domElements.lblTurnOver = $("#lblTurnOver", domElements.divGeneralInfo);
        domElements.lblMatches = $("#lblMatches", domElements.divGeneralInfo);
        //domElements.divTopTrader = $('#divTopTrader');
        //domElements.divBottomTrader = $('#divBottomTrader');
        //domElements.divTeamGrid = $('#divTeamGrid');
        //domElements.divTraderPerformance = $('#divTraderPerformance');
        //domElements.divTopWinLeagueGrid = $('#divTopWinLeagueGrid');
        //domElements.divTopLoseLeagueGrid = $('#divTopLoseLeagueGrid');
        //domElements.divBetTypeGrid = $('#divBetTypeGrid');

        //domElements.top10MinMargin = $("#top10MinMargin", domElements.divTraderPerformance);
        //domElements.top10MaxMargin = $("#top10MaxMargin", domElements.divTraderPerformance);
        //domElements.bottom10MinMargin = $("#bottom10MinMargin", domElements.divTraderPerformance);
        //domElements.bottom10MaxMargin = $("#bottom10MaxMargin", domElements.divTraderPerformance);
    };

    var initDatePicker = function () {
        //Period date range control
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_3'
        });
    };

    function getReports() {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: "",
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


    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.on('click', function () {
            filterParameters.FromDate = domElements.divDateRange.getFrom();
            filterParameters.ToDate = domElements.divDateRange.getTo();
            filterParameters.ReportType = domElements.divDateRange.getPeriodType();
            getReports();
        });
    };

    var renderReports = function (data) {
        renderGeneralInfo(data.GeneralInfo);
        renderChart(data.WLTOByMonth);
        renderBetTypePerformance(data.BetTypePerformance);
        renderLeaguesPerformance(data.LeaguesPerformance);
    };

    var renderGeneralInfo = function (data) {
        domElements.divGeneralInfo.css({ display: "block" });
        domElements.lblWinLoss.text(numeral(data.Winlost).format(common.Formats.DecimalFormat));
        if (data.Margin != null) {
            domElements.lblMargin.text(numeral(data.Margin).format(common.Formats.DecimalFormat) + "%");
        }
        else {
            domElements.lblMargin.text(labels.NA);
        }
        domElements.lblTurnOver.text(numeral(data.Turnover).format(common.Formats.DecimalFormat));
        domElements.lblMatches.text(numeral(data.MatchCount).format(common.Formats.IntegerFormat));
    };

    var renderBetTypePerformance = function (data) {
        var gridOptions = {
            columns: [{ HeaderText: labels.League, Width: 350, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      {
                          HeaderText: labels.Turnover, Width: 150, Name: 'ColTurnOver', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      },
                      {
                          HeaderText: labels.WinLoss, Width: 150, Name: 'ColWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
                      },
                      {
                          HeaderText: labels.Margin, Width: 100, Name: 'ColMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat, FormatNegative: '$'
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
                              { Name: 'ColWinLoss', Value: item.Winloss },
                              { Name: 'ColMargin', Value: item.Margin }]
                };
                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divTopWinLeagueGrid.fanexGrid(gridOptions);
    };

    var renderBetTypePerformance = function (data) {
        //code here
    }

    $this.Initialize = function () {
        cacheDOMElements();
        initPageFields();
    };
}