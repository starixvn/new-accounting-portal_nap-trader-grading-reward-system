using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement
{
    public class Parameter
    {
        public int ParamId { get; set; }

        public string ParamName { get; set; }

        public string ParamDesc { get; set; }

        public string ParamDisplayName { get; set; }

        public double ParamValue { get; set; }
    }
}
