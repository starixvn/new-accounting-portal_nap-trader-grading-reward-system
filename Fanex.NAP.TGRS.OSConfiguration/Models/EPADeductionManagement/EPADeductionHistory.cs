namespace Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement
{
    using System;

    public class EPADeductionHistory
    {
        public int DeductionId { get; set; }

        public decimal DeductionValue { get; set; }

        public decimal PointDeduction { get; set; }

        public DateTime DeductionDate { get; set; }

        public string DeductionDateFormatted
        {
            get
            {
                return DeductionDate.ToString("MM/dd/yyyy");
            }
        }

        public string Reason { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("MM/dd/yyyy hh:mm:ss");
            }
        }
    }
}
