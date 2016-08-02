namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class InsertTraderCriteria : CriteriaBase
    {
        public string TraderName { get; set; }

        public string EmployeeId { get; set; }

        public int TeamId { get; set; }

        public int GradeId { get; set; }

        public DateTime FirstWorkingDate { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderInsert";
        }
    }
}