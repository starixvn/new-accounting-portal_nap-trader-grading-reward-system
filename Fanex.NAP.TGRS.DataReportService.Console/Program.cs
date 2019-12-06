namespace Fanex.NAP.TGRS.DataReportService.Console
{
    using DataReportService;
    using Fanex.Data;
    using Fanex.NAP.TGRS.WebAPI.InputModel;
    using System;
    using System.Linq;
    using System.Net.Http;

    internal class Program
    {
        private static void Main(string[] args)
        {
            DbSettingProviderManager
                .StartNewSession()
                .UseDefaultConnectionStringProvider()
                .UseDefaultDbSettingProvider(resourcePath: "~/App_Data", enableWatching: true)
                .Run();

            /*
            var data = DataCaptureSerivce.GetChangedData();

            var result = new Queue<string>();

            var arr = data.GroupBy(c => c.MatchId).ToArray();

            DataCaptureSerivce.RenderMsg(arr, 0, arr.Length - 1, result);

            var str = string.Join("\n", result);

            System.Console.WriteLine(str);

            System.Console.ReadLine();
            */

            var criteria = new TraderPerformanceParam
            {
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                TraderIds = "",
                MajorBettypeIds = ""
            };

            using (var client = new HttpClient())
            {/*
                client.GetAsync<TraderPerformanceParam>("http://localhost:57579/TGRS/Trader/GetPerformanceDetails?FromDate");
                //HTTP POST
                var postTask = client.PostAsJsonAsync<TraderPerformanceParam>("http://localhost:57579/TGRS/Trader/GetPerformanceDetails", criteria);
                postTask.Wait();

                var result = postTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var a = 1;
                }*/
            }
        }
    }
}