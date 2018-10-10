using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    public class DeleteSettingCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int SpecialTargetId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetDelete";
        }
    }
}
