namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class UpdateTraderCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public string EmployeeId { get; set; }

        public int TeamId { get; set; }

        public DateTime TeamEffectiveDate { get; set; }

        public int GradeId { get; set; }

        public DateTime GradeEffectiveDate { get; set; }

        public DateTime FirstWorkingDate { get; set; }

        public int CreatorId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderUpdate";
        }
    }
}