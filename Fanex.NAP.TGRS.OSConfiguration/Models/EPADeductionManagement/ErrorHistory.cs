namespace Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement
{
    using System;

    public class ErrorHistory
    {
        public int TraderErrorId { get; set; }

        public string ErrorName { get; set; }

        public decimal Value { get; set; }

        public DateTime ErrorDate { get; set; }

        public string ErrorDateFormatted
        {
            get
            {
                return ErrorDate.ToString("MM/dd/yyyy");
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
