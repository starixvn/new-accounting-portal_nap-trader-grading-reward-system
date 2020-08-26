namespace Fanex.NAP.TGRS.OSReports.Services
{
    using Fanex.NAP.TGRS.OSReports.Criteria.Dashboard;
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;
    using Fanex.NAP.TGRS.OSReports.ViewModel;
    using Fanex.NAP.TGRS.OSReports.ViewModel.Dashboard;
    using System.Collections.Generic;

    public interface IDashboardService
    {
        IEnumerable<TopSport> GetTopNBestSports(int numOfMonth, int numberOfBestSport);

        IEnumerable<TopTrader> GetTopNWorstTraders(int numOfMonth, int numOfWorstTrader);

        IEnumerable<DataByMonth> GetDataByMonth(int numOfMonth);

        IEnumerable<DataByMonth> GetDataByMonthLastYear(int numOfMonth);

        IEnumerable<DataByMonth> GetDataByTeam(int numOfMonth);

        IEnumerable<DataByMonth> GetDataByRegion(int numOfMonth);

        IEnumerable<OSSport> GetOSSports();

        IEnumerable<OSTraderSummary> GetOSTraderSummary(GetOSTraderSummaryCriteria criteria);

        IEnumerable<OSSportLeagueSummary> GetOSSportSummary(GetOSSportSummaryCriteria criteria);

        IEnumerable<OSSportLeagueSummary> GetOSLeagueSummary(GetOSLeagueSummaryCriteria criteria);        

        OSSummaryGeneralInfo GetOSSummaryInfo(GetOSSummaryGeneralCriteria criteria);
        
    }
}