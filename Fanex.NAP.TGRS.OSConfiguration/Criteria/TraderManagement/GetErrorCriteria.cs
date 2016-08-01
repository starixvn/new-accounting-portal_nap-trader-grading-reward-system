namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    public class GetErrorCriteria : GetHistoryCriteria
    {
        public int IssueTypeId
        {
            get { return 2; }
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderIssueGet";
        }
    }
}