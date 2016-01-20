// -----------------------------------------------------------------------
// <copyright file="GetAllSpreadCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.SpreadManagement
{
    using Framework.Data;

    public class GetAllSpreadCriteria : CriteriaBase
    {
        public string LeagueName { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Spread_SelectAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
