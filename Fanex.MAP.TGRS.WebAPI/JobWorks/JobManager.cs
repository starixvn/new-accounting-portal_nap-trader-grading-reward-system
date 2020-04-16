namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Fanex.MAP.TGRS.WebAPI.Consts;
    using Newtonsoft.Json;
    using Quartz.Logging;
    using System;
    using System.Configuration;
    using System.IO;    

    public class JobManager
    {
        public static void State()
        {
            LoadSettings();

            // When LibLog does not detect any other logging framework to be present, it will be silent. 
            // We can configure a custom logger provider that just logs to console show the output if you don’t have logging framework setup ready yet.
            LogProvider.SetCurrentLogProvider(new ConsoleLogProvider());

            // Add Schedule for Automation Trading
            JobBase.AddSchedule(
                new JobServer<ExecutionJobAutomationTrading>(),
                new AutomationTradingTrigger().GenerateTrigger(),
                "Automation Trading",
                "Automation Trading");

            // Open dispatching            
            JobBase.Scheduler.Start();
        }

        public static void Shutdown()
        {
            JobBase.Scheduler.Shutdown();
        }

        public static void LoadSettings()
        {
            var enviroment =  ConfigurationManager.AppSettings[Consts.Environment];
            var fileName = enviroment == "3" ? "AutoTradingSetting_pro.json" : "AutoTradingSetting_local.json";

            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);
            var json = File.ReadAllText("JobWorks/Settings/" + fileName);
            JobSettings.AutoTradingConfig = JsonConvert.DeserializeObject<Config>(json);
        }
    }
}