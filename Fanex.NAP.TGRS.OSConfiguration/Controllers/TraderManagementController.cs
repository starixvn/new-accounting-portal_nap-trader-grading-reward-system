namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Simplect.Attribute;

    public class OSTraderManagementController : TGRSBaseController
    {
        [InjectObject]
        public OSTraderManagementController()
        {
        }

        public ActionResult Index()
        {

            return View();
        }
    }
}