/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages */

var gradeManagementService = (function ($) {

    var gradeManagementService = {};

    gradeManagementService.GetAllGrade = function () {
        common.DisableInput();
        gradeManagementFactory.GetAllGrade()
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

    gradeManagementService.InsertGrade = function (grade) {
        common.DisableInput();
        gradeManagementFactory.InsertGrade(grade)
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

    gradeManagementService.UpdateGrade = function (grade) {
        common.DisableInput();
        gradeManagementFactory.UpdateGrade(grade)
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

    return gradeManagementService;
})(jQuery);
