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
            var criteria = new GetTopNBestSportCriteria
            {
                FromDate = DateTime.Now.AddMonths(-numOfMonth + 1),
                ToDate = DateTime.Now,
                Top = numberOfBestSport
            };

            var result = this.GetData<TopSport>(criteria);

            return result;
        }

        public IEnumerable<TopTrader> GetTopNWorstTraders(int numOfMonth, int numOfWorstTrader)
        {
            var criteria = new GetTopNWorstTraderCriteria
            {
                FromDate = DateTime.Now.AddMonths(-numOfMonth + 1),
                ToDate = DateTime.Now,
                Top = numOfWorstTrader
            };

            var result = this.GetData<TopTrader>(criteria);

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByMonth(int numOfMonth)
        {
            var today = DateTime.Now;

            var criteria = new GetDataByMonthCriteria
            {
                FromDate = today.AddMonths(-numOfMonth + 1),
                ToDate = today
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            for (var i = 0; i < numOfMonth; i++)
            {
                if (!result.Exists(t => t.Month == today.Month && t.Year == today.Year))
                {
                    result.Add(new DataByMonth
                    {
                        Month = today.Month,
                        Year = today.Year
                    });
                }

                today = today.AddMonths(-1);
            }

            return result;
        }

        public IEnumerable<DataByMonth> GetDataByMonthLastYear(int numOfMonth)
        {
            var today = DateTime.Now.AddYears(-1);

            var criteria = new GetDataByMonthCriteria
            {
                FromDate = today.AddMonths(-numOfMonth + 1),
                ToDate = today
            };

            var result = this.GetData<DataByMonth>(criteria).ToList();

            for (var i = 0; i < numOfMonth; i++)
            {
                if (!result.Exists(t => t.Month == today.Month && t.Year == today.Year))
                {
                    result.Add(new DataByMonth
                    {
                        Month = today.Month,
                        Year = today.Year
                    });
                }

                today = today.AddMonths(-1);
            }

            return result;
        }
    }
}