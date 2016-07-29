/* File Created: Jul 29, 2016 */
/*jshint strict: false*/
/* global  common */

var teamManagementFactory = (function ($) {
    var urls = {
        GetAllTeam: common.ResolveRootUrl('OSTeamManagement/GetAllTeam'),
        InsertTeam: common.ResolveRootUrl('OSTeamManagement/InsertTeam'),
        UpdateTeam: common.ResolveRootUrl('OSTeamManagement/UpdateTeam')
    };

    return {
        GetAllTeam: function () {
            return $.get(urls.GetAllTeam);
        },

        InsertTeam: function (team) {
            return $.post(urls.InsertTeam, team);
        },

        UpdateTeam: function (team) {
            return $.post(urls.UpdateTeam, team);
        }
    }
})(jQuery);
