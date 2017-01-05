namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewLeaguePerformance";

        public IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<LeaguePerformanceInfo>(criteria);

            result = result ?? new List<LeaguePerformanceInfo>();

            SessionManager.Set<IEnumerable<LeaguePerformanceInfo>>(LeaguePerformanceDetailReportSessionKey, result);

            return result;
        }
    }
}