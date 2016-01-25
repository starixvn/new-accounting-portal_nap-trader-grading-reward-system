// --------------------------------------------------------------------------
// <copyright file="ExcelTemplateWriter.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Simon.Huynh" date="2015.1.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.ExcelUtility
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;

    public class ObjectMapper
    {
        private static Type ignoreAttr = typeof(Ignore);

        private static Type columnAttr = typeof(Column);

        private static Type objType = typeof(object);

        private static Type doubleType = typeof(double);

        public IDictionary<string, Action<T, object>> GetSetters<T>()
        {
            var genericType = typeof(T);
            var properties = genericType.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.GetCustomAttributes(ignoreAttr, true) == null).ToArray();
            var map = new Dictionary<string, Action<T, object>>(properties.Length);

            foreach (var property in properties)
            {
                var key = GetName(property);
                map.Add(key, GetSetter<T>(genericType, property));
            }

            return map;
        }

        public IList<Func<T, object>> GetGetters<T>()
        {
            var genericType = typeof(T);
            var properties = genericType.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.GetCustomAttributes(ignoreAttr, true) == null).ToArray();
            var getters = new List<Func<T, object>>(properties.Length);

            foreach (var property in properties)
            {
                getters.Add(GetGetter<T>(genericType, property));
            }

            return getters;
        }

        public string[] GetPropertiesName<T>()
        {
            return typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public).Select(p => GetName(p)).ToArray();
        }

        protected virtual string GetName(PropertyInfo property)
        {
            var attribute = property.GetCustomAttributes(columnAttr, true).FirstOrDefault();

            return attribute != null ? (attribute as Column).ColumnName : property.Name;
        }

        protected virtual Action<T, object> GetSetter<T>(Type type, PropertyInfo property)
        {
            var firstArg = Expression.Parameter(type);
            var propertyExp = Expression.Property(firstArg, property);

            var secondArg = Expression.Parameter(objType);

            Expression realSecondArg;
            if (property.PropertyType.IsValueType)
            {
                realSecondArg = Expression.Convert(Expression.Convert(secondArg, doubleType), property.PropertyType);
            }
            else
            {
                realSecondArg = Expression.Convert(secondArg, property.PropertyType);
            }

            var body = Expression.Assign(propertyExp, realSecondArg);

            return Expression.Lambda<Action<T, object>>(body, firstArg, secondArg).Compile();
        }

        protected virtual Func<T, object> GetGetter<T>(Type type, PropertyInfo property)
        {
            var arg = Expression.Parameter(type);
            var body = property.PropertyType.IsValueType ?
                Expression.Convert(Expression.Property(arg, property), typeof(object)) as Expression :
                Expression.Property(arg, property);
            return Expression.Lambda<Func<T, object>>(body, arg).Compile();
        }
    }
}