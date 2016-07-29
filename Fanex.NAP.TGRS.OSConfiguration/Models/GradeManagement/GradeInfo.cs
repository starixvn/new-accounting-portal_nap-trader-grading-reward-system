namespace Fanex.NAP.TGRS.OSConfiguration.Models.GradeManagement
{
    using System;

    public class GradeInfo
    {
        public int GradeId { get; set; }

        public string GradeName { get; set; }

        public int TraderCount { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("dd-MM-yyyy hh:mm:ss");
            }
        }
    }
}