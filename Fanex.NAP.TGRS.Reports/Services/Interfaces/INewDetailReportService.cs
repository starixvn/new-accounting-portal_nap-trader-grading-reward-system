namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public interface INewDetailReportService
    {
        IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria);
    }
}