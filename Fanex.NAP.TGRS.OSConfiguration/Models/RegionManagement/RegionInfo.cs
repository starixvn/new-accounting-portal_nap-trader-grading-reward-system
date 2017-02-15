namespace Fanex.NAP.TGRS.OSConfiguration.Models.RegionManagement
{
    using System;

    public class RegionInfo
    {
        public int RegionId { get; set; }

        public string RegionName { get; set; }

        public int LeagueCount { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("MM/dd/yyyy hh:mm:ss");
            }
        }
    }
}