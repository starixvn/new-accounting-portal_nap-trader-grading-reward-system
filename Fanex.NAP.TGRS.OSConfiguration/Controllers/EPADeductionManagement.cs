using System.Web.Mvc;
using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.TGRS.Core.BaseClasses;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    public class EPADeductionManagementController:TGRSBaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
