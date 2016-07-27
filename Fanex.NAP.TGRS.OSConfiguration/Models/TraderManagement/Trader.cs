namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    using System;

    public class Trader
    {
        public int UserId { get; set; }

        public int EmployeeId { get; set; }

        public string Team { get; set; }

        public string Grade { get; set; }

        public int EPADeduction { get; set; }

        public int Error { get; set; }

        public DateTime FirstWorkingDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Creator { get; set; }
    }
}