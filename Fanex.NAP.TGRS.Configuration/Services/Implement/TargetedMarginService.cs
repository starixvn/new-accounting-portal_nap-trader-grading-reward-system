namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using System.Collections.Generic;
    using Core.BaseClasses;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Models.TargetedMargin;
    using Framework.Data;

    public class TargetedMarginService : TGRSBaseService, Interface.ITargetedMarginService
    {
        public IEnumerable<TargetedMargin> GetMargin(ICriteria criteria)
        {
            return GetData<TargetedMargin>(criteria);
        }

        public ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}