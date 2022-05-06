namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement
{
    using Fanex.Data.Repository;

    public class InsertErrorCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public string ErrorName { get; set; }

        public string ErrorDesc { get; set; }

        public int Value { get; set; }

        public bool Disabled { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ErrorInsert";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
