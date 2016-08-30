using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.NAP.TGRS.OSConfiguration.Models.ErrorManagement
{
    public class Error
    {
        public int ErrorId { get; set; }

        public string ErrorName { get; set; }

        public string ErrorDesc { get; set; }

        public int Value { get; set; }

        public bool Disabled { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateFormatted
        {
            get { return CreatedDate.ToString("MM/dd/yyyy HH:mm:ss"); }
        }

        public string CreatedBy { get; set; }
    }
}
