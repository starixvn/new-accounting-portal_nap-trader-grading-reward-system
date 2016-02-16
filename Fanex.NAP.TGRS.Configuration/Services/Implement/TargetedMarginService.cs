namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using Core.BaseClasses;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Models.TargetedMargin;
    using System.Collections.Generic;

    public class TargetedMarginService : TGRSBaseService, Interface.ITargetedMarginService
    {
        private static GetAllTargetedMarginCriteria _emptyCrit;

        public IEnumerable<TargetedMargin> GetMargin()
        {
            return GetData<TargetedMargin>(_emptyCrit = _emptyCrit ?? new GetAllTargetedMarginCriteria());
        }

        public ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}