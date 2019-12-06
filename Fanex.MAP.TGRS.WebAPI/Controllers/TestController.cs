namespace Fanex.MAP.TGRS.WebAPI.Controllers
{
    using Fanex.NAP.TGRS.WebAPI.Criteria;
    using Fanex.NAP.TGRS.WebAPI.InputModel;
    using Fanex.NAP.TGRS.WebAPI.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Web;
    using System.Web.Mvc;

    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetTraderPerformace()
        {
            var criteria = new TraderPerformanceParam
            {
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                TraderIds = "",
                MajorBettypeIds = ""
            };

            using (var client = new HttpClient())
            {
                //HTTP POST
                var postTask = client.PostAsJsonAsync<TraderPerformanceParam>("http://localhost:57579/TGRS/Trader/GetPerformanceDetails", criteria);
                postTask.Wait();

                var result = postTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
            }

            return View();
        }
    }
}