namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string GradePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewGradePerformance";
        private const int PointInPixel = 225;

        public IEnumerable<GradePerformanceInfo> GetGradePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradePerformanceInfo>(criteria);

            result = result ?? new List<GradePerformanceInfo>();

            SessionManager.Set<IEnumerable<GradePerformanceInfo>>(GradePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<GradeLeaguePerformanceInfo> GetGradeLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeaguePerformanceInfo>(criteria);

            result = result ?? new List<GradeLeaguePerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueTraderPerformanceInfo> GetGradeLeagueTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueTraderMatchPerformanceInfo> GetGradeLeagueTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueMatchBettypePerformanceInfo> GetGradeLeagueTraderMatchBettypePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueMatchBettypePerformanceInfo>();

            return result;
        }

        #region Private
        
        #endregion Private
    }
}