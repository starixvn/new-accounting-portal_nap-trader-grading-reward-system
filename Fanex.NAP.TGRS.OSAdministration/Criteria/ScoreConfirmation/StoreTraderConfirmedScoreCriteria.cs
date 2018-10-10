// --------------------------------------------------------------------------
// <copyright file="StoreTraderConfirmedScoreCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using System;
    using System.Collections.Generic;

    public class StoreTraderConfirmedScoreCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public string PeriodName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsOverwrite { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderConfirmedScoresInsert";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
