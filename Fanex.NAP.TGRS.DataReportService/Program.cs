namespace Fanex.NAP.TGRS.DataReportService
{
    using Fanex.Data;
    using System.ServiceProcess;

    public static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main()
        {
            DbSettingProviderManager
                .StartNewSession()
                .UseDefaultConnectionStringProvider()
                .UseDefaultDbSettingProvider(resourcePath: "~/App_Data/UAT", enableWatching: true)
                .Run();

            ServiceBase[] ServicesToRun;

            ServicesToRun = new ServiceBase[]
            {
                new DataCaptureSerivce()
            };

            ServiceBase.Run(ServicesToRun);
        }
    }
}