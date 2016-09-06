namespace Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement
{
    using System;

    public class LeaveHistory
    {
        public int LeaveId { get; set; }

        public DateTime LeaveDate { get; set; }

        public string LeaveDateFormatted
        {
            get
            {
                return LeaveDate.ToString("MM/dd/yyyy");
            }
        }

        public string Reason { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("MM/dd/yyyy");
            }
        }
    }
}
