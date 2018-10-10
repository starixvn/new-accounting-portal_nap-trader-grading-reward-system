using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
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
    }
}
