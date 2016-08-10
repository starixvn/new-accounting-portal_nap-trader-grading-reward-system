/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, sportPerformanceService */
////'use strict';

$(document).ready(function () {
    sportPerformance.Initialize();
});

var sportPerformance = (function ($) {
    var sportPerformance = {};
    sportPerformance.SportPerformance = sportPerformanceService.SportPerformance;
    sportPerformance.Sports = sportPerformanceService.Sports;

    sportPerformance.filterParameters = {
        FromDate: null,
        ToDate: null,
        SportId: null
    };

    var timeout = null;

    var defaultSelectVal = 0;

    var domElements = {
        divSportPerformanceFilter: null,
        divDateRange: null,
        ddlSport: null,
        btnGenerate: null,
        divSportPerformanceContainer: null,
        divSportPerformanceGrid: null,
        divLeaguePerformanceContainer: null,
        divLeaguePerformanceGrid: null,
        divBettypeDetailContainer: null,
        divBettypeDetailGrid: null
    };

    sportPerformance.GetSportPerformance = function () {
        var criteria = {};
        sportPerformanceService.GetSportPerformance(criteria).then(function () {
            sportPerformance.SportPerformance = sportPerformanceService.SportPerformance;

            //renderGrid(sportPerformance.SportPerformance);
        });
    };

    sportPerformance.GetAllSports = function () {
        sportPerformanceService.GetAllSports().then(function () {
            sportPerformance.Sports = sportPerformanceService.Sports;

            sportPerformanceService.updateSportDropdown(sportPerformance.Sports, domElements.ddlSport, labels.AllSports, 0);

            domElements.ddlSport.multiselect({
                selectedList: 1,
                minWidth: 263,
                height: 200,
                multiple: false
            }).multiselectfilter({ width: 200 });
        });
    };

    sportPerformance.Initialize = function () {
        //init DOM elements
        domElements.divSportPerformanceFilter = $('#divSportPerformanceFilter');
        domElements.divDateRange = domElements.divSportPerformanceFilter.find('#divDateRange');
        domElements.ddlSport = domElements.divSportPerformanceFilter.find('#ddlSport');
        domElements.btnGenerate = domElements.divSportPerformanceFilter.find('#btnGenerate');
        domElements.divSportPerformanceContainer = $('#divSportPerformanceContainer');
        domElements.divSportPerformanceGrid = $('#divSportPerformanceGrid');
        domElements.divLeaguePerformanceContainer = $('#divLeaguePerformanceContainer');
        domElements.divLeaguePerformanceGrid = $('#divLeaguePerformanceGrid');
        domElements.divBettypeDetailContainer = $('#divBettypeDetailContainer');
        domElements.divBettypeDetailGrid = $('#divBettypeDetailGrid');

        //init canlendar
        domElements.divDateRange = domElements.divDateRange.timeRange({
            minDate: datepickerSetting.MinDate,
            maxDate: datepickerSetting.DefaultToDate,
            defaultFromDate: datepickerSetting.DefaultFromDate,
            defaultToDate: datepickerSetting.DefaultToDate,
            allowYearRange: datepickerSetting.AllowYearRange,
            yearRanges: null,
            labelCss: 'col_5'
        });

        //get sports
        sportPerformance.GetAllSports();
    };

    return sportPerformance;
})(jQuery);