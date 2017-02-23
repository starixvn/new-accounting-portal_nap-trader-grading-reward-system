namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class GetTopNWorstTraderCriteria : CriteriaBase
    {
        public int Top { get; set; }

        public bool IsBottom
        {
            get
            {
                return true;
            }
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SummaryTopTrader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
