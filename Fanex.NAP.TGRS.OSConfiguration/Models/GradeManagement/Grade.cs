namespace Fanex.NAP.TGRS.OSConfiguration.Models.GradeManagement
{
    using System;

    public class Grade
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int NoOfTrader { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Creator { get; set; }
    }
}