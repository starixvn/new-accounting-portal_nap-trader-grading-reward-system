/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, traderManagementService */
////'use strict';

$(function () {
    traderReports.Initialize();
});

var traderReports = (function ($) {
    var traderReports = {}

    var domElements = {
        divDateRange: null,
        btnSearch: null,
        txtTraderName: null,
        divGrid: null
    };

    var cachedData = [];

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divDateRange = $('#divDateRange');
        domElements.btnSearch = $('#btnSearch');
        domElements.ddlPeriodType = $('#ddlPeriodType');
        domElements.txtTraderName = $('#txtTraderName');
        domElements.divGrid = $("#resultContainer");
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

    var initPageFields = function () {
        //Date picker
        domElements.ddlPeriodType.val(1);
        initDatePicker();
        //btnSearch
        domElements.btnSearch.click(function () {
            var criteria = {
                TraderName: domElements.txtTraderName.val(),
                Fromdate: domElements.divDateRange.getFrom(),
                ToDate: domElements.divDateRange.getTo()
            };

            TraderReportService.GetTraderPerformance(criteria, function (data) {
                cachedData = data;
                renderTraderGrid(data);
            });
        });


        domElements.divGrid.on('click', ".sport-link", function () {
            var $this = $(this);

            var criteria = {
                TraderId: $this.attr("data-trader-id")
            }

            TraderReportService.GetSportsPerformance(criteria, function (data) {
                renderSportsGrid($this.attr("data-trader-name"), data);
            });
        });

        domElements.divGrid.on('click', '#trader-link', function () {
            renderTraderGrid(cachedData);
        });
    };

    function renderTraderGrid(data) {
        var sportLink = "<span class='sport-link link' data-trader-id='{1}' data-trader-name='{2}'>{0}</span>";

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colTraderName', Value: item.TraderName },
                    { Name: 'colTeam', Value: item.TeamName },
                    { Name: 'colGrade', Value: item.GradeName },
                    { Name: 'colPoint', Value: item.TotalPoint },
                    { Name: 'colMargin', Value: item.Margin },
                    { Name: 'colTurnover', Value: item.Turnover },
                    { Name: 'colWinloss', Value: item.WinLoss },
                    { Name: 'colSport', Value: sportLink.format(item.SportCount, item.TraderId, item.TraderName) },
                    { Name: 'colEvent', Value: item.EventProductCount }
                ]
            }
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Trader', Width: 100, Name: 'colTraderName', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Team ', Width: 100, Name: 'colTeam', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Grade', Width: 100, Name: 'colGrade', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V. Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Winloss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Sports', Width: 100, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 100,
            showTitle: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        $(".freegrid", domElements.divGrid).fanexGrid(options);
    }

    function renderSportsGrid(traderName, data) {
        var fallbackLink = '<span id="trader-link" class="breadcrumb-link">{0}</span><span> >> {1}</span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'colPoint', Value: item.TotalPoint },
                    { Name: 'colMargin', Value: item.Margin },
                    { Name: 'colTurnover', Value: item.Turnover },
                    { Name: 'colWinloss', Value: item.WinLoss },
                    { Name: 'colEvent', Value: item.EventProductCount }
                ]
            }
        };

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Sport', Width: 100, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'V. Total Point', Width: 100, Name: 'colPoint', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Margin', Width: 100, Name: 'colMargin', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Turnover', Width: 100, Name: 'colTurnover', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'V. Winloss', Width: 100, Name: 'colWinloss', HeaderAlign: 'center', CellAlign: 'right' },
                { HeaderText: 'Event Products', Width: 100, Name: 'colEvent', HeaderAlign: 'center', CellAlign: 'right' },
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            gridExpandHeight: 100,
            showTitle: true,
            titleInfo: {
                text: fallbackLink.format(labels.TraderPerformance, traderName)
            },
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        $(".freegrid", domElements.divGrid).fanexGrid(options);
    }

    traderReports.Initialize = function () {
        cacheDOMElements();

        initPageFields();

        //$("#txtUserName").keyup(function (e) {
        //    if (e.keyCode == 13) {
        //        $('#btnSearch').trigger("click");
        //    }
        //});

        //Load report for first time
        $('#btnSearch').click();
    };

    return traderReports;
})(jQuery);