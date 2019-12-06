////'use strict';
$(document).ready(function () {
    var traderPerformance = new Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance();

    traderPerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance');
Fanex.NAP.TGRS.MultipleMatchesPerformance.TraderPerformance = function () {
    var $this = this;
    var maximumMatchNameLength = 142;
    var domElements = {
        divTraderPerformanceFilter: null,       
        divDateRange: null,
        ddlGrade: null,
        ddlTeam: null,
        ddlBetType: null,
        ddlMultipleMatches: null,
        btnGenerate: null,
        divTraderPerformanceContainer: null,
        divTraderPerformanceGrid: null,
        divMatchPerformanceContainer: null,
        divMatchPerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };
    var urls = {
        GetInitializedData: common.ResolveRootUrl('PerformanceDetail/GetInitializedData'),
        GetTraderPerformance: common.ResolveRootUrl('PerformanceDetail/GetTraderPerformance'),
        ExportTraderPerformance: common.ResolveRootUrl('PerformanceDetail/ExportTraderPerformance'),
        GetMatchPerformanceOfTrader: common.ResolveRootUrl('PerformanceDetail/GetMatchPerformanceOfTrader'),
        GetBettypeDetail: common.ResolveRootUrl('PerformanceDetail/GetBettypeDetailTrader')
    };

    var parameters = {        
        FromDate: null,
        ToDate: null,
        BetTypes: null,
        Username: null       
    };

    var cachedData = {
        MatchPerformance: null,
        GrandTotal: null,
        TotalItems: 0,
        PageSize: common.Constants.PageSize,
        PageIndex: 0
    };
    var performanceDetailHelper = new Fanex.NAP.TGRS.MultipleMatchesPerformance.Helper();
    
    // Cache DOM Elements.
    var cacheDOMElements = function () {
        domElements.divTraderPerformanceFilter = $('#divTraderPerformanceFilter');
        domElements.divDateRange = domElements.divTraderPerformanceFilter.find('#divDateRange');
        domElements.ddlGrade = domElements.divTraderPerformanceFilter.find('#ddlGrade');
        domElements.ddlTeam = domElements.divTraderPerformanceFilter.find('#ddlTeam');
        domElements.ddlBetType = domElements.divTraderPerformanceFilter.find('#ddlBetType');
        domElements.ddlMultipleMatches = domElements.divTraderPerformanceFilter.find('#ddlMultipleMatches');
        domElements.btnGenerate = domElements.divTraderPerformanceFilter.find('#btnGenerate');
        domElements.divTraderPerformanceContainer = $('#divTraderPerformanceContainer');
        domElements.divTraderPerformanceGrid = $('#divTraderPerformanceGrid');
        domElements.divMatchPerformanceContainer = $('#divMatchPerformanceContainer');
        domElements.divMatchPerformanceGrid = $('#divMatchPerformanceGrid');
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');
    };

    // Bind event handlers.
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

        domElements.ddlGrade.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlGrade.next());
            });

        domElements.ddlTeam.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlTeam.next());
            });

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
            });

        domElements.ddlMultipleMatches.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.All
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlMultipleMatches.next());
            });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divTraderPerformanceFilter, 'w') && validateFilterForm()) {
                var selectedBetTypes = domElements.ddlBetType.val();
                var betTypeOptions = domElements.ddlBetType.find('option');
                
                parameters.FromDate = domElements.divDateRange.getFrom();
                parameters.ToDate = domElements.divDateRange.getTo();
                parameters.Username = domElements.txtTrader.val();
                parameters.BetTypes = selectedBetTypes.join(',');               

                hideReports();
                getTraderPerformanceReport();
            }
        });
    };

    // Hide reports.
    var hideReports = function () {
        domElements.divTraderPerformanceContainer.addClass('display-none');
        domElements.divMatchPerformanceContainer.addClass('display-none');
        domElements.divBettypeDetailContainer.addClass('display-none');
    };




    $this.InitPage = function () {
        cacheDOMElements();        
        initializeFields();
    };
};