namespace Fanex.NAP.TGRS.Websites.Controllers
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Http;

    public class DemoController : ApiController
    {
        public JsonResult getname()
        {
            var model = new {name="ken"};
            return new JsonResult() { Data = model, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}
