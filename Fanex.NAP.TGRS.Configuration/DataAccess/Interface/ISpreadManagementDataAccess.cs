// --------------------------------------------------------------------------
// <copyright file="ISpreadManagementDataAccess.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.1.22">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.DataAccess.Interface
{
    using Framework.Data;
    using ViewModel.SpreadManagement;

    public interface ISpreadManagementDataAccess
    {
        SpreadInfoList GetAllSpread(ICriteria criteria);
    }
}