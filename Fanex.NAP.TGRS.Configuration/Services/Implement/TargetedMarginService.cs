namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using Core.BaseClasses;
    using Core.Helpers;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Model.TargetedMargin;
    using System.Collections.Generic;

    public class TargetedMarginService : TGRSBaseService, Interface.ITargetedMarginService
    {
        private static EmptyCriteria _emptyCrit;

        public IEnumerable<TargetedMargin> GetMargin()
        {
            return GetData<TargetedMargin>(_emptyCrit = _emptyCrit ?? new EmptyCriteria());
        }

        public ICommandResult UpdateMargin(TargetedMargin margin)
        {
            var creatorId = AppSession.CurrentUser == null ? AppSession.CurrentUser.Id : 0;
            var marginCriteria = new TargetedMarginCriteria(creatorId, margin);
            return UpdateData(marginCriteria);
        }
    }
}