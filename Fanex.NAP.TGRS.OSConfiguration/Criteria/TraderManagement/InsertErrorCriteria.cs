namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.NAP.Framework.Data;
    using System;

    internal class InsertErrorCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int ErrorId { get; set; }

        public DateTime ErrorDate { get; set; }

        public int Value { get; set; }

        public string Reason { get; set; }
    }
}