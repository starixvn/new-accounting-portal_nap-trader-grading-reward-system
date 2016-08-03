namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    using System;

    public class Issue
    {
        private DateTime _updatedDate;

        public string CreatedDate
        {
            get { return _updatedDate.ToString("MM/dd/yyyy HH:mm:ss"); }
            set { _updatedDate = DateTime.Parse(value); }
        }

        public int Value { get; set; }

        public string Reason { get; set; }

        public string CreatedBy { get; set; }
    }
}