namespace Fanex.NAP.TGRS.Reports.Criteria
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Reports.Models.Permission;

    public abstract class BettypeGroupCriteria : CriteriaBase
    {
        private BettypeViewPermission _permission;

        public BettypeViewPermission Permission
        {
            set
            {
                _permission = value;
            }
        }

        public int ViewPermission
        {
            get
            {
                return _permission;
            }
        }
    }
}