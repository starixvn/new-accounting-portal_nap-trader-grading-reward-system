/* File Created: May 14, 2014 */
/* global Namespace, numeral, Fanex, CMS, Validator, labels, messages, hasEditRight */

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
        GetInitializedLeagueData: common.ResolveRootUrl('ConfigureTOByEvent/GetInitializedLeagueData')
    };
    var parameters = {
        SportID: null,
        ProgramID: null,
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
        Validator.clearErrors(domElements.divLeagueForm);

        domElements.txtLeague.off('keyup').on('keyup', function (event) {
            if (event.keyCode === 13) {
                domElements.btnSearch.click();
            }
        });

        domElements.btnSearch.off('click').on('click', function () {
            var specialLeagueValues = domElements.ddlSpecialLeague.val().split(';');
            var displayMode = 0;
            var programID = '';

            if (specialLeagueValues.length > 1) {
                displayMode = specialLeagueValues[0];
                programID = specialLeagueValues[1];
            }

            if (validator.CountErrors(domElements.divLeagueBMFilter) === 0) {
                parameters.SportID = domElements.ddlSport.val();
                parameters.CountryCode = domElements.ddlCountry.val();
                parameters.CountryCode = parameters.CountryCode === 'null' ? '' : parameters.CountryCode;
                parameters.AllMarket = domElements.ddlMarket.val();
                parameters.LeagueName = $.trim(domElements.txtLeague.val());
                parameters.DisplayMode = displayMode;
                parameters.ProgramID = programID;
                domElements.txtLeague.val(parameters.LeagueName);

                getReportData();
            }
        });
    };

    // Reset filter data
    var resetFilterData = function () {
        domElements.divLeagueBMGridContainer.addClass('display-none');
    };

    $this.InitPage = function (divContent) {
        domElements.divLeagueBMContent = divContent;
        cacheDOMElements();
        resetFilterData();
        bindEventHandlers();
    };
};