/* File Created: Aug 10, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, sportPerformanceFactory */

var sportPerformanceService = (function ($) {
    var sportPerformanceService = {};
    sportPerformanceService.SportPerformance = [];
    sportPerformanceService.Sports = [];

    sportPerformanceService.GetSportPerformance = function (criteria) {
        common.DisableInput();
        return sportPerformanceFactory.GetSportPerformance(criteria)
            .success(function (result) {
                sportPerformanceService.SportPerformance = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    sportPerformanceService.GetAllSports = function () {
        common.DisableInput();
        return sportPerformanceFactory.GetAllSports()
            .success(function (result) {
                sportPerformanceService.Sports = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    sportPerformanceService.updateSportDropdown = function (data, ddlDiv, defaultLabel, selectVal) {
        debugger;
        ddlDiv.html('');
        var isAutoSelect = false;

        if (defaultLabel != null) {
            ddlDiv.append($('<option></option>').attr('value', 0).text(defaultLabel));
            isAutoSelect = true;
        }

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                ddlDiv.append($('<option></option>').attr('value', item.SportId).text(item.SportName));
            });
        }

        if (isAutoSelect || selectVal !== 0) {
            ddlDiv.val(selectVal);
        }
        else {
            ddlDiv.val('');
        }
    };

    return sportPerformanceService;
})(jQuery);
