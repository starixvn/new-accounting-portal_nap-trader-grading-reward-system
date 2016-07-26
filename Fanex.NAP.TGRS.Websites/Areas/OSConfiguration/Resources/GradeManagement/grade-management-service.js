/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, gradeManagementFactory */

var gradeManagementService = (function ($) {
    var gradeManagementService = {};
    gradeManagementService.Grades = [];
    gradeManagementService.Result = [];

    gradeManagementService.GetAllGrade = function () {
        common.DisableInput();
        return gradeManagementFactory.GetAllGrade()
            .success(function (result) {
                gradeManagementService.Grades = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    gradeManagementService.InsertGrade = function (grade) {
        common.DisableInput();
        return gradeManagementFactory.InsertGrade(grade)
            .success(function (result) {
                gradeManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    gradeManagementService.UpdateGrade = function (grade) {
        common.DisableInput();
        return gradeManagementFactory.UpdateGrade(grade)
            .success(function (result) {
                gradeManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return gradeManagementService;
})(jQuery);
