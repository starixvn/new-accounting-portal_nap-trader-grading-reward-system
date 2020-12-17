namespace Fanex.NAP.TGRS.OSReports.Services
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.Dashboard;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;    
    using Fanex.NAP.TGRS.OSReports.ViewModel.Dashboard;
    using Fanex.NAP.TGRS.OSReports.ViewModels.Dashboard;
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

        public IEnumerable<OSTraderSummary> GetOSTraderSummary(GetOSTraderSummaryCriteria criteria)
        {
            var traders = new List<OSTraderSummary>();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetOSTraderSummaryCriteria;

            var data = this.GetData<OSTraderSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                traders = data.Select(x => new OSTraderSummary
                {
                    TraderName = x.Username,
                    Margin = Math.Round(x.Margin, 2)
                }).ToList();
            }

            return traders;
        }

        public IEnumerable<OSSportLeagueSummary> GetOSSportSummary(GetOSSportSummaryCriteria criteria)
        {
            var sports = new List<OSSportLeagueSummary>();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetOSSportSummaryCriteria;

            var data = this.GetData<OSSportSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                sports = data.Select(x => new OSSportLeagueSummary
                {
                    Name = x.SportName,
                    Margin = Math.Round(x.Margin, 2)
                }).ToList();
            }

            return sports;
        }

        public IEnumerable<OSSportLeagueSummary> GetOSLeagueSummary(GetOSLeagueSummaryCriteria criteria)
        {
            var leagues = new List<OSSportLeagueSummary>();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetOSLeagueSummaryCriteria;

            var data = this.GetData<OSLeagueSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                leagues = data.Select(x => new OSSportLeagueSummary
                {
                    Name = x.LeagueName,
                    Margin = Math.Round(x.Margin, 2)
                }).ToList();
            }

            return leagues;
        }        

        public OSSummaryGeneralInfo GetOSSummaryInfo(GetOSSummaryGeneralCriteria criteria)
        {
            var osSummaryGeneral = new OSSummaryGeneralInfo();

            if (criteria.ReportType == 1)
                criteria = GenerateCriteriaRangeDate(criteria) as GetOSSummaryGeneralCriteria;

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var items = multi.Read<OSSummaryGeneralInfoItem>();
                    var avgItems = multi.Read<OSSummaryGeneralInfoAvgItem>();

                    osSummaryGeneral = criteria.ReportType == 1
                        ? GetOSSummaryByDate(criteria, items, avgItems)
                        : GetOSSummaryByMonth(criteria, items, avgItems);
                }
            }

            var marketCriteria = new GetOSSummaryMarketCriteria
            {
                FromDate = criteria.FromDate,
                ToDate = criteria.ToDate,
                DayType = criteria.DayType,
                ReportType = criteria.ReportType,
                SportIds = criteria.SportIds
            };

            osSummaryGeneral = GetOSSummaryMarket(osSummaryGeneral, marketCriteria);

            return osSummaryGeneral;
        }

        private OSSummaryGeneralInfo GetOSSummaryMarket(OSSummaryGeneralInfo osSummaryGeneral, GetOSSummaryMarketCriteria marketCriteria)
        {
            using (var objectDb = new ObjectDb(marketCriteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(marketCriteria.GetSpParams()))
                {
                    var marketItems = multi.Read<OSSummaryGeneralInfoItem>();
                    var marketAvgItems = multi.Read<OSSummaryGeneralInfoAvgItem>();

                    if (marketCriteria.ReportType == 1)
                    {
                        osSummaryGeneral.MarketCountList = GetOSColumnsByDate(marketItems, osSummaryGeneral.DayOrMonthList, OSChartName.MarketCount);
                        osSummaryGeneral.MarketCountComparisonList = GetOSColumnsByDate(marketItems, osSummaryGeneral.ComparisonDayOrMonthList, OSChartName.MarketCount);
                    }
                    else
                    {
                        if (osSummaryGeneral.IsCrossYear)
                        {
                            osSummaryGeneral.MarketCountCrossYearList = GetOSColumnsByMonth(marketItems, osSummaryGeneral.CrossDayOrMonthList, OSChartName.MarketCount);
                            osSummaryGeneral.MarketCountCrossYearComparisonList = GetOSColumnsByMonth(marketItems, osSummaryGeneral.CrossComparisonDayOrMonthList, OSChartName.MarketCount);
                        }

                        osSummaryGeneral.MarketCountList = GetOSColumnsByMonth(marketItems, osSummaryGeneral.DayOrMonthList, OSChartName.MarketCount);
                        osSummaryGeneral.MarketCountComparisonList = GetOSColumnsByMonth(marketItems, osSummaryGeneral.ComparisonDayOrMonthList, OSChartName.MarketCount);
                    }

                    if (marketAvgItems != null && marketAvgItems.Any())
                    {
                        var avgComparison = marketAvgItems.FirstOrDefault(x => x.ToDate.Year.Equals(marketCriteria.ToDate.Year - 1));

                        if (avgComparison != null)
                        {
                            osSummaryGeneral.MarketCountAverageComparison = avgComparison.AvgMarketCount;
                        }

                        var avgCurrentYear = marketAvgItems.FirstOrDefault(x => x.ToDate.Year.Equals(marketCriteria.ToDate.Year));

                        if (avgCurrentYear != null)
                        {
                            osSummaryGeneral.MarketCountAverage = avgCurrentYear.AvgMarketCount;
                        }
                    }
                }
            }

            return osSummaryGeneral;
        }

        private OSSummaryGeneralInfo GetOSSummaryByDate(OSSummaryInfoCriteria criteria
            , IEnumerable<OSSummaryGeneralInfoItem> items
            , IEnumerable<OSSummaryGeneralInfoAvgItem> avgItems)
        {
            var osSummaryInfo = new OSSummaryGeneralInfo();
            var daysList = new List<Column>();
            var comparisonDayList = new List<Column>();

            if (items != null && items.Any())
            {               
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

                osSummaryInfo.WinLossList = GetOSColumnsByDate(items, daysList, OSChartName.WinLoss);
                osSummaryInfo.WinLossComparisonList = GetOSColumnsByDate(items, comparisonDayList, OSChartName.WinLoss);
                osSummaryInfo.TurnoverList = GetOSColumnsByDate(items, daysList, OSChartName.Turnover);
                osSummaryInfo.TurnoverComparisonList = GetOSColumnsByDate(items, comparisonDayList, OSChartName.Turnover);
                osSummaryInfo.MarginList = GetOSColumnsByDate(items, daysList, OSChartName.Margin);
                osSummaryInfo.MarginComparisonList = GetOSColumnsByDate(items, comparisonDayList, OSChartName.Margin);
                osSummaryInfo.BetCountList = GetOSColumnsByDate(items, daysList, OSChartName.BetCount);
                osSummaryInfo.BetCountComparisonList = GetOSColumnsByDate(items, comparisonDayList, OSChartName.BetCount);              
            }
            osSummaryInfo.DayOrMonthList = daysList;
            osSummaryInfo.ComparisonDayOrMonthList = comparisonDayList;

            osSummaryInfo = BindOSSummaryAverage(osSummaryInfo, criteria, avgItems);

            return osSummaryInfo;
        }

        private OSSummaryGeneralInfo GetOSSummaryByMonth(OSSummaryInfoCriteria criteria
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

                    osSummaryInfo.WinLossCrossYearList = GetOSColumnsByMonth(items, crossMonthYearList, OSChartName.WinLoss);
                    osSummaryInfo.WinLossCrossYearComparisonList = GetOSColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.WinLoss);
                    osSummaryInfo.TurnoverCrossYearList = GetOSColumnsByMonth(items, crossMonthYearList, OSChartName.Turnover);
                    osSummaryInfo.TurnoverCrossYearComparisonList = GetOSColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Turnover);
                    osSummaryInfo.MarginCrossYearList = GetOSColumnsByMonth(items, crossMonthYearList, OSChartName.Margin);
                    osSummaryInfo.MarginCrossYearComparisonList = GetOSColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Margin);
                    osSummaryInfo.BetCountCrossYearList = GetOSColumnsByMonth(items, crossMonthYearList, OSChartName.BetCount);
                    osSummaryInfo.BetCountCrossComparisonList = GetOSColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.BetCount);
                   
                    osSummaryInfo.CrossDayOrMonthList = crossMonthYearList;
                    osSummaryInfo.CrossComparisonDayOrMonthList = crossComparisonMonthYearList;

                    fromDate = new DateTime(criteria.ToDate.Year, 1, 1);
                    comparisonFromDate = new DateTime(criteria.ToDate.Year - 1, 1, 1);
                    comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);
                }

                var monthYearList = GenerateMonthYearList(fromDate, criteria.ToDate);
                var comparisonMonthYearList = GenerateMonthYearList(comparisonFromDate, comparisonToDate);
                osSummaryInfo.WinLossList = GetOSColumnsByMonth(items, monthYearList, OSChartName.WinLoss);
                osSummaryInfo.WinLossComparisonList = GetOSColumnsByMonth(items, comparisonMonthYearList, OSChartName.WinLoss);
                osSummaryInfo.TurnoverList = GetOSColumnsByMonth(items, monthYearList, OSChartName.Turnover);
                osSummaryInfo.TurnoverComparisonList = GetOSColumnsByMonth(items, comparisonMonthYearList, OSChartName.Turnover);
                osSummaryInfo.MarginList = GetOSColumnsByMonth(items, monthYearList, OSChartName.Margin);
                osSummaryInfo.MarginComparisonList = GetOSColumnsByMonth(items, comparisonMonthYearList, OSChartName.Margin);
                osSummaryInfo.BetCountList = GetOSColumnsByMonth(items, monthYearList, OSChartName.BetCount);
                osSummaryInfo.BetCountComparisonList = GetOSColumnsByMonth(items, comparisonMonthYearList, OSChartName.BetCount);
               
                osSummaryInfo.DayOrMonthList = monthYearList;
                osSummaryInfo.ComparisonDayOrMonthList = comparisonMonthYearList;
            }

            osSummaryInfo = BindOSSummaryAverage(osSummaryInfo, criteria, avgItems);

            return osSummaryInfo;
        }

        private OSSummaryGeneralInfo BindOSSummaryAverage(OSSummaryGeneralInfo osSummaryInfo
            , OSSummaryInfoCriteria criteria
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
                    osSummaryInfo.LegendList.Add(avgComparison.ToDate.Year);
                }

                var avgCurrentYear = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year));

                if (avgCurrentYear != null)
                {
                    osSummaryInfo.WinLossAverage = avgCurrentYear.AvgWinLoss;
                    osSummaryInfo.TurnoverAverage = avgCurrentYear.AvgTurnover;
                    osSummaryInfo.MarginAverage = avgCurrentYear.AvgMargin;
                    osSummaryInfo.BetCountAverage = avgCurrentYear.AvgBetCount;                    
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
                    case OSChartName.MarketCount:
                        return item.MarketCount;
                    default:
                        return 0;
                }
            }

            return 0;
        }

        private OSSummaryInfoCriteria GenerateCriteriaRangeDate(OSSummaryInfoCriteria criteria)
        {
            var toDate = DateTime.Today;
            var fromDate =
                criteria.DayType == DayType.Yesterday
                ? toDate.AddDays(-1)
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

        private IEnumerable<Column> GetOSColumnsByMonth(IEnumerable<OSSummaryGeneralInfoItem> infoList
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

        private IEnumerable<Column> GetOSColumnsByDate(IEnumerable<OSSummaryGeneralInfoItem> infoList
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

        #region Basketball Dashboard
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

            return leagueGroups.OrderBy(x => x.Margin);
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

                basketballSummaryInfo.WinLossList = GetBasketballColumnsByDate(items, daysList, OSChartName.WinLoss);
                basketballSummaryInfo.WinLossComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.WinLoss);
                basketballSummaryInfo.TurnoverList = GetBasketballColumnsByDate(items, daysList, OSChartName.Turnover);
                basketballSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.Turnover);
                basketballSummaryInfo.MarginList = GetBasketballColumnsByDate(items, daysList, OSChartName.Margin);
                basketballSummaryInfo.MarginComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.Margin);
                basketballSummaryInfo.BetCountList = GetBasketballColumnsByDate(items, daysList, OSChartName.BetCount);
                basketballSummaryInfo.BetCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.BetCount);
                basketballSummaryInfo.MatchCountList = GetBasketballColumnsByDate(items, daysList, OSChartName.MatchCount);
                basketballSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByDate(items, comparisonDayList, OSChartName.MatchCount);
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

                    basketballSummaryInfo.WinLossCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.WinLoss);
                    basketballSummaryInfo.WinLossCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.WinLoss);
                    basketballSummaryInfo.TurnoverCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.Turnover);
                    basketballSummaryInfo.TurnoverCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Turnover);
                    basketballSummaryInfo.MarginCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.Margin);
                    basketballSummaryInfo.MarginCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.Margin);
                    basketballSummaryInfo.BetCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.BetCount);
                    basketballSummaryInfo.BetCountCrossComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.BetCount);
                    basketballSummaryInfo.MatchCountCrossYearList = GetBasketballColumnsByMonth(items, crossMonthYearList, OSChartName.MatchCount);
                    basketballSummaryInfo.MatchCountCrossYearComparisonList = GetBasketballColumnsByMonth(items, crossComparisonMonthYearList, OSChartName.MatchCount);

                    fromDate = new DateTime(criteria.ToDate.Year, 1, 1);
                    comparisonFromDate = new DateTime(criteria.ToDate.Year - 1, 1, 1);
                    comparisonToDate = new DateTime(criteria.ToDate.Year - 1, criteria.ToDate.Month, 1);
                }

                var monthYearList = GenerateMonthYearList(fromDate, criteria.ToDate);
                var comparisonMonthYearList = GenerateMonthYearList(comparisonFromDate, comparisonToDate);
                basketballSummaryInfo.WinLossList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.WinLoss);
                basketballSummaryInfo.WinLossComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.WinLoss);
                basketballSummaryInfo.TurnoverList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.Turnover);
                basketballSummaryInfo.TurnoverComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.Turnover);
                basketballSummaryInfo.MarginList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.Margin);
                basketballSummaryInfo.MarginComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.Margin);
                basketballSummaryInfo.BetCountList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.BetCount);
                basketballSummaryInfo.BetCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.BetCount);
                basketballSummaryInfo.MatchCountList = GetBasketballColumnsByMonth(items, monthYearList, OSChartName.MatchCount);
                basketballSummaryInfo.MatchCountComparisonList = GetBasketballColumnsByMonth(items, comparisonMonthYearList, OSChartName.MatchCount);
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
                var avgComparison = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year - 1));

                if (avgComparison != null)
                {
                    if (basketballSummaryInfo.IsCrossYear)
                    {
                        basketballSummaryInfo.LegendList.Add(avgComparison.ToDate.Year - 1);
                    }

                    basketballSummaryInfo.WinLossAverageComparison = avgComparison.AvgWinLoss;
                    basketballSummaryInfo.TurnoverAverageComparison = avgComparison.AvgTurnover;
                    basketballSummaryInfo.MarginAverageComparison = avgComparison.AvgMargin;
                    basketballSummaryInfo.BetCountAverageComparison = avgComparison.AvgBetCount;
                    basketballSummaryInfo.MatchCountAverageComparison = avgComparison.AvgMatchCount;
                    basketballSummaryInfo.LegendList.Add(avgComparison.ToDate.Year);
                }

                var avgCurrentYear = avgItems.FirstOrDefault(x => x.ToDate.Year.Equals(criteria.ToDate.Year));

                if (avgCurrentYear != null)
                {
                    basketballSummaryInfo.WinLossAverage = avgCurrentYear.AvgWinLoss;
                    basketballSummaryInfo.TurnoverAverage = avgCurrentYear.AvgTurnover;
                    basketballSummaryInfo.MarginAverage = avgCurrentYear.AvgMargin;
                    basketballSummaryInfo.BetCountAverage = avgCurrentYear.AvgBetCount;
                    basketballSummaryInfo.MatchCountAverage = avgCurrentYear.AvgMatchCount;
                    basketballSummaryInfo.LegendList.Add(avgCurrentYear.ToDate.Year);
                }
            }

            return basketballSummaryInfo;
        }

        private decimal GetValue(BasketballSummaryGeneralInfoItem item, OSChartName type)
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

        private BasketballSummaryInfoCriteria GenerateCriteriaRangeDate(BasketballSummaryInfoCriteria criteria)
        {
            var toDate = DateTime.Today.AddDays(-1);
            var fromDate =
                criteria.BasketballDays == DayType.Yesterday
                ? toDate
                : (criteria.BasketballDays == DayType.Days7
                    ? toDate.AddDays(-6)
                    : toDate.AddDays(-29)
                );

            criteria.FromDate = fromDate;
            criteria.ToDate = toDate;

            return criteria;
        }       

        private IEnumerable<Column> GetBasketballColumnsByMonth(IEnumerable<BasketballSummaryGeneralInfoItem> infoList
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

        private IEnumerable<Column> GetBasketballColumnsByDate(IEnumerable<BasketballSummaryGeneralInfoItem> infoList
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
        #endregion

    }
}