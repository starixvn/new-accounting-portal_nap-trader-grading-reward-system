namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class UpdateTraderCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int NewTeamId { get; set; }

        public string NewEmployeeId { get; set; }

        public DateTime NewTeamEffectiveDate { get; set; }

        public int NewGradeId { get; set; }

        public DateTime NewGradeEffectiveDate { get; set; }

        public DateTime NewFirstWorkingDate { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderUpdate";
        }
    }
}