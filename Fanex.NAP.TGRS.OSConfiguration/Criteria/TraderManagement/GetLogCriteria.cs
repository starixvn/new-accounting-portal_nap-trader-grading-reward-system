namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;

    internal abstract class GetLogCriteria : CriteriaBase
    {
        public int TraderId { get; set; }
    }
}