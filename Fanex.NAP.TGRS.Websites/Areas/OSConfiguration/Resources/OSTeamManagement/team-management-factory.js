var teamManagementFactory = (function ($) {
    var urls = {
        GetAllTeam: common.ResolveRootUrl('OSConfiguration/TeamManagement/GetAllTeam'),
        InsertTeam: common.ResolveRootUrl('OSConfiguration/TeamManagement/InsertTeam'),
        UpdateTeam: common.ResolveRootUrl('OSConfiguration/TeamManagement/UpdateTeam')
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