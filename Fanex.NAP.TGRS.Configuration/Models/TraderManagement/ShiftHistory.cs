using System;

namespace Fanex.NAP.TGRS.Configuration.Models.TraderManagement
{
    public class ShiftHistory
    {
        public string ShiftName { get; set; }

        public DateTime BeginDate { get; set; }

        public string EffectiveDate
        {
            get
            {
                return BeginDate.ToShortDateString();
            }
        }
    }
}