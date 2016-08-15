using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    class GetGlobalParameterCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_ParameterGetGlobalTarget";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
