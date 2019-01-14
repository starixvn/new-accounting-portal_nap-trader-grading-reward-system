namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Services.Implement;
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Web.Mvc;

    [NapAuth(FunctionKey = TGRSFunctionKeys.LeagueExclusion, Policy = NAP.Core.Business.Constant.Policy.Read)]
    public class LeagueExclusionController : TGRSBaseController
    {
        private ILeagueExclusionService _leagueExclusionservice = new LeagueExclusionService();
        private ISystemConfigurationService _systemConfigservice = new SystemConfigurationService();

        public LeagueExclusionController()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.LeagueExclusion, Constant.Policy.Host);
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetLeagues()
        {
            return Json(_leagueExclusionservice.GetLeagues(), JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.LeagueExclusion, Policy = NAP.Core.Business.Constant.Policy.Host)]
        public ActionResult UpdateLeague(int leagueId, bool IsAdded)
        {
            return Json(_leagueExclusionservice.UpdateLeagueExclusion(leagueId, CurrentSession.UserId, IsAdded), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SearchLeague(string searchString)
        {
            return Json(_leagueExclusionservice.SearchLeague(searchString), JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateLeagueExclusionConfig(bool onOffValue)
        {
            return Json(_systemConfigservice.UpdateLeagueExclusionConfig(CurrentSession.UserId, onOffValue));
        }
    }
}