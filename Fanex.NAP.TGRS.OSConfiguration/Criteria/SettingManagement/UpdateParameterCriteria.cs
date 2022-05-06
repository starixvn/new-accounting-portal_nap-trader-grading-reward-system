namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using System;
    using Fanex.Data.Repository;

    public class UpdateParameterCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public short ParamId { get; set; }

        public double ParamValue { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ParameterUpdate";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
