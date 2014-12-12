/* File Created: May 14, 2014 */
/*jshint camelcase: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, messages, hasEditRight */

'use strict';

Namespace.Register('Fanex.NAP.TGRS.BenchmarkManagement.BetTypeBenchmark');
Fanex.NAP.TGRS.BenchmarkManagement.BetTypeBenchmark = function () {
    var $this = this;
    var domElements = {
        divBetTypeBMContent: null,
        spanLeagueName: null,
        divBetTypeBMGridContainer: null,
        divBetTypeBMGrid: null,
        divPopupContent: null,
        divProfitMargin: null,
        divPopup: null
    };
    var urls = {
        GetBetTypeBenchmark: common.ResolveRootUrl('BenchmarkManagement/GetBetTypeBenchmark'),
        UpdateBetTypeBenchmark: common.ResolveRootUrl('BenchmarkManagement/UpdateBetTypeBenchmark'),
        GetBetTypeProfitMargin: common.ResolveRootUrl('BenchmarkManagement/GetBetTypeProfitMargin')
    };
    var parameters = {
        LeagueId: null
    };

    var profitMarginEnums = {
        profitMarginTwoYear: 2,
        profitMarginThreeYear: 3,
        profitMarginFourYear: 4
    };

    var benchMarkEnums = {
        afternoon: 1,
        night: 2,
        midnight: 3
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypeBMContent = domElements.divBetTypeBMContent || $('#divBetTypeBMContent');
        domElements.spanLeagueName = domElements.divBetTypeBMContent.find('#spanLeagueName');
        domElements.divBetTypeBMGridContainer = domElements.divBetTypeBMContent.find('#divBetTypeBMGridContainer');
        domElements.divBetTypeBMGrid = domElements.divBetTypeBMContent.find('#divBetTypeBMGrid');
        domElements.divPopupContent = $('#bettypeprofitMarginContent');
        domElements.divPopup = $('#divPopup');
    };

    // Bind event handlers.
    var bindEventHandlers = function () {
        // Hide instruction tipsy when clicking on document.
        $('html').off('mousedown').on('mousedown', function (event) {
            if (!$(event.target).hasClass('benchmark')) {
                domElements.divBetTypeBMGrid.find('input.benchmark').each(function () {
                    var $input = $(this);
                    var $link = $input.prev();

                    if (!$input.hasClass('hide')) {
                        $input.addClass('hide');
                        $link.removeClass('hide');
                        $input.tipsy('hide');
                    }
                });
            }
        });
    };

    // Get report data.
    var getReportData = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetTypeBenchmark,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    // Render grid.
    var renderGrid = function (data) {
        var profitMarginFormat = '<span class="profit-margin link" data-bettype-id="{0}" data-profit-margin-type="{1}">{2}</span>';
        var benchmarkFormat = '<span class="benchmark-link link" data-bettype-id="{0}" data-benchmark-type="{1}">{2}</span>' +
                              '<input type="text" maxlength="5" class="benchmark hide" />';
        var profitMarginCol2 = '';
        var profitMarginCol3 = '';
        var profitMarginCol4 = '';
        var benchmark1 = '';
        var benchmarkCol1 = '';
        var benchmark2 = '';
        var benchmarkCol2 = '';
        var benchmark3 = '';
        var benchmarkCol3 = '';

        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [{
                Columns: [
                    { HeaderText: labels.No, Name: "ColNo", MergeRowNumber: 2 },
                    { HeaderText: labels.BetType, Name: "ColBetType", MergeRowNumber: 2 },
                    { HeaderText: labels.ProfitMargin_2Years, Name: "ColProfitMargin_2Years", MergeRowNumber: 2 },
                    { HeaderText: labels.ProfitMargin_3Years, Name: "ColProfitMargin_3Years", MergeRowNumber: 2 },
                    { HeaderText: labels.ProfitMargin_4Years, Name: "ColProfitMargin_4Years", MergeRowNumber: 2 },
                    { HeaderText: labels.BetTypeBM, Name: "ColBettypeBenchmark", MergeColNumber: 3}]
            }],
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.BetType, Width: 300, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.ProfitMargin_2Years, Width: 120, Name: 'ColProfitMargin_2Years', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.ProfitMargin_3Years, Width: 120, Name: 'ColProfitMargin_3Years', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.ProfitMargin_4Years, Width: 120, Name: 'ColProfitMargin_4Years', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Afternoon, Width: 100, Name: 'ColBettypeBenchmark', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Night, Width: 100, Name: 'ColBenchmarkNight', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Midnight, Width: 100, Name: 'ColBenchmarkMidnight', HeaderAlign: 'center', CellAlign: 'right'}],
            gridExpandHeight: 120,
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges,
                afterPagedFunction: handleGridEvents
            }
        };
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                profitMarginCol2 = profitMarginFormat.format(item.BetTypeId, profitMarginEnums.profitMarginTwoYear,
                 numeral(item.Margin2).format(common.Formats.DecimalFormat));
                profitMarginCol3 = profitMarginFormat.format(item.BetTypeId, profitMarginEnums.profitMarginThreeYear,
                 numeral(item.Margin3).format(common.Formats.DecimalFormat));
                profitMarginCol4 = profitMarginFormat.format(item.BetTypeId, profitMarginEnums.profitMarginFourYear,
                 numeral(item.Margin4).format(common.Formats.DecimalFormat));
                benchmark1 = numeral(item.BenchMarkShift1).format(common.Formats.DecimalFormat);
                benchmarkCol1 = hasEditRight ?
                               benchmarkFormat.format(item.BetTypeId, benchMarkEnums.afternoon, benchmark1) :
                               benchmark1;
                benchmark2 = numeral(item.BenchMarkShift2).format(common.Formats.DecimalFormat);
                benchmarkCol2 = hasEditRight ?
                               benchmarkFormat.format(item.BetTypeId, benchMarkEnums.night, benchmark2) :
                               benchmark2;
                benchmark3 = numeral(item.BenchMarkShift3).format(common.Formats.DecimalFormat);
                benchmarkCol3 = hasEditRight ?
                               benchmarkFormat.format(item.BetTypeId, benchMarkEnums.midnight, benchmark3) :
                               benchmark3;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColBetType', Value: item.BetTypeName, CssClass: 'bettype-name' },
                              { Name: 'ColProfitMargin_2Years', Value: profitMarginCol2 },
                              { Name: 'ColProfitMargin_3Years', Value: profitMarginCol3 },
                              { Name: 'ColProfitMargin_4Years', Value: profitMarginCol4 },
                              { Name: 'ColBettypeBenchmark', Value: benchmarkCol1 },
                              { Name: 'ColBenchmarkNight', Value: benchmarkCol2 },
                              { Name: 'ColBenchmarkMidnight', Value: benchmarkCol3}]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divBetTypeBMGrid.fanexGrid(gridOptions);
        handleGridEvents();
    };

    // Handle grid's events.
    var handleGridEvents = function () {
        var benchmarkLinks = domElements.divBetTypeBMGrid.find('span.benchmark-link');
        var benchmarkInputs = domElements.divBetTypeBMGrid.find('input.benchmark');

        // Format the benchmark value which is input into the text box.
        benchmarkInputs.numberField(2, false);

        // When user clicks on benchmark link.
        benchmarkLinks.on('click', function () {
            var $link = $(this);
            var $input = $link.next();
            var benchmark = $link.text();

            // Disable other active fields.
            $.each(benchmarkLinks, function (index, link) {
                $(link).removeClass('hide').next().addClass('hide').tipsy('hide');
            });

            // Fill current value into text box.
            $link.addClass('hide');
            $input.val(benchmark).removeClass('hide').focus().select();
        });

        // Handle key up event.
        benchmarkInputs.on('keyup', function (event) {
            var $input = $(this);
            var $link = $input.prev();
            var benchmark = $input.val();
            var betTypeName = '';

            if (event.keyCode === 13 && validateBenchmark($input)) {
                betTypeName = $link.closest('tr').find('div.bettype-name').text();
                betTypeName = betTypeName.length > 53 ? betTypeName.substring(0, 50) + '...' : betTypeName;

                common.ShowConfirmMessage(messages.UpdateBenchmarkConfirmMessage.format('<b>' + betTypeName + '</b>'), function () {
                    if (updateBenchmark($link.attr('data-bettype-id'), benchmark.replace(/,/g, ''), $link.attr('data-benchmark-type'))) {
                        $link.text(benchmark);
                        $input.addClass('hide');
                        $link.removeClass('hide');
                        $input.tipsy('hide');
                    }
                });
            } else if (event.keyCode === 27) {
                $input.addClass('hide');
                $link.removeClass('hide');
                $input.tipsy('hide');
            }
        });

        domElements.divBetTypeBMGrid.find('span.profit-margin').on('click', function () {
            var $link = $(this);
            var betTypeId = $link.attr('data-bettype-id');
            var betTypeName = $link.closest('tr').find('div.bettype-name').text();
            var profitMarginType = $link.attr('data-profit-margin-type');

            betTypeName = betTypeName.length > 53 ? betTypeName.substring(0, 50) + '...' : betTypeName;
            getProfitMarginData(betTypeId, betTypeName, profitMarginType);
        });

        // Hide tooltip.
        domElements.divBetTypeBMGrid.find('div.grid-container').on('scroll', function () {
            var $input = domElements.divBetTypeBMGrid.find('input:focus');

            if ($input.hasClass('benchmark')) {
                $input.tipsy('hide');
            }
        });
    };

    // Validate input benchmark.
    var validateBenchmark = function ($input) {
        var value = $input.val().replace(/,/g, '');
        var isValid = $.isNumeric(value);

        if (isValid) {
            value = parseFloat(value);
            isValid = 0 <= value && value <= 100;
        }

        if (!isValid) {
            validator.ShowError($input, messages.InvalidValueError, 'e');
        }

        return isValid;
    };

    // Update benchmark.
    var updateBenchmark = function (betType, benchmark, benchmarkType) {
        var updatingParameters = {
            LeagueId: parameters.LeagueId,
            BetType: betType,
            Benchmark: benchmark,
            WorkShift: benchmarkType
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateBetTypeBenchmark,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(updatingParameters),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInfoMessage(messages.UpdateBenchmarkSuccessfully);
                    renderGrid(result.Benchmarks);

                    return true;
                } else {
                    common.ShowErrorMessage(result.ErrorMessage);

                    return false;
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

    // Get profit margin data.
    var getProfitMarginData = function (betType, betTypeName, profitMarginType) {
        var profitMarginParameters = {
            LeagueId: parameters.LeagueId,
            BetType: betType,
            MarginType: profitMarginType
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetTypeProfitMargin,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(profitMarginParameters),
            success: function (result) {
                common.Popup(betTypeName, domElements.divPopupContent);
                renderProfitMarginGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };


    // Render profit margin grid.
    var renderProfitMarginGrid = function (data) {
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: [{
                Columns: [
                    { HeaderText: labels.Year, Name: "ColYear", MergeRowNumber: 2 },
                    { HeaderText: labels.Afternoon_Shift, Name: "ColAfternoon_Shift_WinLoss", MergeColNumber: 3 },
                    { HeaderText: labels.Night_Shift, Name: "ColNight_Shift_WinLoss", MergeColNumber: 3 },
                    { HeaderText: labels.Midnight_Shift, Name: "ColMidnight_Shift_WinLoss", MergeColNumber: 3 },
                    { HeaderText: labels.Total, Name: "ColTotalWinLoss", MergeColNumber: 3}]
            }],
            columns: [
                        { HeaderText: labels.Year, Width: 100, Name: 'ColYear', HeaderAlign: 'center', CellAlign: 'center' },
                        { HeaderText: labels.Win_Loss, Width: 120, Name: 'ColAfternoon_Shift_WinLoss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Turnover, Width: 120, Name: 'ColAfternoon_Shift_Turnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.ProfitMargin, Width: 120, Name: 'ColAfternoon_Shift_ProfitMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Win_Loss, Width: 120, Name: 'ColNight_Shift_WinLoss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Turnover, Width: 120, Name: 'ColNight_Shift_Turnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.ProfitMargin, Width: 120, Name: 'ColNight_Shift_ProfitMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Win_Loss, Width: 120, Name: 'ColMidnight_Shift_WinLoss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Turnover, Width: 120, Name: 'ColMidnight_Shift_Turnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.ProfitMargin, Width: 120, Name: 'ColMidnight_Shift_ProfitMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Win_Loss, Width: 120, Name: 'ColTotalWinLoss', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.Turnover, Width: 120, Name: 'ColTotalTurnover', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        },
                        { HeaderText: labels.ProfitMargin, Width: 120, Name: 'ColTotalProfitMargin', HeaderAlign: 'center', CellAlign: 'right',
                            FormatNumber: common.Formats.DecimalFormat
                        }]
        };
        var bodyData = [];
        var row;

        if (data && data.ReportRows.length > 0) {
            $.each(data.ReportRows, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColYear', Value: item.Year },
                              { Name: 'ColAfternoon_Shift_WinLoss', Value: item.ReportRows[0].WinLoss },
                              { Name: 'ColAfternoon_Shift_Turnover', Value: item.ReportRows[0].Stake },
                              { Name: 'ColAfternoon_Shift_ProfitMargin', Value: item.ReportRows[0].Margin },
                              { Name: 'ColNight_Shift_WinLoss', Value: item.ReportRows[1].WinLoss },
                              { Name: 'ColNight_Shift_Turnover', Value: item.ReportRows[1].Stake },
                              { Name: 'ColNight_Shift_ProfitMargin', Value: item.ReportRows[1].Margin },
                              { Name: 'ColMidnight_Shift_WinLoss', Value: item.ReportRows[2].WinLoss },
                              { Name: 'ColMidnight_Shift_Turnover', Value: item.ReportRows[2].Stake },
                              { Name: 'ColMidnight_Shift_ProfitMargin', Value: item.ReportRows[2].Margin },
                              { Name: 'ColTotalWinLoss', Value: item.ReportRows[3].WinLoss },
                              { Name: 'ColTotalTurnover', Value: item.ReportRows[3].Stake },
                              { Name: 'ColTotalProfitMargin', Value: item.ReportRows[3].Margin}]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divProfitMargin = domElements.divPopup.find('#bettypeprofitMarginContent');
        domElements.divProfitMargin.fanexGrid(gridOptions);
    };

    $this.InitPage = function (divContent, leagueId, leagueName) {
        domElements.divBetTypeBMContent = divContent;
        cacheDOMElements();
        domElements.divBetTypeBMGridContainer.addClass('display-none');
        domElements.spanLeagueName.text(leagueName);
        parameters.LeagueId = leagueId;
        bindEventHandlers();
        getReportData();
    };
};