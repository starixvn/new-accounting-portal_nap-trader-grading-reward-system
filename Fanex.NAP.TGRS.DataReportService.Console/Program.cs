namespace Fanex.NAP.TGRS.DataReportService.Console
{
    using DataReportService;
    using Fanex.Data;
    using System.Collections.Generic;
    using System.Linq;

    internal class Program
    {
        private static void Main(string[] args)
        {
            DbSettingProviderManager
                .StartNewSession()
                .UseDefaultConnectionStringProvider()
                .UseDefaultDbSettingProvider(resourcePath: "~/App_Data", enableWatching: true)
                .Run();

            var data = DataCaptureSerivce.GetChangedData();

            var result = new Queue<string>();

            var arr = data.GroupBy(c => c.MatchId).ToArray();

            DataCaptureSerivce.RenderMsg(arr, 0, arr.Length - 1, result);

            var str = string.Join("\n", result);

            System.Console.WriteLine(str);

            System.Console.ReadLine();
        }
    }
}