namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    using System;

    public class History
    {
        private DateTime _updatedDate;

        public string UpdatedDate
        {
            get { return _updatedDate.ToString("MM/dd/yyyy"); }
            set { _updatedDate = DateTime.Parse(value); }
        }

        public string UpdatedBy { get; set; }
    }
}