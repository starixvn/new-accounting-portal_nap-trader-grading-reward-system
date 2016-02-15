using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.Configuration.Services.Interface;

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    public class TargetedMarginController : TGRSBaseController
    {
        IProfitMarginService _service;

        public TargetedMarginController(IProfitMarginService service)
        {
            _service = service;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAllMargin()
        {
            return Json(_service.GetMargin(), JsonRequestBehavior.AllowGet);
        }
    }
}
