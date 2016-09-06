namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class InsertPointDeductionCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public int TraderId { get; set; }

        public int DeductionValue { get; set; }

        public DateTime DeductionDate { get; set; }

        public string Reason { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderPointDeductionInsert";
        }
    }
}
