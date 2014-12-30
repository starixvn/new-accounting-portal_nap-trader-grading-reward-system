/* File Created: May 14, 2014 */
/*jshint strict: false*/
/* global Namespace, numeral, Fanex, common, validator, labels, messages, hasEditRight */

////'use strict';

Namespace.Register('Fanex.NAP.TGRS.BenchmarkManagement.TeamBenchmark');
Fanex.NAP.TGRS.BenchmarkManagement.TeamBenchmark = function () {
    var $this = this;
    var domElements = {
        divTeamBMContent: null,
        divTeamBMGridContainer: null,
        divTeamBMGrid: null,
        divPopupContent: null,
        divProfitMargin: null,
        divPopup: null
    };
    var urls = {
        GetTeamBenchmark: common.ResolveRootUrl('BenchmarkManagement/GetTeamBenchmark'),
        UpdateTeamBenchmark: common.ResolveRootUrl('BenchmarkManagement/UpdateTeamBenchmark'),
        GetTeamProfitMargin: common.ResolveRootUrl('BenchmarkManagement/GetTeamProfitMargin')
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTeamBMContent = domElements.divTeamBMContent || $('#divTeamBMContent');
        domElements.divTeamBMGridContainer = domElements.divTeamBMContent.find('#divTeamBMGridContainer');
        domElements.divTeamBMGrid = domElements.divTeamBMContent.find('#divTeamBMGrid');
        domElements.divPopupContent = $('#divProfitMargin');
        domElements.divPopup = $('#divPopup');
    };

    // Bind event handlers.
    var bindEventHandlers = function () {
        // Hide instruction tipsy when clicking on document.
        $('html').off('mousedown').on('mousedown', function (event) {
            if (!$(event.target).hasClass('benchmark')) {
                domElements.divTeamBMGrid.find('input.benchmark').each(function () {
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
            url: urls.GetTeamBenchmark,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
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
        var profitMarginFormat = '<span class="profit-margin link" data-team-id="{0}">{1}</span>';
        var benchmarkFormat = '<span class="benchmark-link link" data-team-id="{0}">{1}</span>' +
                              '<input type="text" maxlength="5" class="benchmark hide" />';
        var profitMarginCol = '';
        var benchmark = '';
        var benchmarkCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.TeamName, Width: 350, Name: 'ColTeamName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.ProfitMargin, Width: 120, Name: 'ColProfitMargin', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Benchmark, Width: 100, Name: 'ColBenchmark', HeaderAlign: 'center', CellAlign: 'right'}],
            gridExpandHeight: 100,
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
                profitMarginCol = profitMarginFormat.format(item.TeamId, numeral(item.Margin).format(common.Formats.DecimalFormat));
                benchmark = numeral(item.Benchmark).format(common.Formats.DecimalFormat);
                benchmarkCol = hasEditRight ?
                               benchmarkFormat.format(item.TeamId, benchmark) :
                               benchmark;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index + 1 },
                              { Name: 'ColTeamName', Value: item.TeamName, CssClass: 'team-name' },
                              { Name: 'ColProfitMargin', Value: profitMarginCol },
                              { Name: 'ColBenchmark', Value: benchmarkCol}]
                };

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divTeamBMGrid.fanexGrid(gridOptions);
        handleGridEvents();
    };

    // Handle grid's events.
    var handleGridEvents = function () {
        var benchmarkLinks = domElements.divTeamBMGrid.find('span.benchmark-link');
        var benchmarkInputs = domElements.divTeamBMGrid.find('input.benchmark');

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
            var teamName = '';

            if (event.keyCode === 13 && validateBenchmark($input)) {
                teamName = $link.closest('tr').find('div.team-name').text();
                teamName = teamName.length > 53 ? teamName.substring(0, 50) + '...' : teamName;

                common.ShowConfirmMessage(messages.UpdateBenchmarkConfirmMessage.format('<b>' + teamName + '</b>'), function () {
                    if (updateBenchmark($link.attr('data-team-id'), benchmark.replace(/,/g, ''))) {
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

        domElements.divTeamBMGrid.find('span.profit-margin').on('click', function () {
            var $link = $(this);
            var teamId = $link.attr('data-team-id');
            var teamName = $link.closest('tr').find('div.team-name').text();

            teamName = teamName.length > 53 ? teamName.substring(0, 50) + '...' : teamName;
            getProfitMarginData(teamId, teamName);
        });

        // Hide tooltip.
        domElements.divTeamBMGrid.find('div.grid-container').on('scroll', function () {
            var $input = domElements.divTeamBMGrid.find('input:focus');

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
    var updateBenchmark = function (teamId, benchmark) {
        var updatingParameters = {
            TeamId: teamId,
            Benchmark: benchmark
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateTeamBenchmark,
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
    var getProfitMarginData = function (teamId, teamName) {
        if ($('#divPopupContent').children().length === 0) {
            $('#divPopupContent').append('<div id="divProfitMargin" class="freegrid profit-margin-popup"></div>');
            domElements.divPopupContent = $('#divProfitMargin');
        }
        var profitMarginParameters = {
            TeamId: teamId
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetTeamProfitMargin,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(profitMarginParameters),
            success: function (result) {
                common.Popup(teamName, domElements.divPopupContent);
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

    $this.InitPage = function (divContent) {
        domElements.divTeamBMContent = divContent;
        cacheDOMElements();
        domElements.divTeamBMGridContainer.addClass('display-none');
        bindEventHandlers();
        getReportData();
    };
};