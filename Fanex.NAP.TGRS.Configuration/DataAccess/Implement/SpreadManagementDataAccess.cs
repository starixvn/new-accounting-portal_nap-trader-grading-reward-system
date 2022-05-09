// --------------------------------------------------------------------------
// <copyright file="SpreadManagementDataAccess.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.22">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.DataAccess.Implement
{
    using Data;
    using Framework.Data;
    using Interface;
    using Models.SpreadManagement;
    using ViewModel.SpreadManagement;

    /// <summary>
    /// Spread management data access.
    /// </summary>
    public class SpreadManagementDataAccess : ISpreadManagementDataAccess
    {
        public SpreadInfoList GetAllSpread(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                var data = db.Query<SpreadInfoModel>(criteria.GetSpParams());
                var hashParams = db.GetOutputParams();
                var totalItem = 0;
                if (hashParams != null && hashParams.ContainsKey("rowcount"))
                {
                    totalItem = (int)hashParams["rowcount"];
                }
                
                var result = new SpreadInfoList
                {
                    TotalItem = totalItem,
                    SpreadInfoItems = data
                };

                return result;
            }
        }
    }
}