namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string TeamPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewTeamPerformance";

        public IEnumerable<TeamInfo> GetTeams()
        {
            var result = this.GetData<TeamInfo>(new GetTeamsCriteria());

            result = result ?? new List<TeamInfo>();

            return result;
        }

        public IEnumerable<TeamPerformanceInfo> GetTeamPerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamPerformanceInfo>(criteria);

            result = result ?? new List<TeamPerformanceInfo>();

            SessionManager.Set<IEnumerable<TeamPerformanceInfo>>(TeamPerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<TeamLeaguePerformanceInfo> GetTeamLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamLeaguePerformanceInfo>(criteria);

            result = result ?? new List<TeamLeaguePerformanceInfo>();

            return result;
        }

        public IEnumerable<TeamLeagueTraderPerformanceInfo> GetTeamLeagueTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamLeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<TeamLeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<TeamLeagueTraderMatchPerformanceInfo> GetTeamLeagueTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamLeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<TeamLeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<TeamLeagueTraderMatchBettypePerformanceInfo> GetTeamLeagueTraderMatchBettypePerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamLeagueTraderMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<TeamLeagueTraderMatchBettypePerformanceInfo>();

            return result;
        }

        public IEnumerable<TeamTraderMatchBettypePerformanceInfo> GetTeamTraderMatchBettypePerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamTraderMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<TeamTraderMatchBettypePerformanceInfo>();

            return result;
        }

        public IEnumerable<TeamTraderPerformanceInfo> GetTeamTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<TeamTraderPerformanceInfo>(criteria);

            result = result ?? new List<TeamTraderPerformanceInfo>();

            return result;
        }

        public Dictionary<string, IEnumerable<TeamTraderMatchPerformanceInfo>> GetTeamTraderMatchPerformance(ICriteria criteria)
        {
            var data = this.GetData<TeamTraderMatchPerformanceInfo>(criteria);
            var result = new Dictionary<string, IEnumerable<TeamTraderMatchPerformanceInfo>>();

            data = data ?? new List<TeamTraderMatchPerformanceInfo>();

            if (data.Count() > 0)
            {
                var groups = data.GroupBy(t => t.LeagueId);
                foreach (var group in groups)
                {
                    var leagueName = CacheRef.GetLeagueName(group.Key);
                    if (string.IsNullOrEmpty(leagueName))
                    {
                        leagueName = group.Key.ToString();
                    }

                    result.Add(leagueName, group.Select(t => t));
                }
            }

            return result;
        }

        public void ExportTeamPerformance(GetTeamPerformanceCriteria criteria, bool isViewScore, string templatePath)
        {
            var TeamData = SessionManager.Get<IEnumerable<TeamPerformanceInfo>>(TeamPerformanceDetailReportSessionKey);
            if (TeamData == null || (TeamData != null && TeamData.Count() == 0))
            {
                TeamData = this.GetData<TeamPerformanceInfo>(criteria);

                TeamData = TeamData ?? new List<TeamPerformanceInfo>();

                SessionManager.Set<IEnumerable<TeamPerformanceInfo>>(TeamPerformanceDetailReportSessionKey, TeamData);
            }

            if (TeamData != null && TeamData.Count() > 0)
            {
                string reportName = string.Format(
                                ViewLang.NewPerformanceDetailFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewTeamPerformance);
                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(TeamData, ref writer, isViewScore);

                writer.SyncColumnsWidth(14);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(13);
                }

                writer.Render();
            }
        }

        #region Private

        private void FillRowData(IEnumerable<TeamPerformanceInfo> contentData, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            decimal totalTO = 0, totalJuice = 0, totalWL = 0;
            int totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0, len = contentData.Count();

            for (int i = 0; i < len; i++)
            {
                var styleIndex = (i % 2 == 0) ? 5 : 6;
                var item = contentData.ElementAt(i);
                var record = new object[]
                {
                    i + 1,
                    item.TeamName, item.TraderCount, item.LeagueCount, item.MatchCount, item.Turnover,
                    item.Juice,
                    (object)item.JuiceMargin ?? ViewLang.NA,
                    item.Leftover,
                    (object)item.LeftoverMargin ?? ViewLang.NA,
                    item.WinLoss,
                    (object)item.Margin ?? ViewLang.NA,
                    item.BetCount,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalLeague += item.LeagueCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;
            }

            var totalRecord = new object[]
            {
                ViewLang.GrandTotal, null,
                totalTrader,
                totalLeague,
                totalMatch,
                totalTO,
                totalJuice,
                totalTO > 0 ? (object)(totalJuice / totalTO * 100) : ViewLang.NA,
                totalWL - totalJuice,
                totalTO > 0 ? (object)((totalWL - totalJuice) / totalTO * 100) : ViewLang.NA,
                totalWL,
                totalTO > 0 ? (object)(totalWL / totalTO * 100) : ViewLang.NA,
                totalBetcount
            };
            writer.WriteRow(7, totalRecord);
        }

        private void FilterBlock(GetTeamPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(11, 0);
            var normalFont = writer.GetFont(12, 0);
            var lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");

            var teams = this.GetTeams().ToList();
            string teamString = MakeTeamSelectString(teams, criteria.TeamIds);
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Team, boldFont, teamString, normalFont, "\n");

            var contentRichTextString = contentRender.Render();
            var contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private string MakeTeamSelectString(List<TeamInfo> data, string teamIds)
        {
            if (teamIds == "0")
            {
                return string.Join(", ", data.Select(obj => obj.TeamName));
            }
            else
            {
                return string.Join(", ", data.Where(obj => teamIds.Contains(obj.TeamId.ToString())).Select(obj => obj.TeamName));
            }
        }

        #endregion Private
    }
}