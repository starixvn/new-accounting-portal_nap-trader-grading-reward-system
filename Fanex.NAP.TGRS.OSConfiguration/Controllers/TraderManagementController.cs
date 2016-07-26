namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Simplect.Attribute;

    public class TraderManagementController : TGRSBaseController
    {
        [InjectObject]
        public TraderManagementController()
        {
        }

        public ActionResult Index()
        {

            return View();
        }
    }
}