namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;
    using System;

    public class UpdateTraderCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public string Username { get; set; }

        public int EmployeeId { get; set; }

        public int TeamId { get; set; }

        public DateTime ChangeTeamDate { get; set; }

        public int GradeId { get; set; }

        public DateTime ChangeGradeDate { get; set; }

        public DateTime FirstWorkingDate { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}