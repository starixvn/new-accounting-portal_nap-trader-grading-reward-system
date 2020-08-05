namespace Fanex.NAP.TGRS.Reports.Criteria
{
    using System;
    using Fanex.Data.Repository;

    public class GetBasketballSummaryInfoCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }        

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Basketball_Rpt_SummaryGeneralInfo";
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
