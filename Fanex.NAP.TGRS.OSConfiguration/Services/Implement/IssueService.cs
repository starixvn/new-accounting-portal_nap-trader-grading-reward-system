using System.Collections.Generic;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.Implement
{
    public class IssueService : TGRSBaseService, IIssueService
    {
        public IEnumerable<IssueInfo> GetIssueInfos()
        {
            var criteria = new GetAllIssueCriteria();

            return GetData<IssueInfo>(criteria);
        }

        public ICommandResult InsertNewIssue(InsertIssueCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}