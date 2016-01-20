// -----------------------------------------------------------------------
// <copyright file="UpdateSpreadCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.SpreadManagement
{
    using Framework.Data;

    public class UpdateSpreadCriteria : CriteriaBase
    {
        public int LeagueId { get; set; }

        public int BetTypeId { get; set; }

        public int Spread { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Spread_Update";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
