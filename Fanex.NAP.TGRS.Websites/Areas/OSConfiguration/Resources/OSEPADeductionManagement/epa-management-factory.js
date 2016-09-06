/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global  common */

var epaManagementFactory = (function ($) {
    var urls = {
        GetEPADeductionReport: common.ResolveRootUrl('OSEPADeductionManagement/GetEPADeductionReport'),
        GetEPADeductionHistory: common.ResolveRootUrl('OSEPADeductionManagement/GetEPADeductionHistory'),
        DeleteEPADeductionHistory: common.ResolveRootUrl('OSEPADeductionManagement/DeleteEPADeductionHistory'),
        GetErrorHistory: common.ResolveRootUrl('OSEPADeductionManagement/GetErrorHistory'),
        DeleteErrorHistory: common.ResolveRootUrl('OSEPADeductionManagement/DeleteErrorHistory'),
        GetLeaveHistory: common.ResolveRootUrl('OSEPADeductionManagement/GetLeaveHistory'),
        DeleteLeaveHistory: common.ResolveRootUrl('OSEPADeductionManagement/DeleteLeaveHistory'),
        GetErrorTypes: common.ResolveRootUrl('OSEPADeductionManagement/GetErrorTypes'),
        InsertEPADeduction: common.ResolveRootUrl('OSEPADeductionManagement/InsertEPADeduction'),
        InsertError: common.ResolveRootUrl('OSEPADeductionManagement/InsertError'),
        InsertLeave: common.ResolveRootUrl('OSEPADeductionManagement/InsertLeave')
    };

    return {
        GetEPADeductionReport: function (criteria) {
            return $.get(urls.GetEPADeductionReport, criteria);
        },

        GetEPADeductionHistory: function (criteria) {
            return $.get(urls.GetEPADeductionHistory, criteria);
        },

        DeleteEPADeductionHistory: function (error) {
            return $.post(urls.DeleteEPADeductionHistory, error);
        },

        GetErrorHistory: function (criteria) {
            return $.get(urls.GetErrorHistory, criteria);
        },
        
        DeleteErrorHistory: function (error) {
            return $.post(urls.DeleteErrorHistory, error);
        },

        GetLeaveHistory: function (criteria) {
            return $.get(urls.GetLeaveHistory, criteria);
        },

        DeleteLeaveHistory: function (error) {
            return $.post(urls.DeleteLeaveHistory, error);
        },

        GetErrorTypes: function () {
            return $.get(urls.GetErrorTypes);
        },

        InsertEPADeduction: function (error) {
            return $.post(urls.InsertEPADeduction, error);
        },

        InsertError: function (error) {
            return $.post(urls.InsertError, error);
        },

        InsertLeave: function (error) {
            return $.post(urls.InsertLeave, error);
        }
    }
})(jQuery);
