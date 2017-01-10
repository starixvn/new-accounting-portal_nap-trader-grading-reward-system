namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string BetTypePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewBetTypePerformance";

        public IEnumerable<BetTypePerformanceInfo> GetBetTypePerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypePerformanceInfo>(criteria);

            result = result ?? new List<BetTypePerformanceInfo>();

            SessionManager.Set<IEnumerable<BetTypePerformanceInfo>>(BetTypePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<BetTypeLeaguePerformanceInfo> GetBetTypeLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeaguePerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeaguePerformanceInfo>();

            return result;
        }

        public IEnumerable<BetTypeLeagueTraderPerformanceInfo> GetBetTypeLeagueTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<BetTypeLeagueTraderMatchPerformanceInfo> GetBetTypeLeagueTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<BetTypeTraderPerformanceInfo> GetBetTypeTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeTraderPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeTraderPerformanceInfo>();

            return result;
        }

        public Dictionary<string, IEnumerable<BetTypeTraderMatchPerformanceInfo>> GetBetTypeTraderMatchPerformance(ICriteria criteria)
        {
            var data = this.GetData<BetTypeTraderMatchPerformanceInfo>(criteria);
            var result = new Dictionary<string, IEnumerable<BetTypeTraderMatchPerformanceInfo>>();

            data = data ?? new List<BetTypeTraderMatchPerformanceInfo>();

            if (data.Count() > 0)
            {
                var groups = data.GroupBy(t => t.LeagueId);
                foreach (var group in groups)
                {
                    var leagueName = CacheRef.GetLeagueName(group.Key);
                    if (string.IsNullOrEmpty(leagueName))
                    {
                        leagueName = group.Key.ToString();
                    }

                    result.Add(leagueName, group.Select(t => t));
                }
            }

            return result;
        }
    }
}