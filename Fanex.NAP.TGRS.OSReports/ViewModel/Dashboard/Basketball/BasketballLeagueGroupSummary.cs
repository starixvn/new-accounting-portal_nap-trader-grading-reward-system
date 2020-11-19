namespace Fanex.NAP.TGRS.OSReports.ViewModels.Dashboard
{
    using System;

    [Serializable]
    public class BasketballLeagueGroupSummary
    {
        public int GroupID { get; set; }

        public string GroupName { get; set; }

        public decimal Margin { get; set; }
    }
}
