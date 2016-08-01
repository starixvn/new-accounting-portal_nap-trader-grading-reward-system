using System.Collections.Generic;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.Interface
{
    public interface IIssueService
    {
        IEnumerable<IssueInfo> GetIssueInfos();

        ICommandResult InsertNewIssue(InsertIssueCriteria criteria);
    }
}