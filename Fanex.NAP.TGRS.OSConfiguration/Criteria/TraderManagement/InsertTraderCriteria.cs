namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class InsertTraderCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int EmployeeId { get; set; }

        public int TeamId { get; set; }

        public int GradeId { get; set; }

        public DateTime FirstWorkingDate { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}