namespace Fanex.NAP.TGRS.Configuration.Models.TraderManagement
{
    using Fanex.NAP.Core.Web;
    using System;

    public class ShiftHistory
    {
        public string ShiftName { get; set; }

        public DateTime BeginDate { get; set; }

        public string EffectiveDate
        {
            get
            {
                return BeginDate.ToShortFormatedDate();
            }
        }
    }
}