namespace Fanex.MAP.TGRS.WebAPI.Controllers
{
    using Fanex.MAP.TGRS.WebAPI.Service;
    using System;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web;
    using System.Web.Http;

    public class AutoTradingController : ApiController
    {
        private const string FileEventLeaguePerformance = @"~\ExcelTemplate\AutoTrading\EventLeagueDetailPerformance.xlsx";
        private readonly IAutoTradingPerformanceService _service;

        public AutoTradingController()
        {
            _service = new AutoTradingPerformanceService();
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingTAMonthly()
        {
            try
            {               
                var byteImages = _service.GetAutoTradingTAMonthly();

                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(byteImages);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return response;
            }
            catch (Exception ex)
            {
                return ResponseException(ex);
            }           
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingPTAndAfterVRAdjustment()
        {
            try
            {
                var byteImages = _service.GetAutoTradingPTAndAfterVRAdjustment();

                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(byteImages);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return response;
            }
            catch (Exception ex)
            {
                return ResponseException(ex);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingRT3AndTAComparition()
        {
            try
            {
                var byteImages = _service.GetAutoTradingRT3AndTAComparition();

                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(byteImages);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return response;
            }
            catch (Exception ex)
            {
                return ResponseException(ex);
            }            
        }

        [HttpGet]
        public HttpResponseMessage GetAutoTradingEventLeaguesExcel()
        {
            try
            {
                var templatePath = HttpContext.Current.Server.MapPath(FileEventLeaguePerformance);

                var excelBytes = _service.GetAutoTradingEventLeaguesExcel(templatePath);

                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(excelBytes);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return response;
            }
            catch (Exception ex)
            {
                return ResponseException(ex);
            }
        }

        private HttpResponseMessage ResponseException(Exception ex)
        {
            var responseException = new HttpResponseMessage(HttpStatusCode.InternalServerError);
            responseException.Content = new StringContent(ex.Message + ex.StackTrace);

            return responseException;
        }

    }
}
