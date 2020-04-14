namespace Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading
{
    using Fanex.MAP.TGRS.WebAPI.Consts;
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;    
    using NReco.ImageGenerator;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Text;
    using System.Web.UI;    
    using System.Web.UI.WebControls;   

    public class AutoTradingHtmlWriter : IAutoTradingHtmlWriter
    {        
        private HtmlTextWriter _writer;
        private AutoTradingStyleCss _css;
        private Table _table;
        private List<int> _siteIdList;

        public AutoTradingHtmlWriter()
        {
            _siteIdList = new List<int> { 3, 2 };
            _css = new AutoTradingStyleCss();           
            _writer = new HtmlTextWriter(
                new StringWriter(
                new StringBuilder()));
        }

        private TableRow GenerateRangeHeaderColumns()
        {
            TableRow row = new TableHeaderRow();            
            row.TableSection = TableRowSection.TableHeader;

            var rangeHeaderList = new List<AutoTradingRangeHeader>()
            {
                new AutoTradingRangeHeader("Month", 2, 1, 180),
                new AutoTradingRangeHeader("Match", 2, 1, 90),
                new AutoTradingRangeHeader("Virtual - Grand Total", 1, 3, 270),
                new AutoTradingRangeHeader("Variance - Grand Total", 1, 3, 270),
                new AutoTradingRangeHeader("Real - Grand Total", 1, 3, 270)
            };

            rangeHeaderList.ForEach(x =>
            {
                var cell = new TableCell
                {                    
                    Text = x.Text,
                    RowSpan = x.RowSpan,
                    ColumnSpan = x.ColumnSpan,
                    Width = x.Width,
                    HorizontalAlign = HorizontalAlign.Center
                };

                foreach (var style in _css.StyleTableTh)
                {
                    cell.Style.Add(style.Key, style.Value);
                }

                row.Cells.Add(cell);
            });

            return row;
        }

        private TableRow GenerateHeaderColumns()
        {
            TableRow row = new TableHeaderRow();
            row.TableSection = TableRowSection.TableHeader;

            var columnList = new List<string>
            {
                "Credit Margin%", "Cash Margin%", "Total Margin%",
                "Credit Margin%", "Cash Margin%", "Total Margin%",
                "Credit Margin%", "Cash Margin%", "Total Margin%"
            };
            var index = 1;

            columnList.ForEach(x =>
            {
                var styleTableTh = index == 1
                                ? _css.StyleTableThSiteCredit
                                : (index == 2 ? _css.StyleTableThSiteCash : _css.StyleTableThSiteSum);

                var cell = new TableCell { Text = x, HorizontalAlign = HorizontalAlign.Center };

                foreach (var style in styleTableTh)
                {
                    cell.Style.Add(style.Key, style.Value);
                }

                row.Cells.Add(cell);

                index = index < 3 ? (index + 1) : 1;
            });

            return row;
        }       

        private TableRow GenerateBodyTableRow()
        {
            TableRow row = new TableHeaderRow();
            row.TableSection = TableRowSection.TableBody;

            return row;
        }

        private TableCell GenerateBodyTableCell(decimal margin, Dictionary<string, string> styleTableTd = null)
        {
            var cell = new TableCell
            {
                Text = margin.ToString(Consts.FormatDecimalToString_Place2),
                HorizontalAlign = HorizontalAlign.Right
            };

            if (styleTableTd == null)
            {
                styleTableTd = _css.StyleTableTd;
            }

            foreach (var style in styleTableTd)
            {
                cell.Style.Add(style.Key, style.Value);
            }

            return cell;
        }

        private void GenerateBodyDivTitle(string title)
        {
            AddStyleAttribute(_css.StyleDivTitle);
            _writer.RenderBeginTag(HtmlTextWriterTag.Div);

            AddStyleAttribute(_css.StyleDivTitleLable);
            _writer.RenderBeginTag(HtmlTextWriterTag.Label);
            _writer.Write(title);

            _writer.RenderEndTag();
            _writer.RenderEndTag();
        }

        private void AddStyleAttribute(Dictionary<string, string> attributeList)
        {
            foreach (var style in attributeList)
            {
                _writer.AddStyleAttribute(style.Key, style.Value);
            }
        }

        public IAutoTradingHtmlWriter GenerateBeginTagHtmlBody()
        {
            _writer.RenderBeginTag(HtmlTextWriterTag.Html);
            _writer.RenderBeginTag(HtmlTextWriterTag.Head);
            _writer.RenderEndTag();
            _writer.RenderBeginTag(HtmlTextWriterTag.Body);

            return this;
        }

        public IAutoTradingHtmlWriter GenerateEndTagHtmlBody()
        {
            _writer.RenderEndTag();
            _writer.RenderEndTag();

            return this;
        }

        public IAutoTradingHtmlWriter GenerateTable(string title)
        {
            GenerateBodyDivTitle(title);            

            _table = new Table();            

            foreach (var style in _css.StyleTable)
            {
                _table.Style.Add(style.Key, style.Value);
            }

            _table.Rows.Add(GenerateRangeHeaderColumns());
            _table.Rows.Add(GenerateHeaderColumns());            

            return this;
        }        

        public IAutoTradingHtmlWriter GenerateTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos
            , AutoTradingSummaryMonthlyInfo summaryInfo
            , string autoTradingName)
        {
            var row = InitTableRow(summaryInfo, autoTradingName);

            GenerateGroupVirtualTotal(row, autoTradingInfos);
            GenerateGroupVariance(row, autoTradingInfos);
            GenerateGroupRealTotal8RMWL(row, autoTradingInfos);

            _table.Rows.Add(row);

            return this;
        }

        public IAutoTradingHtmlWriter GenerateGrandTotalTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos
            , AutoTradingSummaryMonthlyInfo summaryInfo
            , string autoTradingName)
        {
            var row = InitTableRow(summaryInfo, autoTradingName, _css.StyleTableTdGrandTotalSite);

            GenerateGrandTotalGroupVirtualTotal(row, autoTradingInfos);
            GenerateGrandTotalGroupVariance(row, autoTradingInfos);
            GenerateGrandTotalGroupRealTotal8RMWL(row, autoTradingInfos);

            _table.Rows.Add(row);

            return this;
        }

        private TableRow InitTableRow(AutoTradingSummaryMonthlyInfo summaryInfo, string autoTradingName, Dictionary<string, string> styleTableTd = null)
        {
            var cellAutoTradingName = new TableCell
            {
                Text = autoTradingName,
                HorizontalAlign = HorizontalAlign.Center
            };
            var cellMatch = new TableCell
            {
                Text = summaryInfo != null ? summaryInfo.MatchCount.ToString() : "0",
                HorizontalAlign = HorizontalAlign.Right
            };

            if (styleTableTd == null)
            {
                styleTableTd = _css.StyleTableTd;
            }
            foreach (var style in styleTableTd)
            {
                cellAutoTradingName.Style.Add(style.Key, style.Value);
                cellMatch.Style.Add(style.Key, style.Value);
            }

            var row = GenerateBodyTableRow();
            row.Cells.Add(cellAutoTradingName);
            row.Cells.Add(cellMatch);

            return row;
        }

        private void GenerateGroupVirtualTotal(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {           
            foreach (var siteId in _siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    row.Cells.Add(GenerateBodyTableCell(info.Margin_VR, _css.StyleTableTdSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0, _css.StyleTableTdSite));
                }
            }

            var turnover = infos.Sum(x => x.Stake_VR);
            var winLoss = infos.Sum(x => x.WinLoss_VR);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdSiteSum));
        }        

        private void GenerateGroupVariance(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {
            foreach (var siteId in _siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    row.Cells.Add(GenerateBodyTableCell(info.Margin_VAR, _css.StyleTableTdSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0));
                }
            }

            var turnover = infos.Sum(x => x.Stake_VAR);
            var winLoss = infos.Sum(x => x.Winloss_VAR);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdSiteSum));
        }

        private void GenerateGroupRealTotal8RMWL(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {
            foreach (var siteId in _siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    row.Cells.Add(GenerateBodyTableCell(info.Margin_AR8RM, _css.StyleTableTdSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0));
                }
            }

            var turnover = infos.Sum(x => x.Stake_AR8RM);
            var winLoss = infos.Sum(x => x.Winloss_AR8RM);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdSiteSum));
        }

        private void GenerateGrandTotalGroupVirtualTotal(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {
            foreach (var siteId in _siteIdList)
            {
                var grandTotalInfos = infos.Where(x => x.TypeSiteId == siteId);

                if (grandTotalInfos.Any())
                {
                    var sumInfo = grandTotalInfos.Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                    row.Cells.Add(GenerateBodyTableCell(sumInfo.Margin_VR, _css.StyleTableTdGrandTotalSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0, _css.StyleTableTdGrandTotalSite));
                }
            }

            var turnover = infos.Sum(x => x.Stake_VR);
            var winLoss = infos.Sum(x => x.WinLoss_VR);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdGrandTotalSiteSum));
        }

        private void GenerateGrandTotalGroupVariance(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {
            foreach (var siteId in _siteIdList)
            {
                var grandTotalInfos = infos.Where(x => x.TypeSiteId == siteId);

                if (grandTotalInfos.Any())
                {
                    var sumInfo = grandTotalInfos.Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                    row.Cells.Add(GenerateBodyTableCell(sumInfo.Margin_VAR, _css.StyleTableTdGrandTotalSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0));
                }
            }

            var turnover = infos.Sum(x => x.Stake_VAR);
            var winLoss = infos.Sum(x => x.Winloss_VAR);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdGrandTotalSiteSum));
        }

        private void GenerateGrandTotalGroupRealTotal8RMWL(TableRow row, IEnumerable<AutoTradingModelPerformanceInfo> infos)
        {
            foreach (var siteId in _siteIdList)
            {
                var grandTotalInfos = infos.Where(x => x.TypeSiteId == siteId);

                if (grandTotalInfos.Any())
                {
                    var sumInfo = grandTotalInfos.Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                    row.Cells.Add(GenerateBodyTableCell(sumInfo.Margin_AR8RM, _css.StyleTableTdGrandTotalSite));
                }
                else
                {
                    row.Cells.Add(GenerateBodyTableCell(0, _css.StyleTableTdGrandTotalSite));
                }
            }

            var turnover = infos.Sum(x => x.Stake_AR8RM);
            var winLoss = infos.Sum(x => x.Winloss_AR8RM);
            var margin = turnover == 0 ? 0 : (winLoss / turnover) * 100;

            row.Cells.Add(GenerateBodyTableCell(margin, _css.StyleTableTdGrandTotalSiteSum));
        }

        public IAutoTradingHtmlWriter RenderControlTable()
        {
            _table.RenderControl(_writer);

            return this;
        }

        public IAutoTradingHtmlWriter RenderHtmlToImage(string savePath)
        {
            var converter = new HtmlToImageConverter();
            var jpegBytes = converter.GenerateImage(_writer.InnerWriter.ToString(), ImageFormat.Jpeg);
           
            var stream = new MemoryStream(jpegBytes);
            var image = System.Drawing.Image.FromStream(stream, true, true);

            image.Save(savePath);

            return this;
        }
    }
}