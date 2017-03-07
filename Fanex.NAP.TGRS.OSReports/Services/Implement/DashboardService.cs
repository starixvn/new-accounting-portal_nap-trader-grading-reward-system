namespace Fanex.NAP.TGRS.OSReports.Services
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.Dashboard;
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class DashboardService : TGRSBaseService, IDashboardService
    {
        public IEnumerable<TopSport> GetTopNBestSports(int numOfMonth, int numberOfBestSport)
        {
            var thisMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var criteria = new GetTopNBestSportCriteria
            {
                FromDate = thisMonth.AddMonths(-numOfMonth + 1),
                ToDate = thisMonth,
                Top = numberOfBestSport
            };

            var result = this.GetData<TopSport>(criteria);

            return result;
        }

        public IEnumerable<TopTrader> GetTopNWorstTraders(int numOfMonth, int numOfWorstTrader)
        {
            var thisMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var criteria = new GetTopNWorstTraderCriteria
            {
                FromDate = thisMonth.AddMonths(-numOfMonth + 1),
                ToDate = thisMonth,
                Top = numOfWorstTrader
            };

            var result = this.GetData<TopTrader>(criteria);

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByMonth(int numOfMonth)
        {
            var thisMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var criteria = new GetDataByMonthCriteria
            {
                FromDate = thisMonth.AddMonths(-numOfMonth + 1),
                ToDate = thisMonth
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            for (var i = 0; i < numOfMonth; i++)
            {
                if (!result.Exists(t => t.Month == thisMonth.Month && t.Year == thisMonth.Year))
                {
                    result.Add(new DataByMonth
                    {
                        EventDate = thisMonth
                    });
                }

                thisMonth = thisMonth.AddMonths(-1);
            }

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByMonthLastYear(int numOfMonth)
        {
            var thisMonthLastYear = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, 1);

            var criteria = new GetDataByMonthCriteria
            {
                FromDate = thisMonthLastYear.AddMonths(-numOfMonth + 1),
                ToDate = thisMonthLastYear
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            for (var i = 0; i < numOfMonth; i++)
            {
                if (!result.Exists(t => t.Month == thisMonthLastYear.Month && t.Year == thisMonthLastYear.Year))
                {
                    result.Add(new DataByMonth
                    {
                        EventDate = thisMonthLastYear
                    });
                }

                thisMonthLastYear = thisMonthLastYear.AddMonths(-1);
            }

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByTeam(int numOfMonth)
        {
            var thisMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var criteria = new GetDataByTeamCriteria
            {
                FromDate = thisMonth.AddMonths(-numOfMonth + 1),
                ToDate = thisMonth
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByRegion(int numOfMonth)
        {
            var thisMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var criteria = new GetDataByRegionCriteria
            {
                FromDate = thisMonth.AddMonths(-numOfMonth + 1),
                ToDate = thisMonth
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            return result;
        }
    }
}