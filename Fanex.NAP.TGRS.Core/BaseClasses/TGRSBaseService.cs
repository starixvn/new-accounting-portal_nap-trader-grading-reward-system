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
    using Fanex.Data;
    using Fanex.Data.Repository;
    using Fanex.NAP.Framework.Command;
    using System;
    using System.Collections;
    using System.Collections.Generic;

    /// <summary>
    /// Base Service.
    /// </summary>
    public class TGRSBaseService
    {
        public IEnumerable<T> GetData<T>(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.Query<T>(criteria);
            }
        }

        public void Execute(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
            }
        }

        public virtual CommandResult UpdateData(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {               
                db.ExecuteNonQuery(criteria);

                var hashParams = db.GetOutputParams();

                return GetCommandResult(hashParams);
            }
        }        

        /// <summary>
        /// Gets the command result.
        /// </summary>        
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

        public T GetSingle<T>(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.QueryEntity<T>(criteria);
            }
        }
    }
}