namespace Fanex.MAP.TGRS.WebAPI.ViewModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    public class GetLeaguePerformanceParam
    {
        public string SportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public List<string> LeagueName { get; set; }
    }
}