/* File Created: May 14, 2014 */
/* global Namespace, numeral, Fanex, common, validator, labels, messages, hasEditRight */

Namespace.Register('Fanex.NAP.TGRS.BenchmarkManagement.LeaguePage');
Fanex.NAP.TGRS.BenchmarkManagement.LeagueBenchmark = function () {
    'use strict';

    var $this = this;
    var domElements = {
        divLeagueBMContent: null,
        divLeagueBMFilter: null,
        ddlSport: null,
        ddlSpecialLeague: null,
        txtLeague: null,
        ddlCountry: null,
        ddlMarket: null,
        btnSearch: null,
        divLeagueBMGridContainer: null,
        divLeagueBMGrid: null
    };
    var urls = {
        GetLeagueBenchmark: common.ResolveRootUrl('BenchmarkManagement/GetLeagueBenchmark')
    };
    var parameters = {
        SportType: null,
        ProgramId: null,
        DisplayMode: null,
        CountryCode: null,
        AllMarket: null,
        LeagueName: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divLeagueBMContent = domElements.divLeagueBMContent || $('#divLeagueBMContent');
        domElements.divLeagueBMFilter = domElements.divLeagueBMContent.find('#divLeagueBMFilter');
        domElements.ddlSport = domElements.divLeagueBMContent.find('#ddlSport');
        domElements.ddlSpecialLeague = domElements.divLeagueBMContent.find('#ddlSpecialLeague');
        domElements.txtLeague = domElements.divLeagueBMContent.find('#txtLeague');
        domElements.ddlCountry = domElements.divLeagueBMContent.find('#ddlCountry');
        domElements.ddlMarket = domElements.divLeagueBMContent.find('#ddlMarket');
        domElements.btnSearch = domElements.divLeagueBMContent.find('#btnSearch');
        domElements.divLeagueBMGridContainer = domElements.divLeagueBMContent.find('#divLeagueBMGridContainer');
        domElements.divLeagueBMGrid = domElements.divLeagueBMContent.find('#divLeagueBMGrid');
    };

    // Bind event handlers.
    var bindEventHandlers = function () {
        domElements.txtLeague.off('keyup').on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });

        domElements.btnSearch.off('click').on('click', function () {
            var specialLeagueValues = domElements.ddlSpecialLeague.val().split(';');
            var displayMode = 0;
            var programId = '';

            if (specialLeagueValues.length > 1) {
                displayMode = specialLeagueValues[0];
                programId = specialLeagueValues[1];
            }

            if (validator.CountErrors(domElements.divLeagueBMFilter) === 0) {
                parameters.SportType = domElements.ddlSport.val();
                parameters.CountryCode = domElements.ddlCountry.val();
                parameters.CountryCode = parameters.CountryCode === 'null' ? '' : parameters.CountryCode;
                parameters.AllMarket = domElements.ddlMarket.val();
                parameters.LeagueName = $.trim(domElements.txtLeague.val());
                parameters.DisplayMode = displayMode;
                parameters.ProgramId = programId;
                domElements.txtLeague.val(parameters.LeagueName);

                getReportData();
            }
        });
    };

    // Get report data.
    var getReportData = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetLeagueBenchmark,
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
        var profitMarginFormat = '<span class="profit-margin link" data-league-id="{0}">{1}</span>';
        var benchmarkFormat = '<span class="benchmark-link link" data-league-id="{0}" data-value="{1}">{2}</span>' +
                               '<input type="text" maxlength="4" class="benchmark hide" />';
        var configurationFormat = '<a href="#" class="configuration green-button" data-league-id="{0}">{1}</a>';
        var profitMarginCol = '';
        var benchmark = '';
        var benchmarkCol = '';
        var configurationCol = '';

        var gridOptions = {
            columns: [{ HeaderText: labels.No, Width: 70, Name: 'ColNo', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: labels.LeagueName, Width: 450, Name: 'ColLeagueName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: labels.ProfitMargin, Width: 100, Name: 'ColProfitMargin', HeaderAlign: 'center', CellAlign: 'right' },
                      { HeaderText: labels.Benchmark, Width: 100, Name: 'ColBenchmark', HeaderAlign: 'center', CellAlign: 'right'}],
            gridExpandHeight: 220,
            showNumberColumn: true,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };
        var bodyData = [];
        var row;

        if (hasEditRight) {
            gridOptions.columns.push({ HeaderText: labels.BetTypeBM, Width: 100, Name: 'ColBetTypeBM', HeaderAlign: 'center', CellAlign: 'center' });
        }

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                profitMarginCol = profitMarginFormat.format(item.LeagueId, numeral(item.Margin).format(common.Formats.DecimalFormat));
                benchmark = numeral(item.Benchmark).format(common.Formats.DecimalFormat);
                benchmarkCol = hasEditRight ?
                               benchmarkFormat.format(item.LeagueId, item.Benchmark, benchmark) :
                               benchmark;

                row = {
                    Columns: [{ Name: 'ColNo', Value: index },
                              { Name: 'ColLeagueName', Value: item.LeagueName },
                              { Name: 'ColProfitMargin', Value: profitMarginCol },
                              { Name: 'ColBenchmark', Value: benchmarkCol}]
                };

                if (hasEditRight) {
                    configurationCol = configurationFormat.format(item.LeagueId, labels.Configure);
                    row.Columns.push({ Name: 'ColBetTypeBM', Value: configurationCol });
                }

                bodyData.push(row);
            });
        }

        gridOptions.bodyRows = bodyData;
        domElements.divLeagueBMGrid.fanexGrid(gridOptions);
        handleGridEvents();
    };

    // Handle grid's events.
    var handleGridEvents = function () {
        var benchmarkLinks = domElements.divLeagueBMGrid.find('span.benchmark-link');
        var benchmarkInputs = domElements.divLeagueBMGrid.find('input.benchmark');

        // Format the benchmark value which is input into the text box.
        benchmarkInputs.numberField(2, false);

        // When user clicks on benchmark link.
        benchmarkLinks.on('click', function () {
            var $link = $(this);
            var $input = $link.next();
            var benchmark = $link.attr('data-value');

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

            if (event.keyCode === 13 && validateBenchmark($input)) {
                common.ShowConfirmMessage(messages.UpdateBenchmarkConfirmMessage, function () {
                    if (updateBenchmark($link.attr('data-league-id'), benchmark.replace(/,/g, ''))) {
                        $link.attr('data-value', benchmark);
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

        domElements.divLeagueBMGrid.find('span.configuration').on('click', function () {
            // @@TODO: Redirect to BetTypeConfiguration
        });

        // Hide tooltip.
        domElements.divLeagueBMGrid.find('div.grid-container').on('scroll', function () {
            var $input = domElements.divLeagueBMGrid.find('input:focus');

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
            value = parseInt(value);
            isValid = 0 <= value && value <= 1;
        }

        if (!isValid) {
            validator.ShowError($input, messages.InvalidValueError, 'e');
        }

        return isValid;
    };

    // Update benchmark.
    var updateBenchmark = function (leagueId, benchmark) {
    };

    // Reset filter data
    var resetFilterData = function () {
        validator.ClearErrors(domElements.divLeagueBMFilter);
        domElements.divLeagueBMGridContainer.addClass('display-none');
    };

    $this.InitPage = function (divContent) {
        domElements.divLeagueBMContent = divContent;
        cacheDOMElements();
        resetFilterData();
        bindEventHandlers();
    };
};