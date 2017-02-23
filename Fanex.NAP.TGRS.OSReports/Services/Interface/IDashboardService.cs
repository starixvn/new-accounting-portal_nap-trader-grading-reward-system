namespace Fanex.NAP.TGRS.OSReports.Services
{
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;
    using System.Collections.Generic;

    public interface IDashboardService
    {
        IEnumerable<TopSport> GetTopNBestSports(int numOfMonth, int numberOfBestSport);

        IEnumerable<TopTrader> GetTopNWorstTraders(int numOfMonth, int numOfWorstTrader);

        IEnumerable<DataByMonth> GetDataByMonth(int numOfMonth);

        IEnumerable<DataByMonth> GetDataByMonthLastYear(int numOfMonth);
    }
}