// --------------------------------------------------------------------------
// <copyright file="ScoreConfirmationService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Services.Implement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Services.Interface;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class ScoreConfirmationService : TGRSBaseService, IScoreConfirmationService
    {
        private const int PointInPixel = 225;

        public LastestScoreHistoryInfo GetLastestScoreHistoryInfo(GetLastedScoreHistoryInfoCriteria criteria)
        {
            return GetData<LastestScoreHistoryInfo>(criteria).First();
        }

        public IEnumerable<TraderScoreInfo> GetTraderScores(GetAllTraderScoreCriteria criteria)
        {
            return GetData<TraderScoreInfo>(criteria);
        }

        public ICommandResult StoreTraderConfirmedScores(StoreTraderConfirmedScoreCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        #region Utilities
        public void ExportTraderScores(GetAllTraderScoreCriteria criteria, string templatePath)
        {
            var traderScores = GetTraderScores(criteria);
            var reportName = string.Format(
                                ViewLang.TraderScoreFileName,
                                DateTime.Today.ToString("yyyyMMdd"));
            var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TraderScoreFileName);

            writer.CopyRows(0, 1);
            FilterBlock(criteria, ref writer);
            FillHeader(ref writer);
            writer.FreezeRow(0, 3);
            FillRowData(traderScores, ref writer);
            writer.SyncColumnsWidth(10);

            writer.Render();
        }

        private void FilterBlock(GetAllTraderScoreCriteria criteria, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(9, 0);
            var normalFont = writer.GetFont(10, 0);
            var lineCount = 0;
            var periodRange = "from " + criteria.FromDate.ToString("MM/dd/yyyy") + " to " + criteria.ToDate.ToString("MM/dd/yyyy");
            AppendBlockContent(ref contentRender, ref lineCount, "Period: ", boldFont, periodRange, normalFont, "\n");
            
            var contentRichTextString = contentRender.Render();
            var contentRichTextArray = new string[1];
            contentRichTextArray[0] = contentRichTextString.String;
            writer.WriteRow(7, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void AppendBlockContent(ref RichTextRender content, ref int lineCount, string name, IFont nameFont, string value, IFont valueFont, string endString)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            var nameBlock = new TextBlock(name + ":  ", nameFont);
            content = content.AddText(nameBlock);

            var valueBlock = new TextBlock(value, valueFont);
            content = content.AddText(valueBlock);

            if (!string.IsNullOrEmpty(endString))
            {
                content = content.AddText(endString);
            }

            lineCount += CountLine(name + value);
        }

        private int CountLine(string line)
        {
            const int CharPerLine = 216;
            return Convert.ToInt32(Math.Ceiling((float)line.Length / CharPerLine));
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(4, 1);
        }

        private void FillRowData(IEnumerable<TraderScoreInfo> traderScores, ref ExcelTemplateWriter writer)
        {
            for (var i = 0; i < traderScores.Count(); i++)
            {
                var styleIndex = (i % 2 == 0) ? 4 : 5;
                var item = traderScores.ElementAt(i);

                var record = new object[]
                {
                    i+1,
                    item.TraderName,
                    item.TeamName,
                    item.GradeName,
                    item.TotalPoint,
                    item.Margin,
                    item.Turnover,
                    item.WinLoss
                };
                writer.WriteRow(styleIndex, record);
            }
        }
        #endregion
    }
}
