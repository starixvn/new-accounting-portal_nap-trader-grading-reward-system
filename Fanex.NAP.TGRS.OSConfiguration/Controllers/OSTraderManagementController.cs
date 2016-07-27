namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Core.BaseClasses;
    using System.Web.Mvc;

    public class OSTraderManagementController : TGRSBaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTeamList()
        {
            return null;
        }

        public JsonResult AddNewTeam(string newTeam)
        {
            return null;
        }

        public JsonResult EditTeam(int teamId, string newName)
        {
            return null;
        }
    }
}