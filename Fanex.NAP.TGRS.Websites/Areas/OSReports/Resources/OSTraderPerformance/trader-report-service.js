var TraderReportService = (function ($) {
    var traderReportService = {};
    traderReportService.Sports = [];

    traderReportService.GetTraderPerformance = function (criteria, callback) {
        TraderReportFactory.GetTraderPerformance(criteria)
        .success(callback)
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    };

    traderReportService.GetSportsPerformance = function (criteria, callback) {
        TraderReportFactory.GetSportsPerformance(criteria)
        .success(callback)
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    };

    traderReportService.GetAllSports = function () {
        common.DisableInput();
        return TraderReportFactory.GetAllSports()
            .success(function (result) {
                traderReportService.Sports = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderReportService.updateSportDropdown = function (data, ddlDiv, defaultLabel, selectVal) {
        ddlDiv.html('');
        var isAutoSelect = false;

        if (defaultLabel != null) {
            ddlDiv.append($('<option></option>').attr('value', -1).text(defaultLabel));
            isAutoSelect = true;
        }

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                ddlDiv.append($('<option></option>').attr('value', item.SportId).text(item.SportName));
            });
        }

        if (isAutoSelect || selectVal !== -1) {
            ddlDiv.val(selectVal);
        }
        else {
            ddlDiv.val('');
        }
    };

    return traderReportService;

})(jQuery)