namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement
{    
    using Fanex.Data.Repository;

    public class UpdateErrorCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int ErrorId { get; set; }

        public string NewErrorName { get; set; }

        public string NewErrorDesc { get; set; }

        public int NewValue { get; set; }

        public bool NewDisabled { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ErrorUpdate";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
