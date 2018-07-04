namespace Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class BettypeMonthlySummary
    {
        [JsonIgnore]
        public int BettypeId { get; set; }

        public string BettypeName { get; set; }

        public Summary FstHalf { get; set; }

        public Summary SndHalf { get; set; }

        public Summary FullYear { get; set; }

        public IDictionary<string, Summary> Months { get; set; }
    }
}