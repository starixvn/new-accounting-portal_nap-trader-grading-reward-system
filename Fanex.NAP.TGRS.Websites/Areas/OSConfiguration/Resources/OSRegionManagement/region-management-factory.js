/* File Created: Feb 15, 2017 */
/*jshint strict: false*/
/* global  common */

var regionManagementFactory = (function ($) {
    var urls = {
        GetAllRegion: common.ResolveRootUrl('OSRegionManagement/GetAllRegion'),
        InsertRegion: common.ResolveRootUrl('OSRegionManagement/InsertRegion'),
        UpdateRegion: common.ResolveRootUrl('OSRegionManagement/UpdateRegion')
    };

    return {
        GetAllRegion: function () {
            return $.get(urls.GetAllRegion);
        },

        InsertRegion: function (region) {
            return $.post(urls.InsertRegion, region);
        },

        UpdateRegion: function (region) {
            return $.post(urls.UpdateRegion, region);
        }
    }
})(jQuery);
