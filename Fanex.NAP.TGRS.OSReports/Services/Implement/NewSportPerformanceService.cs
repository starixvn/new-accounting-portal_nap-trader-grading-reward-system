namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.NewSportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.NewSportPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class NewSportPerformanceService : TGRSBaseService, INewSportPerformanceService
    {
        public List<Sport> GetAllSport()
        {
            var result = this.GetData<Sport>(new GetAllSportsCriteria());

            return result != null ? result.ToList() : new List<Sport>();
        }

        public List<SportPerformanceItem> GetSportPerformance(GetSportPerformanceCriteria criteria)
        {
            var result = this.GetData<SportPerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<SportPerformanceItem>();
        }

        public List<LeaguePerformanceItem> GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            var result = this.GetData<LeaguePerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<LeaguePerformanceItem>();
        }

        public List<BettypePerformanceItem> GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var result = this.GetData<BettypePerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<BettypePerformanceItem>();
        }

        public List<RegionPerformanceItem> GetRegionPerformances(GetRegionBySportCriteria criteria)
        {
            var result = this.GetData<RegionPerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<RegionPerformanceItem>();
        }
    }
}
