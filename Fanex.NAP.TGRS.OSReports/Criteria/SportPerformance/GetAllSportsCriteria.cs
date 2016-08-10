// -----------------------------------------------------------------------
// <copyright file="GetAllSportsCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance
{
    using Fanex.NAP.Framework.Data;

    public class GetAllSportsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_SportGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}