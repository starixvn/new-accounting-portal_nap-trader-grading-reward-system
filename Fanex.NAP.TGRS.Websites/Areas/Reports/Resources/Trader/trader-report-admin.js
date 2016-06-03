$(document).ready(function () {
    var TraderReport = new Fanex.TGRS.Reports.Trader();
    var link = common.ResolveRootUrl('Reports/Trader/GetReportsForAdminTrader');
    TraderReport.Initialize(link);
});