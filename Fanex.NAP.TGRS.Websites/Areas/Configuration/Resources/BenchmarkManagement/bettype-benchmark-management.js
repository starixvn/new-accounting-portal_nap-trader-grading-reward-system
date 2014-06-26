/* File Created: May 14, 2014 */
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

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypeBMContent = domElements.divBetTypeBMContent || $('#divBetTypeBMContent');
        domElements.spanLeagueName = domElements.divBetTypeBMContent.find('#spanLeagueName');
        domElements.divBetTypeBMGridContainer = domElements.divBetTypeBMContent.find('#divBetTypeBMGridContainer');
        domElements.divBetTypeBMGrid = domElements.divBetTypeBMContent.find('#divBetTypeBMGrid');
        domElements.divPopupContent = $('#divPopupContent');
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
        var profitMarginFormat = '<span class="profit-margin link" data-bettype-id="{0}">{1}</span>';
        var benchmarkFormat = '<span class="benchmark-link link" data-bettype-id="{0}">{1}</span>' +
                              '<input type="text" maxlength="4" class="benchmark hide" />';
        var profitMarginCol = '';
        var benchmark = '';
        var benchmarkCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.BetType, Width: 300, Name: 'ColBetType', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.AvgProfitMargin, Width: 120, Name: 'ColProfitMargin', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Benchmark, Width: 100, Name: 'ColBenchmark', HeaderAlign: 'center', CellAlign: 'right'}],
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
                profitMarginCol = profitMarginFormat.format(item.BetTypeId, numeral(item.Margin).format(common.Formats.DecimalFormat));
                benchmark = numeral(item.Benchmark).format(common.Formats.DecimalFormat);
                benchmarkCol = hasEditRight ?
                               benchmarkFormat.format(item.BetTypeId, benchmark) :
                               benchmark;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColBetType', Value: item.BetTypeName, CssClass: 'bettype-name' },
                              { Name: 'ColProfitMargin', Value: profitMarginCol },
                              { Name: 'ColBenchmark', Value: benchmarkCol}]
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
                    if (updateBenchmark($link.attr('data-bettype-id'), benchmark.replace(/,/g, ''))) {
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

            betTypeName = betTypeName.length > 53 ? betTypeName.substring(0, 50) + '...' : betTypeName;
            getProfitMarginData(betTypeId, betTypeName);
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
            isValid = 0 <= value && value <= 1;
        }

        if (!isValid) {
            validator.ShowError($input, messages.InvalidValueError, 'e');
        }

        return isValid;
    };

    // Update benchmark.
    var updateBenchmark = function (betType, benchmark) {
        var updatingParameters = {
            LeagueId: parameters.LeagueId,
            BetType: betType,
            Benchmark: benchmark
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
    var getProfitMarginData = function (betType, betTypeName) {
        var profitMarginParameters = {
            LeagueId: parameters.LeagueId,
            BetType: betType
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
            columns: [{ HeaderText: labels.Year, Width: 150, Name: 'ColYear', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.ProfitMargin, Width: 250, Name: 'ColProfitMargin', HeaderAlign: 'center', CellAlign: 'right',
                          FormatNumber: common.Formats.DecimalFormat
                      }]
        };
        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColYear', Value: item.Year },
                              { Name: 'ColProfitMargin', Value: item.Margin}]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divProfitMargin = domElements.divPopup.find('#divProfitMargin');
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