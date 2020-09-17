$(document).ready(function () {
    var betTypePerformance = new Fanex.NAP.TGRS.OSReports.BasketballPerformace();

    betTypePerformance.InitPage();
});

Namespace.Register('Fanex.NAP.TGRS.OSReports.BasketballPerformace');
Fanex.NAP.TGRS.OSReports.BasketballPerformace = function () {
    var $this = this;

    var urls = {
        GetBetTypePerformance: common.ResolveRootUrl('PerformanceDetail/GetBetTypePerformance'),
        ExportBetTypePerformance: common.ResolveRootUrl('PerformanceDetail/ExportBetTypePerformance')
    };

    var domElements = {
        divBetTypePerformanceFilter: null,
        ddlMarket: null,
        divDateRange: null,
        ddlBetType: null,
        ddlLeagueGroup: null,
        txtLeague: null,
        btnGenerate: null,
        divBetTypePerformanceContainer: null,
        divBetTypePerformanceGrid: null
    };

    var parameters = {
        MarketFilter: null,
        FromDate: null,
        ToDate: null,
        BetTypes: null     
    };

    var cacheDOMElements = function () {
        domElements.divBetTypePerformanceFilter = $('#divBetTypePerformanceFilter');
        domElements.ddlMarket = domElements.divBetTypePerformanceFilter.find('#ddlMarket');
        domElements.divDateRange = domElements.divBetTypePerformanceFilter.find('#divDateRange');
        domElements.ddlBetType = domElements.divBetTypePerformanceFilter.find('#ddlBetType');
        domElements.ddlLeagueGroup = domElements.divBetTypePerformanceFilter.find('#ddlLeagueGroup');
        domElements.txtLeague = domElements.divBetTypePerformanceFilter.find('#txtLeague');
        domElements.btnGenerate = domElements.divBetTypePerformanceFilter.find('#btnGenerate');
        domElements.divBetTypePerformanceContainer = $('#divBetTypePerformanceContainer');
        domElements.divBetTypePerformanceGrid = $('#divBetTypePerformanceGrid');
    };

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

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            groupsCollapsable: true,
            optGroupChecked: true,
            create: function () {
                //performanceDetailHelper.SelectDefaultBettypes(domElements.ddlBetType, performanceDetailHelper.GetDefaultBettypes());
            }
        }).multiselectfilter({ width: 135 }).change(function () {
            validator.ClearError(domElements.ddlBetType.next());
        });

        domElements.ddlLeagueGroup.multiselect({
            selectedList: 2,
            minWidth: 195,
            height: 200,
            allSelectedText: labels.AllLeagueGroups
        });

        domElements.btnGenerate.click(function () {
            if (validator.ValidateForm(domElements.divBetTypePerformanceFilter, 'w') && validateFilterForm()) {
                //var selectedBetTypes = domElements.ddlBetType.val();
                //var selectedLeagueGroups = domElements.ddlLeagueGroup.val();

                //parameters.MarketFilter = domElements.ddlMarket.val();
                //parameters.FromDate = domElements.divDateRange.getFrom();
                //parameters.ToDate = domElements.divDateRange.getTo();
                //parameters.BetTypes = selectedBetTypes.join(',');
                //parameters.LeagueGroupIds = selectedLeagueGroups !== null ? selectedLeagueGroups.join(',') : null;
                //parameters.LeagueName = domElements.txtLeague.val();

                domElements.divBetTypePerformanceContainer.addClass('display-none');
                getBetTypePerformanceReport();
            }
        });
    };

    var getBetTypePerformanceReport = function () {
        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.GetBetTypePerformance,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(parameters),
            success: function (result) {
                renderBetTypePerformanceGrid(result);
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };

    var renderBetTypePerformanceGrid = function (data) {

    };

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    };
};