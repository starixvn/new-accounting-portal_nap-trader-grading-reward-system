// --------------------------------------------------------------------------
// <copyright file="GradeHistory.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.2">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// Bet type performance view model.
    /// </summary>
    [Serializable]
    public class GradeHistory
    {
        public GradeHistory()
        {
            this.GradeHistoryGeneral = new List<GradeHistoryGeneralItem>();
            this.GradeHistoryDetail = new List<GradeHistoryDetail>();
        }

        public List<GradeHistoryGeneralItem> GradeHistoryGeneral { get; set; }

        public List<GradeHistoryDetail> GradeHistoryDetail { get; set; }

        /// <summary>
        /// Adds an item to the grade history.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddGradeHistoryGeneral(GradeHistoryGeneral item)
        {
            if (item != null)
            {
                this.GradeHistoryGeneral.Add(new GradeHistoryGeneralItem(item));
            }
        }

        /// <summary>
        /// Adds an item to the grade history detail.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddGradeHistoryDetail(GradeHistoryDetail item)
        {
            if (item != null)
            {
                this.GradeHistoryDetail.Add(item);
            }
        }
    }
}