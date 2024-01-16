namespace Fanex.MAP.TGRS.WebAPI.Service
{
    using Fanex.Data;
    using Fanex.MAP.TGRS.WebAPI.Criteria.LeaguePerformance;
    using Fanex.MAP.TGRS.WebAPI.Model.LeaguePerformance;
    using Fanex.MAP.TGRS.WebAPI.ViewModel;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Collections.Generic;

    public interface ILeaguePerformanceService
    {
        IEnumerable<LeaguePerformanceModel> GetLeaguePerformance(GetLeaguePerformanceParam param);
    }

    public class LeaguePerformanceService : ILeaguePerformanceService
    {
        public IEnumerable<LeaguePerformanceModel> GetLeaguePerformance(GetLeaguePerformanceParam param)
        {
            var criteria = new GetLeaguePerformanceCriteria
            {
                FromDate = param.FromDate,
                ToDate = param.ToDate,
                SportName = param.SportType,
                LeagueName = string.Join(",", param.LeagueName)
            };

            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
               return db.Query<LeaguePerformanceModel>(criteria);
            }
        }
    }
}