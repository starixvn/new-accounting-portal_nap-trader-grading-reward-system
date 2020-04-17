namespace Fanex.MAP.TGRS.WebAPI.Controllers
{
    using Fanex.MAP.TGRS.WebAPI.Service;
    using System;
    using System.Drawing;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Web.Http;

    public class AutoTradingController : ApiController
    {
        private readonly IAutoTradingPerformanceService _service;

        public AutoTradingController()
        {
            _service = new AutoTradingPerformanceService();
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingTAMonthly()
        {
            var byteImages = _service.GetAutoTradingTAMonthly();

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ByteArrayContent(byteImages);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return response;
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingPTAndAfterVRAdjustment()
        {
            var byteImages = _service.GetAutoTradingPTAndAfterVRAdjustment();

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ByteArrayContent(byteImages);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return response;
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingRT3AndTAComparition()
        {
            var byteImages = _service.GetAutoTradingRT3AndTAComparition();

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ByteArrayContent(byteImages);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return response;
        }
    }
}
