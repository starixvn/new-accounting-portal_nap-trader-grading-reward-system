using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    public class GetAllIssueCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_IssueTypeGet";
        }
    }
}