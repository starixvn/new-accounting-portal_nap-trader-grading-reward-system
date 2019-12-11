namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;

    [Serializable]
    public class TeamItem
    {
        public TeamItem(TeamInfo teamData)
        {
            if (teamData != null)
            {
                this.TeamId = teamData.TeamId;
                this.TeamName = teamData.TeamName;
            }
        }

        public short TeamId { get; set; }

        public string TeamName { get; set; }
    }
}