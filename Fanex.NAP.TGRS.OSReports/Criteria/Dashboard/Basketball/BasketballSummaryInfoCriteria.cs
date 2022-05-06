namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{  
    using System;
    using Fanex.Data;
    using Fanex.Data.Repository;

    public class BasketballSummaryInfoCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public DayType BasketballDays { get; set; }

        public override string GetSettingKey()
        {
            return "";
        }

        /// <summary>
        /// Checks validation of the criteria.
        /// </summary>
        /// <returns>Whether or not the criteria is valid.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}
