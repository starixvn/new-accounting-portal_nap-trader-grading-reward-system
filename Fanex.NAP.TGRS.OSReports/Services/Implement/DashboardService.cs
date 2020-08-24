namespace Fanex.NAP.TGRS.OSReports.Services
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.Dashboard;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;
    using Fanex.NAP.TGRS.OSReports.ViewModel;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
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

        public IEnumerable<OSSport> GetOSSports()
        {
            var criteria = new GetAllSportsCriteria();
            var data = this.GetData<OSSport>(criteria);

            if (data != null && data.Any())
            {
                data = data.Where(x => x.SportId != 1 && x.SportId != 2);
            }

            return data;
        }

        public OSSummaryGeneralInfo GetOSSummaryInfo(GetOSSummaryGeneralCriteria criteria)
        {
            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetOSSummaryGeneralCriteria;

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var items = multi.Read<OSSummaryGeneralInfoItem>();
                    var avgItems = multi.Read<OSSummaryGeneralInfoAvgItem>();

                    return criteria.ReportType == 1
                        ? GetOSSummaryByDate(criteria, items, avgItems)
                        : GetOSSummaryByMonth(criteria, items, avgItems);
                }
            }
        }

        private OSSummaryGeneralInfo GetOSSummaryByDate(GetOSSummaryGeneralCriteria criteria
            , IEnumerable<OSSummaryGeneralInfoItem> items
            , IEnumerable<OSSummaryGeneralInfoAvgItem> avgItems)
        {
            var osSummaryInfo = new OSSummaryGeneralInfo();

            if (items != null && items.Any())
            {
                var daysList = new List<Column>();
                var comparisonDayList = new List<Column>();
                var fromDate = criteria.FromDate;
                var comparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, criteria.FromDate.Day);
                var comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, criteria.ToDate.Day);
                var isCrossMonth = !criteria.FromDate.Month.Equals(criteria.ToDate.Month);

                if (isCrossMonth)
                {
                    var daysInMonth = DateTime.DaysInMonth(criteria.FromDate.Year, criteria.FromDate.Month);
                    var crossToDate = new DateTime(criteria.FromDate.Year, criteria.FromDate.Month, daysInMonth);
                    daysList.AddRange(GenerateDayList(fromDate, crossToDate));

                    var crossComparisonDaysInMonth = DateTime.DaysInMonth(criteria.FromDate.Year - 1, criteria.FromDate.Month);
                    var crossComparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, criteria.FromDate.Day);
                    var crossComparisonToDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, crossComparisonDaysInMonth);
                    comparisonDayList.AddRange(GenerateDayList(crossComparisonFromDate, crossComparisonToDate));

                    fromDate = new DateTime(criteria.ToDate.Year, criteria.ToDate.Month, 1);
                    comparisonFromDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);
                    comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, criteria.ToDate.Day);
                }

                daysList.AddRange(GenerateDayList(fromDate, criteria.ToDate));
                comparisonDayList.AddRange(GenerateDayList(comparisonFromDate, comparisonToDate));

                osSummaryInfo.WinLossList = GetBasketballColumnsByDate(items, daysList, OSChartName.WinLoss);
                osSummaryInfo.WinLossComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.WinLoss);
                osSummaryInfo.TurnoverList = GetBasketballColumnsByDate(items, daysList, OSChartName.Turnover);
                osSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.Turnover);
                osSummaryInfo.MarginList = GetBasketballColumnsByDate(items, daysList, OSChartName.Margin);
                osSummaryInfo.MarginComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.Margin);
                osSummaryInfo.BetCountList = GetBasketballColumnsByDate(items, daysList, OSChartName.BetCount);
                osSummaryInfo.BetCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.BetCount);
                osSummaryInfo.MatchCountList = GetBasketballColumnsByDate(items, daysList, OSChartName.MatchCount);
                osSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.MatchCount);
            }

            osSummaryInfo = BindBasketballSummaryAverage(osSummaryInfo, criteria, avgItems);

            return osSummaryInfo;
        }

        private OSSummaryGeneralInfo GetOSSummaryByMonth(GetOSSummaryGeneralCriteria criteria
            , IEnumerable<OSSummaryGeneralInfoItem> items
            , IEnumerable<OSSummaryGeneralInfoAvgItem> avgItems)
        {
            var osSummaryInfo = new OSSummaryGeneralInfo();

            osSummaryInfo.IsCrossYear = !criteria.FromDate.Year.Equals(criteria.ToDate.Year);

            if (items != null && items.Any())
            {
                var fromDate = criteria.FromDate;
                var comparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, 1);
                var comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);

                if (osSummaryInfo.IsCrossYear)
                {
                    var crossToDate = new DateTime(criteria.FromDate.Year, 12, 1);
                    var crossComparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, 1);
                    var crossComparisonToDate = new DateTime(criteria.FromDate.Year - 1, 12, 1);
                    var crossMonthYearList = GenerateMonthYearList(criteria.FromDate, crossToDate);
                    var crossComparisonMonthYearList = GenerateMonthYearList(crossComparisonFromDate, crossComparisonToDate);

                    osSummaryInfo.WinLossCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.WinLoss);
                    osSummaryInfo.WinLossCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.WinLoss);
                    osSummaryInfo.TurnoverCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.Turnover);
                    osSummaryInfo.TurnoverCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Turnover);
                    osSummaryInfo.MarginCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.Margin);
                    osSummaryInfo.MarginCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Margin);
                    osSummaryInfo.BetCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.BetCount);
                    osSummaryInfo.BetCountCrossComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.BetCount);
                    osSummaryInfo.MatchCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.MatchCount);
                    osSummaryInfo.MatchCountCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.MatchCount);

                    fromDate = new DateTime(criteria.ToDate.Year, 1, 1);
                    comparisonFromDate = new DateTime(criteria.ToDate.Year - 1, 1, 1);
                    comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);
                }

                var monthYearList = GenerateMonthYearList(fromDate, criteria.ToDate);
                var comparisonMonthYearList = GenerateMonthYearList(comparisonFromDate, comparisonToDate);
                osSummaryInfo.WinLossList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.WinLoss);
                osSummaryInfo.WinLossComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.WinLoss);
                osSummaryInfo.TurnoverList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.Turnover);
                osSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.Turnover);
                osSummaryInfo.MarginList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.Margin);
                osSummaryInfo.MarginComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.Margin);
                osSummaryInfo.BetCountList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.BetCount);
                osSummaryInfo.BetCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.BetCount);
                osSummaryInfo.MatchCountList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.MatchCount);
                osSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.MatchCount);
            }

            osSummaryInfo = BindBasketballSummaryAverage(osSummaryInfo, criteria, avgItems);

            return osSummaryInfo;
        }

        private OSSummaryGeneralInfo BindBasketballSummaryAverage(OSSummaryGeneralInfo osSummaryInfo
            , GetOSSummaryGeneralCriteria criteria
            , IEnumerable<OSSummaryGeneralInfoAvgItem> avgItems)
        {
            if (avgItems != null && avgItems.Any())
            {
                var avgComparison = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year - 1));

                if (avgComparison != null)
                {
                    if (osSummaryInfo.IsCrossYear)
                    {
                        osSummaryInfo.LegendList.Add(avgComparison.ToDate.Year - 1);
                    }

                    osSummaryInfo.WinLossAverageComparison = avgComparison.AvgWinLoss;
                    osSummaryInfo.TurnoverAverageComparison = avgComparison.AvgTurnover;
                    osSummaryInfo.MarginAverageComparison = avgComparison.AvgMargin;
                    osSummaryInfo.BetCountAverageComparison = avgComparison.AvgBetCount;
                    osSummaryInfo.MatchCountAverageComparison = avgComparison.AvgMatchCount;
                    osSummaryInfo.LegendList.Add(avgComparison.ToDate.Year);
                }

                var avgCurrentYear = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year));

                if (avgCurrentYear != null)
                {
                    osSummaryInfo.WinLossAverage = avgCurrentYear.AvgWinLoss;
                    osSummaryInfo.TurnoverAverage = avgCurrentYear.AvgTurnover;
                    osSummaryInfo.MarginAverage = avgCurrentYear.AvgMargin;
                    osSummaryInfo.BetCountAverage = avgCurrentYear.AvgBetCount;
                    osSummaryInfo.MatchCountAverage = avgCurrentYear.AvgMatchCount;
                    osSummaryInfo.LegendList.Add(avgCurrentYear.ToDate.Year);
                }
            }

            return osSummaryInfo;
        }

        private decimal GetValue(OSSummaryGeneralInfoItem item, OSChartName type)
        {
            if (item != null)
            {
                switch (type)
                {
                    case OSChartName.WinLoss:
                        return item.WinLoss;
                    case OSChartName.Margin:
                        return item.Margin;
                    case OSChartName.Turnover:
                        return item.Turnover;
                    case OSChartName.BetCount:
                        return item.BetCount;
                    case OSChartName.MatchCount:
                        return item.MatchCount;
                    default:
                        return 0;
                }
            }

            return 0;
        }

        private GetOSSummaryGeneralCriteria GenerateCriteriaRangeDate(GetOSSummaryGeneralCriteria criteria)
        {
            var toDate = DateTime.Today;
            var fromDate =
                criteria.DayType == DayType.Today
                ? toDate
                : (criteria.DayType == DayType.Days7
                    ? toDate.AddDays(-7)
                    : toDate.AddDays(-30)
                );

            criteria.FromDate = fromDate;
            criteria.ToDate = toDate;

            return criteria;
        }

        private List<Column> GenerateDayList(DateTime fromDate, DateTime toDate)
        {
            var dayList = new List<Column>();

            for (int i = fromDate.Day; i <= toDate.Day; i++)
            {
                dayList.Add(new Column
                {
                    GroupName = '-' + fromDate.Year.ToString(),
                    Name = i.ToString() + "-" + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(fromDate.Month).Substring(0, 3),
                    Value = 0,
                    Day = i,
                    Month = fromDate.Month,
                    Year = fromDate.Year
                });
            }

            return dayList;
        }

        private List<Column> GenerateMonthYearList(DateTime fromDate, DateTime toDate)
        {
            var monthList = new List<Column>();
            var year = fromDate.Year;

            for (int i = fromDate.Month; i <= toDate.Month; i++)
            {
                monthList.Add(new Column
                {
                    GroupName = "-" + year.ToString(),
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i).Substring(0, 3),
                    Value = 0,
                    Month = i,
                    Year = year
                });
            }

            return monthList;
        }

        private IEnumerable<Column> GetBasketballColumnsByMonth(IEnumerable<OSSummaryGeneralInfoItem> infoList
            , List<Column> monthYearList
            , OSChartName type)
        {
            return monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                    y => y.EventDate.Month.Equals(x.Month)
                        && y.EventDate.Year.Equals(x.Year)), type)
            });
        }

        private IEnumerable<Column> GetBasketballColumnsByDate(IEnumerable<OSSummaryGeneralInfoItem> infoList
            , List<Column> dayList
            , OSChartName type)
        {
            return dayList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Day = x.Day,
                Value = GetValue(infoList.FirstOrDefault(
                    y => y.EventDate.Day.Equals(x.Day)
                        && y.EventDate.Month.Equals(x.Month)
                        && y.EventDate.Year.Equals(x.Year)), type)
            });
        }

    }
}