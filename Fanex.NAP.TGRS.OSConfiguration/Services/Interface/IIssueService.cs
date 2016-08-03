namespace Fanex.NAP.TGRS.OSConfiguration.Services.Interface
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;

    public interface IIssueService
    {
        IEnumerable<IssueInfo> GetIssueInfos();

        ICommandResult InsertNewIssue(InsertIssueCriteria criteria);
    }
}