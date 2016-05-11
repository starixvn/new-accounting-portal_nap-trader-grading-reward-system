using Fanex.NAP.TGRS.Core.BaseClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace Fanex.NAP.TGRS.Reports.Controllers
{
    public class TraderController : TGRSBaseController
    {
        public TraderController() { }

        public ActionResult Index()
        {
            return View();
        }
    }
}