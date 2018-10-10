namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using System;
    using Fanex.Data.Repository;

    public class InsertIssueCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int IssueTypeId { get; set; }

        public DateTime IssuedDate { get; set; }

        public int Value { get; set; }

        public string Reason { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderIssueInsert";
        }
    }
}