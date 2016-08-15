using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    class GetSportsCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SportGetAll";
        }
    }
}
