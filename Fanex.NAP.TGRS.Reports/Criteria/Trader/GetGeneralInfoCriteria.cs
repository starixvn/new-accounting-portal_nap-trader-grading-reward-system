namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetGeneralInfoCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderGeneralInfo";
        }

        public override bool IsValid()
        {
            return TraderId > 0;
        }
    }
}
