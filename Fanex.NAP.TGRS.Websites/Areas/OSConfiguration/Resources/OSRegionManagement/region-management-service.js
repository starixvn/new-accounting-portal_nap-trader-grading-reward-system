/* File Created: Feb 15, 2017 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, regionManagementFactory */

var regionManagementService = (function ($) {
    var regionManagementService = {};
    regionManagementService.Regions = [];
    regionManagementService.Result = [];

    regionManagementService.GetAllRegion = function () {
        common.DisableInput();
        return regionManagementFactory.GetAllRegion()
            .success(function (result) {
                regionManagementService.Regions = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    regionManagementService.InsertRegion = function (region) {
        common.DisableInput();
        return regionManagementFactory.InsertRegion(region)
            .success(function (result) {
                regionManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    regionManagementService.UpdateRegion = function (region) {
        common.DisableInput();
        return regionManagementFactory.UpdateRegion(region)
            .success(function (result) {
                regionManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return regionManagementService;
})(jQuery);
