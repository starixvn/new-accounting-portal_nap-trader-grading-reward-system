namespace Fanex.NAP.TGRS.Reports.ViewModels.Dashboard
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
