/* File Created: Feb 17, 2017 */
/*jshint strict: false*/
/* global  common */

var leagueRegionManagementFactory = (function ($) {
    var urls = {
        GetLeagueRegions: common.ResolveRootUrl('OSLeagueRegionManagement/GetLeagueRegions'),
        InsertLeagueRegion: common.ResolveRootUrl('OSLeagueRegionManagement/InsertLeagueRegion'),
        UpdateLeagueRegion: common.ResolveRootUrl('OSLeagueRegionManagement/UpdateLeagueRegion'),
        GetSports: common.ResolveRootUrl("OSLeagueRegionManagement/GetSports"),
        GetRegions: common.ResolveRootUrl("OSLeagueRegionManagement/GetRegions")
    };

    return {
        GetLeagueRegions: function (criteria) {
            return $.get(urls.GetLeagueRegions, criteria);
        },

        InsertLeagueRegion: function (criteria) {
            return $.post(urls.InsertLeagueRegion, criteria);
        },

        UpdateLeagueRegion: function (criteria) {
            return $.post(urls.UpdateLeagueRegion, criteria);
        },

        GetSports: function () {
            return $.get(urls.GetSports);
        },

        GetRegions: function () {
            return $.get(urls.GetRegions);
        }
    }
})(jQuery);