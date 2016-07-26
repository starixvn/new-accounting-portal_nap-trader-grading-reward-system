/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages */

var teamManagementService = (function ($) {

    var teamManagementService = {};

    teamManagementService.GetAllTeam = function () {
        common.DisableInput();
        teamManagementFactory.GetAllTeam()
            .success(function (result) {
                //TODO:
            }),
            error(function (xhr) {
                common.HandleAjaxError(xhr);
            }),
            complete(function () {
                common.EnableInput();
            });
    };

    teamManagementService.InsertTeam = function (team) {
        common.DisableInput();
        teamManagementFactory.InsertTeam(team)
            .success(function (result) {
                //TODO:
            }),
            error(function (xhr) {
                common.HandleAjaxError(xhr);
            }),
            complete(function () {
                common.EnableInput();
            });
    };

    teamManagementService.UpdateTeam = function (team) {
        common.DisableInput();
        teamManagementFactory.UpdateTeam(team)
            .success(function (result) {
                //TODO:
            }),
            error(function (xhr) {
                common.HandleAjaxError(xhr);
            }),
            complete(function () {
                common.EnableInput();
            });
    };

    return teamManagementService;
})(jQuery);
