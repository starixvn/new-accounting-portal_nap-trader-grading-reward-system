using Fanex.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    public class AddTeamCriteria:CriteriaBase
    {
        public string Name { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}
