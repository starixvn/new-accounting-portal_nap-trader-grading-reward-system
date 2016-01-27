// -----------------------------------------------------------------------
// <copyright file="SpreadManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.SpreadManagement
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Core.BaseClasses;
    using Core.ExcelUtility;
    using Core.ExcelUtility.RichTextExtensions;
    using Core.Resources;
    using Criteria.SpreadManagement;
    using DataAccess.Implement;
    using DataAccess.Interface;
    using Framework.Command;
    using Models.SpreadManagement;
    using NAP.Core.Web;
    using NPOI.SS.UserModel;
    using ViewModel.SpreadManagement;
    using Fanex.NAP.TGRS.Configuration.Criteria.Common;

    public class SpreadManagementService : TGRSBaseService, ISpreadManagementService
    {
        private const int PointInPixel = 225;

        private readonly ISpreadManagementDataAccess _spreadManagementDataAccess;

        public SpreadManagementService()
        {
            _spreadManagementDataAccess = new SpreadManagementDataAccess();
        }

        public SpreadInfoList GetAllSpread(GetAllSpreadCriteria criteria)
        {
            return _spreadManagementDataAccess.GetAllSpread(criteria);
        }

        public ICommandResult UpdateSingleSpread(UpdateSingleSpreadCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult DeleteSpread(DeleteSpreadCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult UpdateSpread(UpdateSpreadCriteria criteria)
        {
            return UpdateData(criteria);
        }

        /// <summary>
        /// Gets the list of bettypes Id.
        /// </summary>
        /// <returns>List of bettypes Id.</returns>
        public IEnumerable<int> GetBettypeIdsList()
        {
            IEnumerable<int> result = this.GetData<int>(new GetBetTypeIdsCriteria());
            return result;
        }

        /// <summary>
        /// Gets the list of leagues Id.
        /// </summary>
        /// <returns>List of leagues Id.</returns>
        public IEnumerable<int> GetLeagueIdsList()
        {
            IEnumerable<int> result = this.GetData<int>(new GetLeagueIdsCriteria());
            return result;
        }        

        #region Utilities
        public void ExportSpreadList(GetAllSpreadCriteria criteria, string templatePath)
        {
            var spreadList = GetAllSpread(criteria).SpreadInfoItems;

            var reportName = string.Format(
                                ViewLang.SpreadListFileName,
                                DateTime.Today.ToShortFormatedDateForFileName());

            var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.SpreadManagement);
            writer.CopyRows(0, 1);
            FilterBlock(criteria, ref writer);
            FillHeader(ref writer);
            writer.FreezeRow(0, 3);
            FillRowData(spreadList, ref writer);
            writer.SyncColumnsWidth(10);
            writer.Render();
        }

        private void FilterBlock(GetAllSpreadCriteria criteria, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(10, 0);
            var normalFont = writer.GetFont(11, 0);
            var lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, criteria.LeagueName, normalFont, "\n");

            var contentRichTextString = contentRender.Render();
            var contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
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
            writer.CopyRows(3, 1);
        }

        private void FillRowData(IEnumerable<SpreadInfoModel> spreads, ref ExcelTemplateWriter writer)
        {
            for (var i = 0; i < spreads.Count(); i++)
            {
                var styleIndex = (i % 2 == 0) ? 4 : 5;
                var item = spreads.ElementAt(i);

                var record = new object[]
                {
                    i + 1,
                    item.LeagueId,
                    item.LeagueName,
                    item.BetTypeId,
                    item.BetTypeName,
                    item.Spread
                };
                writer.WriteRow(styleIndex, record);
            }
        }
        #endregion
    }
}
