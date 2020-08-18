namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;    
    using Fanex.NAP.TGRS.Reports.Criteria.Dashboard;
    using Fanex.NAP.TGRS.Reports.Criteria.GetSummaryInfoCriteria;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Dashboard;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class DashboardService : TGRSBaseService, IDashboardService
    {

        public bool IsExcludeLeagueStatus;

        public DashboardService(bool isExcludeLeague)
        {
            IsExcludeLeagueStatus = isExcludeLeague;
        }

        /// <summary>
        /// Gets the general information.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// General info list.
        /// </returns>
        public IEnumerable<GeneralInfo> GetGeneralInfo(int month, int permission)
        {
            IEnumerable<GeneralInfo> result = null;

            var summaryCriteria = new GetGeneralInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };
            result = this.GetData<GeneralInfo>(summaryCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top win league.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List of league.
        /// </returns>
        public IEnumerable<League> GetTopWinLeague(int month, int permission)
        {
            var topLeagueCriteria = new GetTopWinLeagueCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<League> result = this.GetData<League>(topLeagueCriteria);

            result = result.Take(5);

            return result;
        }

        /// <summary>
        /// Gets the top trader.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Top Trader.
        /// </returns>
        public IEnumerable<TopTrader> GetTopTrader(int month, int permission)
        {
            var topTraderCriteria = new GetTopTraderCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                Top = 5,
                IsBottom = 0,
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<TopTrader> result = this.GetData<TopTrader>(topTraderCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top bet type.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Bet type.
        /// </returns>
        public IEnumerable<BetTypePerformance> GetTopBettype(int month, int permission)
        {
            var topBettypeCriteria = new GetBetTypePerformanceCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<BetTypePerformance> result = this.GetData<BetTypePerformance>(topBettypeCriteria);

            return result.Take(10);
        }

        /// <summary>
        /// Gets the summary data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Month Items.
        /// </returns>
        public IEnumerable<MonthAmountItem> GetSummaryData(int month, int permission)
        {
            var summaryCriteria = new GetSummaryInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            List<MonthAmount> rawData = this.GetData<MonthAmount>(summaryCriteria).ToList();
            rawData = rawData.OrderBy(x => x.EventDate).ToList();

            var result = new List<MonthAmountItem>();
            foreach (var item in rawData)
            {
                var monthItem = new MonthAmountItem(item);
                result.Add(monthItem);
            }

            return result;
        }

        /// <summary>
        /// Gets the team data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>List of team performance.</returns>
        public IEnumerable<TeamPerformance> GetTeamData(int month, int permission)
        {
            var teamCriteria = new GetTeamPerformanceCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<TeamPerformance> teamData = this.GetData<TeamPerformance>(teamCriteria);

            return teamData;
        }

        #region Basketball summary
        public IEnumerable<BasketballTraderSummary> GetBasketballTraderSummary(GetBasketballTraderSummaryCriteria criteria)
        {
            var traders = new List<BasketballTraderSummary>();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetBasketballTraderSummaryCriteria;

            IEnumerable<BasketballTraderSummaryInfo> data = this.GetData<BasketballTraderSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                traders = data.Select(x => new BasketballTraderSummary
                {
                     TraderName = x.Username,
                     Margin = Math.Round(x.Margin, 2)
                }).ToList();
            }

            return traders;
        }

        public IEnumerable<BasketballLeagueGroupSummary> GetBasketballLeagueGroupSummary(GetBasketballLeagueGroupSummaryCriteria criteria)
        {
            var leagueGroups = new List<BasketballLeagueGroupSummary>();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetBasketballLeagueGroupSummaryCriteria;

            IEnumerable<BasketballLeagueGroupSummaryInfo> data = this.GetData<BasketballLeagueGroupSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                leagueGroups.AddRange(
                    data.Where(x => x.LeagueGroupId >= 42 && x.LeagueGroupId <= 72)
                    .Select(x => new BasketballLeagueGroupSummary
                    {
                        GroupID = x.LeagueGroupId,
                        GroupName = x.GroupName,
                        Margin = Math.Round(x.Margin, 2)
                    }).ToList()
                );

                var groupOthers = data.Where(x => x.LeagueGroupId < 42 || x.LeagueGroupId > 72 || x.LeagueGroupId == 0).Select(x => new BasketballLeagueGroupSummaryInfo
                {
                     LeagueGroupId = -1,
                     WinLoss = x.WinLoss,
                     Turnover = x.Turnover
                });

                if (groupOthers != null && groupOthers.Any())
                {
                    var winloss = groupOthers.Sum(x => x.WinLoss);
                    var turnover = groupOthers.Sum(x => x.Turnover);
                    var others = groupOthers.GroupBy(x => x.LeagueGroupId).Select(x => new BasketballLeagueGroupSummary
                    {
                        GroupID = x.Key,
                        GroupName = "Others",
                        Margin = Math.Round(winloss * 100 / turnover, 2) 
                    });

                    leagueGroups.AddRange(others.Distinct());
                }
            }

            return leagueGroups.OrderBy(x=>x.Margin);
        }

        public BasketballSummaryGeneralInfo GetBasketballSummaryInfo(GetBasketballSummaryGeneralCriteria criteria)
        {
            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetBasketballSummaryGeneralCriteria;

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var items = multi.Read<BasketballSummaryGeneralInfoItem>();
                    var avgItems = multi.Read<BasketballSummaryGeneralInfoAvgItem>();
                  
                    return criteria.ReportType == 1
                        ? GetBasketballSummaryByDate(criteria, items, avgItems)
                        : GetBasketballSummaryByMonth(criteria, items, avgItems);
                }
            }
        }

        private BasketballSummaryGeneralInfo GetBasketballSummaryByDate(GetBasketballSummaryGeneralCriteria criteria
            , IEnumerable<BasketballSummaryGeneralInfoItem> items
            , IEnumerable<BasketballSummaryGeneralInfoAvgItem> avgItems)
        {
            var basketballSummaryInfo = new BasketballSummaryGeneralInfo();

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

                basketballSummaryInfo.WinLossList = GetBasketballColumnsByDate(items, daysList, BasketballChartName.WinLoss);
                basketballSummaryInfo.WinLossComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, BasketballChartName.WinLoss);
                basketballSummaryInfo.TurnoverList = GetBasketballColumnsByDate(items, daysList, BasketballChartName.Turnover);
                basketballSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, BasketballChartName.Turnover);
                basketballSummaryInfo.MarginList = GetBasketballColumnsByDate(items, daysList, BasketballChartName.Margin);
                basketballSummaryInfo.MarginComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, BasketballChartName.Margin);
                basketballSummaryInfo.BetCountList = GetBasketballColumnsByDate(items, daysList, BasketballChartName.BetCount);
                basketballSummaryInfo.BetCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, BasketballChartName.BetCount);
                basketballSummaryInfo.MatchCountList = GetBasketballColumnsByDate(items, daysList, BasketballChartName.MatchCount);
                basketballSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, BasketballChartName.MatchCount);
            }

            basketballSummaryInfo = BindBasketballSummaryAverage(basketballSummaryInfo, criteria, avgItems);

            return basketballSummaryInfo;
        }

        private BasketballSummaryGeneralInfo GetBasketballSummaryByMonth(GetBasketballSummaryGeneralCriteria criteria
            , IEnumerable<BasketballSummaryGeneralInfoItem> items
            , IEnumerable<BasketballSummaryGeneralInfoAvgItem> avgItems)
        {
            var basketballSummaryInfo = new BasketballSummaryGeneralInfo();

            basketballSummaryInfo.IsCrossYear = !criteria.FromDate.Year.Equals(criteria.ToDate.Year);

            if (items != null && items.Any())
            {
                var fromDate = criteria.FromDate;
                var comparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, 1);
                var comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);

                if (basketballSummaryInfo.IsCrossYear)
                {
                    var crossToDate = new DateTime(criteria.FromDate.Year, 12, 1);
                    var crossComparisonFromDate = new DateTime(criteria.FromDate.Year - 1, criteria.FromDate.Month, 1);
                    var crossComparisonToDate = new DateTime(criteria.FromDate.Year - 1, 12, 1);
                    var crossMonthYearList = GenerateMonthYearList(criteria.FromDate, crossToDate);
                    var crossComparisonMonthYearList = GenerateMonthYearList(crossComparisonFromDate, crossComparisonToDate);

                    basketballSummaryInfo.WinLossCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, BasketballChartName.WinLoss);
                    basketballSummaryInfo.WinLossCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, BasketballChartName.WinLoss);
                    basketballSummaryInfo.TurnoverCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, BasketballChartName.Turnover);
                    basketballSummaryInfo.TurnoverCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, BasketballChartName.Turnover);
                    basketballSummaryInfo.MarginCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, BasketballChartName.Margin);
                    basketballSummaryInfo.MarginCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, BasketballChartName.Margin);
                    basketballSummaryInfo.BetCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, BasketballChartName.BetCount);
                    basketballSummaryInfo.BetCountCrossComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, BasketballChartName.BetCount);
                    basketballSummaryInfo.MatchCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, BasketballChartName.MatchCount);
                    basketballSummaryInfo.MatchCountCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, BasketballChartName.MatchCount);

                    fromDate = new DateTime(criteria.ToDate.Year, 1, 1);
                    comparisonFromDate = new DateTime(criteria.ToDate.Year - 1, 1, 1);
                    comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);
                }

                var monthYearList = GenerateMonthYearList(fromDate, criteria.ToDate);
                var comparisonMonthYearList = GenerateMonthYearList(comparisonFromDate, comparisonToDate);
                basketballSummaryInfo.WinLossList = GetBasketballColumnsByMonth(items, monthYearList, BasketballChartName.WinLoss);
                basketballSummaryInfo.WinLossComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, BasketballChartName.WinLoss);
                basketballSummaryInfo.TurnoverList = GetBasketballColumnsByMonth(items, monthYearList, BasketballChartName.Turnover);
                basketballSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, BasketballChartName.Turnover);
                basketballSummaryInfo.MarginList = GetBasketballColumnsByMonth(items, monthYearList, BasketballChartName.Margin);
                basketballSummaryInfo.MarginComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, BasketballChartName.Margin);
                basketballSummaryInfo.BetCountList = GetBasketballColumnsByMonth(items, monthYearList, BasketballChartName.BetCount);
                basketballSummaryInfo.BetCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, BasketballChartName.BetCount);
                basketballSummaryInfo.MatchCountList = GetBasketballColumnsByMonth(items, monthYearList, BasketballChartName.MatchCount);
                basketballSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, BasketballChartName.MatchCount);
            }

            basketballSummaryInfo = BindBasketballSummaryAverage(basketballSummaryInfo, criteria, avgItems);

            return basketballSummaryInfo;
        }

        private BasketballSummaryGeneralInfo BindBasketballSummaryAverage(BasketballSummaryGeneralInfo basketballSummaryInfo
            , GetBasketballSummaryGeneralCriteria criteria
            , IEnumerable<BasketballSummaryGeneralInfoAvgItem> avgItems)
        {
            if (avgItems != null && avgItems.Any())
            {
                if (basketballSummaryInfo.IsCrossYear)
                {
                    var avgCrossYear = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year - 1));

                    if (avgCrossYear != null)
                    {
                        basketballSummaryInfo.WinLossAverageComparison = avgCrossYear.AvgWinLoss;
                        basketballSummaryInfo.TurnoverAverageComparison = avgCrossYear.AvgTurnover;
                        basketballSummaryInfo.MarginAverageComparison = avgCrossYear.AvgMargin;
                        basketballSummaryInfo.BetCountAverageComparison = avgCrossYear.AvgBetCount;
                        basketballSummaryInfo.MatchCountAverageComparison = avgCrossYear.AvgMatchCount;
                        basketballSummaryInfo.LegendList.Add(avgCrossYear.FromDate.Year);
                    }
                }

                var avgCurrentYear = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year));

                if (avgCurrentYear != null)
                {
                    basketballSummaryInfo.WinLossAverage = avgCurrentYear.AvgWinLoss;
                    basketballSummaryInfo.TurnoverAverage = avgCurrentYear.AvgTurnover;
                    basketballSummaryInfo.MarginAverage = avgCurrentYear.AvgMargin;
                    basketballSummaryInfo.BetCountAverage = avgCurrentYear.AvgBetCount;
                    basketballSummaryInfo.MatchCountAverage = avgCurrentYear.AvgMatchCount;
                    basketballSummaryInfo.LegendList.Add(avgCurrentYear.ToDate.Year - 1);
                    basketballSummaryInfo.LegendList.Add(avgCurrentYear.ToDate.Year);
                }
            }

            return basketballSummaryInfo;
        }

        private decimal GetValue(BasketballSummaryGeneralInfoItem item, BasketballChartName type)
        {
            if (item != null)
            {
                switch (type)
                {
                    case BasketballChartName.WinLoss:
                        return item.WinLoss;
                    case BasketballChartName.Margin:
                        return item.Margin;
                    case BasketballChartName.Turnover:
                        return item.Turnover;
                    case BasketballChartName.BetCount:
                        return item.BetCount;
                    case BasketballChartName.MatchCount:
                        return item.MatchCount;
                    default:
                        return 0;
                }
            }

            return 0;
        }

        private BasketballSummaryInfoCriteria GenerateCriteriaRangeDate(BasketballSummaryInfoCriteria criteria)
        {
            var toDate = DateTime.Today;            
            var fromDate =
                criteria.BasketballDays == BasketballDays.Today
                ? toDate
                : (criteria.BasketballDays == BasketballDays.Days7
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

        private IEnumerable<Column> GetBasketballColumnsByMonth(IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , List<Column> monthYearList
            , BasketballChartName type)
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

        private IEnumerable<Column> GetBasketballColumnsByDate(IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , List<Column> dayList
            , BasketballChartName type)
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

        #endregion

    }
}