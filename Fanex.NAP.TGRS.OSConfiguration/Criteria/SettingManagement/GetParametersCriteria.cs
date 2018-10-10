using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    public class GetParametersCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_ParameterGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
