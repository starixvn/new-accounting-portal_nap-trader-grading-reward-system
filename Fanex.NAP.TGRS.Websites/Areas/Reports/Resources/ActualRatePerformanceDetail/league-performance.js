$(document).ready(function () {
    var leaguePerformance = new Fanex.NAP.TGRS.ActualRatePerformanceDetail.LeaguePerformance();
    leaguePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.ActualRatePerformanceDetail.LeaguePerformance');

Fanex.NAP.TGRS.ActualRatePerformanceDetail.LeaguePerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divLeaguePerformanceFilter: null,
        divDateRange: null,
        dpkFromDate: null,
        dpkToDate: null,
        txtLeague: null,
        ddlBetType: null,
        txtMarginFrom: null,
        txtMarginTo: null,
        txtMinTurnover: null,
        txtMinWinLoss: null,
        btnGenerate: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null,
        divMatchPerformanceOfLeagueContainer: null,
        divMatchPerformanceOfLeagueGrid: null,
        divBettypePerformanceOfLeagueMatchContainer: null,
        divBettypePerformanceOfLeagueMatchGrid: null
    };

    var urls = {        
        GetLeaguePerformance: common.ResolveRootUrl('ActualRatePerformanceDetail/GetLeaguePerformance'),
        ExportLeaguePerformance: common.ResolveRootUrl('ActualRatePerformanceDetail/ExportLeaguePerformance'),
        GetTraderPerformanceOfLeague: common.ResolveRootUrl('ActualRatePerformanceDetail/GetTraderPerformanceOfLeague'),
        GetMatchPerformanceOfLeagueTrader: common.ResolveRootUrl('ActualRatePerformanceDetail/GetMatchPerformanceOfLeagueTrader'),
        GetMatchPerformanceOfLeague: common.ResolveRootUrl('ActualRatePerformanceDetail/GetMatchPerformanceOfLeague'),
        GetBettypeDetail: common.ResolveRootUrl('ActualRatePerformanceDetail/GetBettypeDetailLeague'),
        GetBettypePerformanceOfLeagueMatch: common.ResolveRootUrl('ActualRatePerformanceDetail/GetBettypePerformanceOfLeagueMatch')
    };

    var parameters = {
        FromDate: null,
        ToDate: null,
        LeagueName: null,
        BetTypes: null,
        MarginFrom: null,
        MarginTo: null,
        Turnover: null,
        WinLoss: null
    };

    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divLeaguePerformanceFilter = $('#divLeaguePerformanceFilter');
        domElements.divDateRange = domElements.divLeaguePerformanceFilter.find('#divDateRange');
        domElements.txtLeague = domElements.divLeaguePerformanceFilter.find('#txtLeague');
        domElements.ddlBetType = domElements.divLeaguePerformanceFilter.find('#ddlBetType');
        domElements.txtMarginFrom = domElements.divLeaguePerformanceFilter.find('#txtMarginFrom');
        domElements.txtMarginTo = domElements.divLeaguePerformanceFilter.find('#txtMarginTo');
        domElements.txtMinTurnover = domElements.divLeaguePerformanceFilter.find('#txtMinTurnover');
        domElements.txtMinWinLoss = domElements.divLeaguePerformanceFilter.find('#txtMinWinLoss');
        domElements.btnGenerate = domElements.divLeaguePerformanceFilter.find('#btnGenerate');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');
        domElements.divMatchPerformanceOfLeagueContainer = $('#divMatchPerformanceOfLeagueContainer');
        domElements.divMatchPerformanceOfLeagueGrid = $('#divMatchPerformanceOfLeagueGrid');
        domElements.divBettypePerformanceOfLeagueMatchContainer = $('#divBettypePerformanceOfLeagueMatchContainer');
        domElements.divBettypePerformanceOfLeagueMatchGrid = $('#divBettypePerformanceOfLeagueMatchGrid');
    };

    //Init event handlers for dom elements
    var initializeFields = function () {
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divLeaguePerformanceFilter, 'w')) {
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.LeagueName = domElements.txtLeague.val();

                hideAllReports();
                getLeaguePerformanceReport();
            }
        });
    };

    // Hide all reports.
    var hideAllReports = function () {
        domElements.divLeaguePerformanceContainer.addClass('display-none');
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
        domElements.divMatchPerformanceOfLeagueContainer.addClass('display-none');
        domElements.divBettypePerformanceOfLeagueMatchContainer.addClass('display-none');
    };

    // Get league performance report data.
    var getLeaguePerformanceReport = function () {
        comon.DisableInput();
        $.ajax({
            type: 'POST',
        });
    };


    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};

