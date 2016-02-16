using Fanex.Data;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.Core.Helpers;
using System.Collections.Generic;

namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    public class MarginService : TGRSBaseService, Interface.IMarginService
    {
        public IEnumerable<TargetedMargin> GetMargin()
        {
            using (var db = new ObjectDb("TGRS_TargetedMargin_SelectAll"))
            {
                return db.Query<TargetedMargin>();
            }
        }

        public ICommandResult UpdateMargin(TargetedMargin margin)
        {
            var creatorId = AppSession.CurrentUser == null ? AppSession.CurrentUser.Id : 0;
            var dataModel = new MarginDataModel(creatorId, margin);
            return UpdateData(dataModel);
        }
    }
}