namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;
    using System;

    internal class AddErrorCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int ErrorId { get; set; }

        public DateTime ErrorDate { get; set; }

        public int Value { get; set; }

        public string Reason { get; set; }
    }
}