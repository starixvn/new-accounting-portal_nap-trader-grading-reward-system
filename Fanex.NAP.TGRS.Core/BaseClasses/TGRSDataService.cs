namespace Fanex.NAP.TGRS.Core.BaseClasses
{
    using Fanex.Data;    
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
    using System;
    using System.Collections;
    using System.Collections.Generic;

    public class TGRSDataService
    {
        public IEnumerable<T> GetData<T>(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.Query<T>(criteria);
            }
        }

        public void Execute(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
            }
        }

        public virtual CommandResult UpdateData(CriteriaBase criteria, string prefix)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
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

        public T GetSingle<T>(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.QueryEntity<T>(criteria);
            }
        }
    }
}
