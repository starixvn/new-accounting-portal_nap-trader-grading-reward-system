namespace Fanex.NAP.TGRS.WebAPI.InputModel
{
    using System;

    public class TraderPerformanceParam
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string TraderIds { get; set; }

        public string MajorBettypeIds { get; set; }
    }
}