/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global  common */

var gradeManagementFactory = (function ($) {
    var urls = {
        GetAllGrade: common.ResolveRootUrl('OSGradeManagement/GetAllGrade'),
        InsertGrade: common.ResolveRootUrl('OSGradeManagement/InsertGrade'),
        UpdateGrade: common.ResolveRootUrl('OSGradeManagement/UpdateGrade')
    };

    return {
        GetAllGrade: function () {
            return $.get(urls.GetAllGrade);
        },

        InsertGrade: function (grade) {
            return $.post(urls.InsertGrade, grade);
        },

        UpdateGrade: function (grade) {
            return $.post(urls.UpdateGrade, grade);
        }
    }
})(jQuery);
