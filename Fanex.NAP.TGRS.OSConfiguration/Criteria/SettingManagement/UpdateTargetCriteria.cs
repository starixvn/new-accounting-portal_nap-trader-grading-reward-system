using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    public class UpdateTargetCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int SpecialTargetId { get; set; }

        public double NewTarget { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetUpdate";
        }
    }
}
