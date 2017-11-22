namespace Fanex.NAP.TGRS.Core.Helpers
{
    using Newtonsoft.Json;
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

        private static string GetColumnName(PropertyInfo prop)
        {
            var attr = prop.GetCustomAttribute<JsonPropertyAttribute>();

            return (attr == null) ? prop.Name : attr.PropertyName;
        }
    }
}