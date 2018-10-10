namespace Fanex.NAP.TGRS.Reports.Criteria.TraderManagement
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Get all Trader.
    /// </summary>
    public class GetAllTradersCriteria : CriteriaBase
    {
        public GetAllTradersCriteria()
        {
            UserName = string.Empty;
            EmployeeId = string.Empty;
            TeamId = 0;
            Grade = 0;
        }

        public string UserName { get; set; }

        public string EmployeeId { get; set; }

        public int TeamId { get; set; }

        public int Grade { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Trader_SelectAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
