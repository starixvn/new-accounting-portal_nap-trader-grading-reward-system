namespace Fanex.NAP.TGRS.Core.Helpers
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Linq;
    using System.Reflection;

    public static class ViewModelHelper
    {
        public static string GetColumns<TModel>()
        {
            var t = typeof(TModel);

            var col =
                t.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.CanRead && p.GetCustomAttribute<JsonIgnoreAttribute>() == null)
                .Select(p => string.Format("\"{0}\"", GetColumnName(p)));

            return string.Join(", ", col);
        }

        public static JObject GetJColumns<TModel>()
        {
            var t = typeof(TModel);

            var dict =
                t.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.CanRead && p.GetCustomAttribute<JsonIgnoreAttribute>() == null)
                .OrderByDescending(p => p.DeclaringType == t.BaseType)
                .ToDictionary(p => p.Name, GetColumnName);

            return JObject.FromObject(dict);
        }

        private static string GetColumnName(PropertyInfo prop)
        {
            var attr = prop.GetCustomAttribute<JsonPropertyAttribute>();

            return (attr == null) ? prop.Name : attr.PropertyName;
        }
    }
}