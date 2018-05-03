namespace Fanex.NAP.TGRS.DataReportService.Console
{
    using DataReportService;
    using Fanex.Data;

    internal class Program
    {
        private static void Main(string[] args)
        {
            DbSettingProviderManager
                .StartNewSession()
                .UseDefaultConnectionStringProvider()
                .UseDefaultDbSettingProvider(resourcePath: "~/App_Data", enableWatching: true)
                .Run();

            var service = new DataCaptureSerivce();

            DataCaptureSerivce.SendData(null);

            System.Console.ReadLine();
        }
    }
}