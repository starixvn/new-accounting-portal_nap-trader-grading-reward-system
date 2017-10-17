namespace Fanex.NAP.TGRS.Reports
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.Permission;

    public static class ReportUtil
    {
        public static BettypeViewPermission BettypePermission
        {
            get
            {
                var hasPH = PermissionService.HasPermission(TGRSFunctionKeys.PerformanceDetail_PHbettypes);
                var hasMajor = PermissionService.HasPermission(TGRSFunctionKeys.PerformanceDetail_majorbettypes);

                if (hasPH && !hasMajor) return BettypeViewPermission.PHAIO_Only;
                else if (!hasPH && hasMajor) return BettypeViewPermission.Major_Only;
                else if (hasPH && hasMajor) return BettypeViewPermission.All;
                else return BettypeViewPermission.None;
            }
        }
    }
}