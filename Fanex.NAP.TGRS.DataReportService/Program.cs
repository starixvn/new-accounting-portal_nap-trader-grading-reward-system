namespace Fanex.NAP.TGRS.DataReportService
{
    using Fanex.Data;
    using Fanex.RemotingRef;
    using System;
    using System.Configuration;
    using System.ServiceProcess;

    public static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main()
        {
            try
            {
                DbSettingProviderManager
                    .StartNewSession()
                    .UseDefaultConnectionStringProvider()
                    .UseDefaultDbSettingProvider(resourcePath: "~/App_Data/", enableWatching: true)
                    .Run();

                RefDataTypeContainer
                  .ConnectTo(new Uri(ConfigurationManager.AppSettings["Fanex.RemotingRef.Service.Url"]))
                  .FromApplication("SPU-TGRS-Data-Report-Service");


                ServiceBase[] ServicesToRun;

                ServicesToRun = new ServiceBase[]
                {
                    new DataCaptureSerivce()
                };

                ServiceBase.Run(ServicesToRun);
            }
            catch (System.Exception ex)
            {
                Logging.Logger.Log.Error(ex.Message, ex);
            }
        }
    }
}