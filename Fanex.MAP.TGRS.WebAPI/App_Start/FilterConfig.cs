using System.Web;
using System.Web.Mvc;

namespace Fanex.NAP.TGRS.WebAPI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
