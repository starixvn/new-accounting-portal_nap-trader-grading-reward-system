using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement
{
    public class UpdateErrStatusCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public bool Disabled { get; set; }

        public int ErrorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ErrorUpdateStatus";
        }
    }
}
