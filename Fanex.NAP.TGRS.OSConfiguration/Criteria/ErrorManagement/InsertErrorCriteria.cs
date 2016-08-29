using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement
{
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
    }
}
