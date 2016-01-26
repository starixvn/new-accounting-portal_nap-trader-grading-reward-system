// -----------------------------------------------------------------------
// <copyright file="UpdateSpreadCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.1.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.SpreadManagement
{
    using Framework.Data;

    public class UpdateSpreadCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public string SpreadDoc { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

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
