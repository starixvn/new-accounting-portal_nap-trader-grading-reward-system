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
           
            IEnumerable<BasketballLeagueGroupSummaryInfo> data = this.GetData<BasketballLeagueGroupSummaryInfo>(criteria);

            if (data != null && data.Any())
            {
                leagueGroups = data.Select(x => new BasketballLeagueGroupSummary
                {
                    GroupID = x.GroupID,
                    GroupName = x.GroupName,
                    Margin = Math.Round(x.Margin, 2)
                }).ToList();
            }

            return leagueGroups;
        }

        public BasketballSummaryGeneralInfo GetBasketballSummaryInfo(GetBasketballSummaryGeneralCriteria criteria)
        {
            var basketballSummaryInfo = new BasketballSummaryGeneralInfo();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var items = multi.Read<BasketballSummaryGeneralInfoItem>();
                    var avgItems = multi.Read<BasketballSummaryGeneralInfoAvgItem>();
                  
                    basketballSummaryInfo.IsCrossYear = !criteria.FromDate.Year.Equals(criteria.ToDate.Year);

                    if (items != null && items.Any())
                    {
                        var monthYearList = GenerateMonthYearList(criteria.FromDate, criteria.ToDate);

                        basketballSummaryInfo = BindBasketballWinLoss(basketballSummaryInfo, items, criteria, monthYearList);
                        basketballSummaryInfo = BindBasketballTurnover(basketballSummaryInfo, items, criteria, monthYearList);
                        basketballSummaryInfo = BindBasketballMargin(basketballSummaryInfo, items, criteria, monthYearList);
                        basketballSummaryInfo = BindBasketballBetCount(basketballSummaryInfo, items, criteria, monthYearList);
                        basketballSummaryInfo = BindBasketballMatchCount(basketballSummaryInfo, items, criteria, monthYearList);
                    }
                }
            }

            return basketballSummaryInfo;
        }

        private decimal GetValue(BasketballSummaryGeneralInfoItem item, string type)
        {
            if (item != null)
            {
                switch (type)
                {
                    case "winloss":
                        return item.WinLoss;
                    case "margin":
                        return item.Margin;
                    case "turnover":
                        return item.Turnover;
                    case "betcount":
                        return item.BetCount;
                    case "matchcount":
                        return item.MatchCount;
                    default:
                        return 0;
                }
            }
            return 0;
        }

        private List<Column> GenerateMonthYearList(DateTime fromDate, DateTime toDate)
        {
            var monthList = new List<Column>();
            var year = fromDate.Year;

            for (int i = fromDate.Month; i < toDate.Month; i++)
            {
                monthList.Add(new Column
                {
                    GroupName = year.ToString(),
                    Name = i + "/" + year,
                    Value = 0,
                    Month = i,
                    Year = year
                });
            }

            return monthList;
        }

        private BasketballSummaryGeneralInfo BindBasketballWinLoss(BasketballSummaryGeneralInfo basketballSummaryInfo
            , IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , GetBasketballSummaryGeneralCriteria criteria
            , List<Column> monthYearList)
        {            
            if (basketballSummaryInfo.IsCrossYear)
            {
                //basketballSummaryInfo.WinLossCrossYearList = infoList
                //   .Where(x => x.EventDate.Year.Equals(criteria.FromDate.Year))
                //   .Select(x => new Column
                //   {
                //       GroupName = x.EventDate.Year.ToString(),
                //       Name = x.EventDate.Month.ToString() + "/" + x.EventDate.Year.ToString(),
                //       Value = x.Turnover
                //   });

                //basketballSummaryInfo.WinLossComparisonList = infoList
                //.Where(x => !x.EventDate.Year.Equals(criteria.FromDate.Year))
                //.Select(x => new Column
                //{
                //    GroupName = x.EventDate.Year.ToString(),
                //    Name = x.EventDate.Month.ToString() + "/" + x.EventDate.Year.ToString(),
                //    Value = x.Turnover
                //});
            }            

            basketballSummaryInfo.WinLossList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                    y => y.EventDate.Month.Equals(x.Month) 
                        && y.EventDate.Year.Equals(x.Year)), "winloss")
            });

            basketballSummaryInfo.WinLossComparisonList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year - 1,
                Value = GetValue(infoList.FirstOrDefault(
                   y => y.EventDate.Month.Equals(x.Month)
                       && y.EventDate.Year.Equals(x.Year - 1)), "winloss")
            });
           
            return basketballSummaryInfo;
        }      

        private BasketballSummaryGeneralInfo BindBasketballTurnover(BasketballSummaryGeneralInfo basketballSummaryInfo
            , IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , GetBasketballSummaryGeneralCriteria criteria
            , List<Column> monthYearList)
        {
            basketballSummaryInfo.TurnoverList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                   y => y.EventDate.Month.Equals(x.Month)
                       && y.EventDate.Year.Equals(x.Year)), "turnover")
            });

            basketballSummaryInfo.TurnoverComparisonList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year - 1,
                Value = GetValue(infoList.FirstOrDefault(
                  y => y.EventDate.Month.Equals(x.Month)
                      && y.EventDate.Year.Equals(x.Year - 1)), "turnover")
            });           

            return basketballSummaryInfo;
        }

        private BasketballSummaryGeneralInfo BindBasketballMargin(BasketballSummaryGeneralInfo basketballSummaryInfo
            , IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , GetBasketballSummaryGeneralCriteria criteria
            , List<Column> monthYearList)
        {
            basketballSummaryInfo.MarginList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                   y => y.EventDate.Month.Equals(x.Month)
                       && y.EventDate.Year.Equals(x.Year)), "margin")
            });

            basketballSummaryInfo.MarginComparisonList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year - 1,
                Value = GetValue(infoList.FirstOrDefault(
                  y => y.EventDate.Month.Equals(x.Month)
                      && y.EventDate.Year.Equals(x.Year - 1)), "margin")
            });           
                  
            return basketballSummaryInfo;
        }

        private BasketballSummaryGeneralInfo BindBasketballBetCount(BasketballSummaryGeneralInfo basketballSummaryInfo
            , IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , GetBasketballSummaryGeneralCriteria criteria
            , List<Column> monthYearList)
        {
            basketballSummaryInfo.BetCountList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                   y => y.EventDate.Month.Equals(x.Month)
                       && y.EventDate.Year.Equals(x.Year)), "betcount")
            });

            basketballSummaryInfo.BetCountComparisonList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year - 1,
                Value = GetValue(infoList.FirstOrDefault(
                  y => y.EventDate.Month.Equals(x.Month)
                      && y.EventDate.Year.Equals(x.Year - 1)), "betcount")
            });
           
            return basketballSummaryInfo;
        }

        private BasketballSummaryGeneralInfo BindBasketballMatchCount(BasketballSummaryGeneralInfo basketballSummaryInfo
            , IEnumerable<BasketballSummaryGeneralInfoItem> infoList
            , GetBasketballSummaryGeneralCriteria criteria
            , List<Column> monthYearList)
        {
            basketballSummaryInfo.MatchCountList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year,
                Value = GetValue(infoList.FirstOrDefault(
                   y => y.EventDate.Month.Equals(x.Month)
                       && y.EventDate.Year.Equals(x.Year)), "matchcount")
            });

            basketballSummaryInfo.MatchCountComparisonList = monthYearList.Select(x => new Column
            {
                GroupName = x.GroupName,
                Name = x.Name,
                Month = x.Month,
                Year = x.Year - 1,
                Value = GetValue(infoList.FirstOrDefault(
                  y => y.EventDate.Month.Equals(x.Month)
                      && y.EventDate.Year.Equals(x.Year - 1)), "matchcount")
            });            

            return basketballSummaryInfo;
        }

        #endregion

    }
}