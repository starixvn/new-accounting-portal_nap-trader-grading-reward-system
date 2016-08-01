namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    public class GetEPADeductionCriteria : GetHistoryCriteria
    {
        public int IssueTypeId
        {
            get { return 1; }
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderIssueGet";
        }
    }
}