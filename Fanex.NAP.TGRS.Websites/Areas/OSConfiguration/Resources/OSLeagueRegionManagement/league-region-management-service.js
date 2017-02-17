/* File Created: Feb 17, 2017 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, leagueRegionManagementFactory */

var leagueRegionManagementService = (function ($) {
    var leagueRegionManagementService = {};
    leagueRegionManagementService.LeagueRegions = [];
    leagueRegionManagementService.Regions = [];
    leagueRegionManagementService.Sports = [];
    leagueRegionManagementService.Result = [];

    leagueRegionManagementService.GetLeagueRegions = function (criteria) {
        common.DisableInput();
        return leagueRegionManagementFactory.GetLeagueRegions(criteria)
            .success(function (result) {
                leagueRegionManagementService.LeagueRegions = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    leagueRegionManagementService.InsertLeagueRegion = function (leagueRegion) {
        common.DisableInput();
        return leagueRegionManagementFactory.InsertLeagueRegion(leagueRegion)
            .success(function (result) {
                leagueRegionManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    leagueRegionManagementService.UpdateLeagueRegion = function (leagueRegion) {
        common.DisableInput();
        return leagueRegionManagementFactory.UpdateLeagueRegion(leagueRegion)
            .success(function (result) {
                leagueRegionManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    leagueRegionManagementService.GetRegions = function () {
        return leagueRegionManagementFactory.GetRegions()
            .success(function (result) {
                leagueRegionManagementService.Regions = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    leagueRegionManagementService.GetSports = function () {
        return leagueRegionManagementFactory.GetSports()
            .success(function (result) {
                leagueRegionManagementService.Sports = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return leagueRegionManagementService;
})(jQuery);
