namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Fanex.NAP.TGRS.OSReports.ViewModel.SportPerformance;
    using System.Collections.Generic;
    using System.Linq;

    public class SportPerformanceService : TGRSBaseService, ISportPerformanceService
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
            var result = new List<BettypePerformanceItem>();
            var infos = this.GetData<BettypePerformanceInfo>(criteria);

            if (infos != null && infos.Any())
            {
                foreach (var item in infos)
                {
                    result.Add(new BettypePerformanceItem(item));
                }
            }

            return result;
        }

        public List<RegionPerformanceItem> GetRegionPerformances(GetRegionBySportCriteria criteria)
        {
            var result = this.GetData<RegionPerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<RegionPerformanceItem>();
        }
    }
}
