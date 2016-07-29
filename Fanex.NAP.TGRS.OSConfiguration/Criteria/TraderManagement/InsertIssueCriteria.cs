namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.NAP.Framework.Data;
    using System;
    using Fanex.NAP.Framework.Data;

    public class InsertIssueCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int IssueId { get; set; }

        public DateTime IssueDate { get; set; }

        public int Value { get; set; }

        public string Reason { get; set; }
    }
}