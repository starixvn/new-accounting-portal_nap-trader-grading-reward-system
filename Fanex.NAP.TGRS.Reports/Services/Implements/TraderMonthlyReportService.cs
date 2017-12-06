namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;

    internal class TraderMonthlyReportService : TGRSBaseService, ITraderMonthlyReport
    {
        public SummaryList GetReports(MonthlyFilter filter)
        {
            using (var db = new ObjectDb(filter.GetSettingKey()))
            {
                using (var multi = db.QueryMultiple(filter))
                {
                    var traders = multi.Read<Trader>();

                    if(filter.Bettype != (int)Bettype.All)
                    {
                        foreach (var trader in traders)
                        {
                            trader.Product = filter.Bettype.ToString();
                        }
                    }

                    var fstHalves = multi.Read<AvgSummary>();
                    var sndHalves = multi.Read<AvgSummary>();

                    var years = multi.Read<YearSummary>();
                    var months = multi.Read<MonthSummary>();

                    return new SummaryList(traders, fstHalves, sndHalves, years, months);
                }
            }
        }
    }
}