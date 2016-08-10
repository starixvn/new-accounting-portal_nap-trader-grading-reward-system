using Microsoft.Practices.ObjectBuilder2;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Fanex.NAP.Core.Business;

    public class OSSettingController : TGRSBaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult UpdateGlobalTarget(double globalTarget)
        {
            return Json(new { Code = 5, Message = "fack" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTarget()
        {
            var tmp = new
            {
                SportId = 1,
                SportName = "adfadf",
                LeagueId = 8,
                LeagueName = "adfad",
                BettypeId = 7,
                BetTypeName = "adfadf",
                Target = 5.7
            };
            return Json(new[] { tmp }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SuggestSport(string sportName)
        {
            var tmp = new[]
            {
                new {SportId = 0, SportName = "abcdef"},
                new {SportId = 1, SportName = "badafsdfs"}
            };

            return Json(tmp, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SuggestLeague(string sportId, string leagueName)
        {
            var tmp = new[]
            {
                new {LeagueId = 0, LeagueName = "abcdef"},
                new {LeagueId = 1, LeagueName = "badafsdfs"}
            };

            return Json(tmp, JsonRequestBehavior.AllowGet);
        }
    }
}