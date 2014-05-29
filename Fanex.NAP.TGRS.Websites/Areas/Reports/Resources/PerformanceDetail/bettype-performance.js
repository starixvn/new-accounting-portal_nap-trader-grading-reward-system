/* File Created: May 19, 2014 */
/* global Namespace, Fanex, validator */

'use strict';
$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance');
Fanex.NAP.TGRS.PerformanceDetail.BetTypePerformance = function () {
    var $this = this;
    var domElements = {
        divBetTypePerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtBetTypeBMFrom: null,
        txtBetTypeBMTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null
    };
    var parameters = {
        DateFrom: null,
        DateTo: null,
        BetType: null,
        MarginFrom: null,
        MarginTo: null,
        TeamBMFrom: null,
        TeamBMTo: null,
        MinTurnover: null,
        MinWinLoss: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divTeamPerformanceFilter');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divBetTypePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divBetTypePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divBetTypePerformanceFilter.find('#txtMarginTo');
        domElements.txtBetTypeBMFrom = domElements.divBetTypePerformanceFilter.find('#txtBetTypeBMFrom');
        domElements.txtBetTypeBMTo = domElements.divBetTypePerformanceFilter.find('#txtBetTypeBMTo');
        domElements.txtMinTurnover = domElements.divBetTypePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divBetTypePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
    };

    // Bind event handlers.
    var initializeFields = function () {
        domElements.txtMarginFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginFrom.val());

            domElements.txtMarginFrom.val(value);
            validator.ClearError(domElements.txtMarginFrom);
        });

        domElements.txtMarginTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMarginTo.val());

            domElements.txtMarginTo.val(value);
            validator.ClearError(domElements.txtMarginTo);
        });

        domElements.txtBetTypeBMFrom.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtBetTypeBMFrom.val());

            domElements.txtBetTypeBMFrom.val(value);
            validator.ClearError(domElements.txtBetTypeBMFrom);
        });

        domElements.txtBetTypeBMTo.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtBetTypeBMTo.val());

            domElements.txtBetTypeBMTo.val(value);
            validator.ClearError(domElements.txtBetTypeBMTo);
        });

        domElements.txtMinTurnover.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinTurnover.val());

            domElements.txtMinTurnover.val(value);
            validator.ClearError(domElements.txtMinTurnover);
        });

        domElements.txtMinWinLoss.numberField(2, true, null).focusout(function () {
            var value = $.trim(domElements.txtMinWinLoss.val());

            domElements.txtMinWinLoss.val(value);
            validator.ClearError(domElements.txtMinWinLoss);
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divTeamPerformanceFilter, 'w')) {
                //parameters.DateFrom = domElements.dpkFromDate.val();
                //parameters.DateTo = domElements.dpkToDate.val();
                parameters.TeamId = domElements.ddlTeam.val();
                parameters.BetType = domElements.ddlBetType.val();
                parameters.MarginFrom = domElements.txtMarginFrom.val().replace(/,/g, '');
                parameters.MarginTo = domElements.txtMarginTo.val().replace(/,/g, '');
                parameters.TeamBMFrom = domElements.txtTeamBMFrom.val().replace(/,/g, '');
                parameters.TeamBMTo = domElements.txtTeamBMTo.val().replace(/,/g, '');
                parameters.MinTurnover = domElements.txtMinTurnover.val().replace(/,/g, '');
                parameters.MinWinLoss = domElements.txtMinWinLoss.val().replace(/,/g, '');

                // @@TODO: Get data.
            }
        });
    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};