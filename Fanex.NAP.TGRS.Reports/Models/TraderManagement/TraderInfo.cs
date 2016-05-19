namespace Fanex.NAP.TGRS.Reports.Models.TraderManagement
{
    using System;

    public class TraderInfo
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public string EmployeeId { get; set; }

        public string TeamName { get; set; }

        public string Grade { get; set; }

        public DateTime CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedUsername { get; set; }

        public DateTime TeamEffectiveDate { get; set; }

        public DateTime GradeEffectiveDate { get; set; }
    }
}
