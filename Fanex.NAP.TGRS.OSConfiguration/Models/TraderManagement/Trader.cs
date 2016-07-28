namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    public class Trader
    {
        public Trader()
        {
            Username = "adfadf";
            Team = "adfadf";
            FirstWorkingDate = "adfadf";
            CreatedDate = "adfadf";
            Creator = "adfadf";
        }

        public int TraderId { get; set; }

        public string Username { get; set; }

        public int EmployeeId { get; set; }

        public string Team { get; set; }

        public string Grade { get; set; }

        public int EPADeduction { get; set; }

        public int Error { get; set; }

        public string FirstWorkingDate { get; set; }

        public string CreatedDate { get; set; }

        public string Creator { get; set; }
    }
}