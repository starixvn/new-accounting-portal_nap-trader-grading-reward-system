/* File Created: May 14, 2014 */
/* global Namespace, Fanex, common */

'use strict';

Namespace.Register('Fanex.NAP.TGRS.BenchmarkManagement.PageManager');
Fanex.NAP.TGRS.BenchmarkManagement.PageManager = function () {

    var $this = this;
    var domElements = {
        lnkLeague: null,
        lnkTeam: null,
        lnkBack: null,
        divLeagueBMContent: null,
        divTeamBMContent: null,
        divBetTypeBMContent: null
    };
    var pages = {
        LeagueBenchmark: null,
        TeamBenchmark: null,
        BetTypeBenchmark: null
    };
    var currentTag = null;

    // Cache DOM elements
    var cacheDOMElements = function () {
        domElements.lnkLeague = $('#lnkLeague');
        domElements.lnkTeam = $('#lnkTeam');
        domElements.lnkBack = $('#lnkBack');
        domElements.divLeagueBMContent = $('#divLeagueBMContent');
        domElements.divTeamBMContent = $('#divTeamBMContent');
        domElements.divBetTypeBMContent = $('#divBetTypeBMContent');
    };

    // Initialize fields and handle events.
    var initFields = function () {
        domElements.lnkLeague.on('click', function () {
            if (!domElements.lnkLeague.hasClass('disabled')) {
                domElements.lnkTeam.removeClass('disabled');
                domElements.lnkLeague.addClass('disabled');
                domElements.lnkBack.addClass('hide');
                domElements.divTeamBMContent.addClass('display-none');
                domElements.divBetTypeBMContent.addClass('display-none');
                domElements.divLeagueBMContent.removeClass('display-none');

                pages.LeagueBenchmark = pages.LeagueBenchmark || new Fanex.NAP.TGRS.BenchmarkManagement.LeagueBenchmark();
                currentTag = pages.LeagueBenchmark;
                currentTag.InitPage(domElements.divLeagueBMContent, $this.ShowBetTypeBenchmark);

                if (common.IsOpenPopup()) {
                    common.ClosePopup();
                }
            }
        }).click();

        domElements.lnkTeam.on('click', function () {
            if (!domElements.lnkTeam.hasClass('disabled')) {
                domElements.lnkTeam.addClass('disabled');
                domElements.lnkLeague.removeClass('disabled');
                domElements.lnkBack.addClass('hide');
                domElements.divBetTypeBMContent.addClass('display-none');
                domElements.divLeagueBMContent.addClass('display-none');
                domElements.divTeamBMContent.removeClass('display-none');

                pages.TeamBenchmark = pages.TeamBenchmark || new Fanex.NAP.TGRS.BenchmarkManagement.TeamBenchmark();
                currentTag = pages.TeamBenchmark;
                currentTag.InitPage(domElements.divTeamBMContent);

                if (common.IsOpenPopup()) {
                    common.ClosePopup();
                }
            }
        });

        domElements.lnkBack.on('click', function () {
            domElements.lnkTeam.removeClass('disabled');
            domElements.lnkLeague.addClass('disabled');
            domElements.lnkBack.addClass('hide');
            domElements.divTeamBMContent.addClass('display-none');
            domElements.divBetTypeBMContent.addClass('display-none');
            domElements.divLeagueBMContent.removeClass('display-none');

            if (common.IsOpenPopup()) {
                common.ClosePopup();
            }
        });
    };

    $this.ShowBetTypeBenchmark = function (leagueID, leagueName) {
        domElements.lnkTeam.removeClass('disabled');
        domElements.lnkLeague.removeClass('disabled');
        domElements.lnkBack.removeClass('hide');
        domElements.divBetTypeBMContent.removeClass('display-none');
        domElements.divLeagueBMContent.addClass('display-none');
        domElements.divTeamBMContent.addClass('display-none');

        pages.BetTypeBenchmark = pages.BetTypeBenchmark || new Fanex.NAP.TGRS.BenchmarkManagement.BetTypeBenchmark();
        currentTag = new Fanex.NAP.TGRS.BenchmarkManagement.BetTypeBenchmark();
        currentTag.InitPage(domElements.divBetTypeBMContent, leagueID, leagueName);

        if (common.IsOpenPopup()) {
            common.ClosePopup();
        }
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initFields();
    };
};

var benchmarkManagement = new Fanex.NAP.TGRS.BenchmarkManagement.PageManager();

$(document).ready(function () {
    benchmarkManagement.InitPage();
});