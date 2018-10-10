namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.Data.Repository;
    using System;

    public class GetGeneralInfoCriteria : BettypeGroupCriteria
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
