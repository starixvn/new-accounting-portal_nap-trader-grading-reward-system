using System;

namespace Fanex.NAP.TGRS.OSConfiguration.DataAccess.TeamManagement
{
    public class Team
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int NoOfTrader { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Creator { get; set; }
    }
}