namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;

    public abstract class GetHistoryCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public override bool IsValid()
        {
            return true;
        }
    }
}