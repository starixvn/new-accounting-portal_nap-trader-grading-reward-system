namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement
{
    using Fanex.Data.Repository;

    public class DeleteErrorCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int ErrorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ErrorDelete";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
