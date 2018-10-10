// --------------------------------------------------------------------------
// <copyright file="TGRSBaseService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.BaseClasses
{
    using System;
    using System.Collections;
    using Fanex.Data;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Framework.Command;
    using Fanex.Data.Repository;

    /// <summary>
    /// Base Service.
    /// </summary>
    public class TGRSBaseService : BaseService
    {
        /// <summary>
        /// Updates the data.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The query result.</returns>
        protected virtual ICommandResult UpdateData(ICriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                var param = criteria.GetSpParams();

                db.ExecuteNonQuery(param);

                return GetCommandResult(param);
            }
        }

        /// <summary>
        /// Gets the command result.
        /// </summary>
        /// <param name="hash">The hash table.</param>
        /// <returns>CommandResult object contains error code and error message.</returns>
        private CommandResult GetCommandResult(Hashtable hash)
        {
            var errCode = hash["errcode"];
            var errMsg = hash["errmsg"];

            return new CommandResult
            {
                Code = (errCode is DBNull) ? 0 : Convert.ToInt32(errCode),
                Message = (errMsg is DBNull) ? string.Empty : Convert.ToString(errMsg)
            };
        }
    }
}