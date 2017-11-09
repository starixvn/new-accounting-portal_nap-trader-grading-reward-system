namespace Fanex.NAP.TGRS.Reports
{
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using System;

    public static class ReportUtil
    {
        public static BettypeViewPermission GetBettypePermission(Func<string, Fanex.NAP.Core.Business.Constant.Policy, bool> checkFunctionKeyMethod)
        {
            var hasPH = checkFunctionKeyMethod(TGRSFunctionKeys.PerformanceDetail_PHbettypes, Fanex.NAP.Core.Business.Constant.Policy.Read);
            var hasMajor = checkFunctionKeyMethod(TGRSFunctionKeys.PerformanceDetail_Majorbettypes, Fanex.NAP.Core.Business.Constant.Policy.Read);

            if (hasPH && !hasMajor) return BettypeViewPermission.PHAIO_Only;
            else if (!hasPH && hasMajor) return BettypeViewPermission.Major_Only;
            else if (hasPH && hasMajor) return BettypeViewPermission.All;
            else return BettypeViewPermission.None;
        }

        public static BettypeViewPermission GetBettypeViewPermission(Func<string, Fanex.NAP.Core.Business.Constant.Policy, bool> checkFunctionKeyMethod, string phKey, string majorKey)
        {
            var hasPH = checkFunctionKeyMethod(phKey, Fanex.NAP.Core.Business.Constant.Policy.Read);
            var hasMajor = checkFunctionKeyMethod(majorKey, Fanex.NAP.Core.Business.Constant.Policy.Read);

            if (hasPH && !hasMajor) return BettypeViewPermission.PHAIO_Only;
            else if (!hasPH && hasMajor) return BettypeViewPermission.Major_Only;
            else if (hasPH && hasMajor) return BettypeViewPermission.All;
            else return BettypeViewPermission.None;
        }
    }
}