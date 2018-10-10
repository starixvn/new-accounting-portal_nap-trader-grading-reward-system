namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using System;
    using Fanex.Data.Repository;

    public class InsertErrorCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public int TraderId { get; set; }

        public int ErrorId { get; set; }

        public DateTime ErrorDate { get; set; }

        public string Reason { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderErrorInsert";
        }
    }
}
