/* File Created: Jul 29, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, teamManagementFactory */

var teamManagementService = (function ($) {
    var teamManagementService = {};
    teamManagementService.Teams = [];
    teamManagementService.Result = [];

    teamManagementService.GetAllTeam = function () {
        common.DisableInput();
        return teamManagementFactory.GetAllTeam()
            .success(function (result) {
                teamManagementService.Teams = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    teamManagementService.InsertTeam = function (team) {
        common.DisableInput();
        return teamManagementFactory.InsertTeam(team)
            .success(function (result) {
                teamManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    teamManagementService.UpdateTeam = function (team) {
        common.DisableInput();
        return teamManagementFactory.UpdateTeam(team)
            .success(function (result) {
                teamManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return teamManagementService;
})(jQuery);
