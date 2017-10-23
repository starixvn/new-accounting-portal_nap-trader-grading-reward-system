namespace Fanex.NAP.TGRS.Reports
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using System;
    using static Fanex.NAP.Core.Business.Constant;

    public static class ReportUtil
    {
        public static BettypeViewPermission GetBettypePermission(Func<string, Policy, bool> checkFunctionKeyMethod)
        {
            var hasPH = checkFunctionKeyMethod(TGRSFunctionKeys.PerformanceDetail_PHbettypes, Policy.Read);
            var hasMajor = checkFunctionKeyMethod(TGRSFunctionKeys.PerformanceDetail_Majorbettypes, Policy.Read);

            if (hasPH && !hasMajor) return BettypeViewPermission.PHAIO_Only;
            else if (!hasPH && hasMajor) return BettypeViewPermission.Major_Only;
            else if (hasPH && hasMajor) return BettypeViewPermission.All;
            else return BettypeViewPermission.None;
        }
    }
}