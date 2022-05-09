namespace Fanex.NAP.TGRS.WebAPI.Utilities
{
    using Fanex.Data;
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.WebAPI.Model;
    using System;
    using System.Collections.Generic;

    public static class DataService
    {
        public static IEnumerable<T> GetData<T>(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.Query<T>(criteria);
            }
        }

        public static void Execute(ICriteria criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
            }
        }

        public static DBResult UpdateData(CriteriaBase criteria, string prefix)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                var param = db.GetOutputParams();

                db.ExecuteNonQuery(param);

                var code = param["ErrCode"];
                var message = param["ErrMsg"];
                var intCode = (code is DBNull) ? 0 : Convert.ToInt32(code);
                string errorMsg = (message is DBNull) ? "" : message.ToString();

                return new DBResult
                {
                    ErrorCode = intCode,
                    ErrorMsg = errorMsg,
                    OutParam = param
                };
            }
        }

        public static T GetSingle<T>(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                return db.QueryEntity<T>(criteria);
            }
        }

        public static void QueryMultiple(CriteriaBase criteria, params Action<IMultiResultReader>[] extractors)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            using (var query = db.QueryMultiple(criteria))
            {
                for (int i = 0; i < extractors.Length; i++)
                {
                    extractors[i](query);
                }
            }
        }

        public static Tuple<IEnumerable<T>, IEnumerable<R>> QueryMultiple<T, R>(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            using (var query = db.QueryMultiple(criteria))
            {
                return Tuple.Create(query.Read<T>(), query.Read<R>());
            }
        }

        public static Tuple<IEnumerable<T>, IEnumerable<R>, IEnumerable<U>> QueryMultiple<T, R, U>(CriteriaBase criteria)
        {
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            using (var query = db.QueryMultiple(criteria))
            {
                return Tuple.Create(query.Read<T>(), query.Read<R>(), query.Read<U>());
            }
        }
    }
}