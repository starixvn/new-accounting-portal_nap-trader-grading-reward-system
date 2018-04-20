namespace Fanex.NAP.TGRS.DataReportService.Criteria
{
    using Fanex.NAP.Framework.Data;

    public class ChangedDataGetCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_Service_ChangedData_Get";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}