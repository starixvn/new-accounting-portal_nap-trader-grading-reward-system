namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.RTModelPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail;
    using System.Collections.Generic;

    public interface IRTModelPerformanceDetailService
    {
        Dictionary<int, string> GetLeagueGroups();

        BetTypeList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria);

        byte[] ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        MonthPerformanceList GetMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);
    }
}