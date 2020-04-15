namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Newtonsoft.Json;
    using Quartz.Logging;
    using System;
    using System.IO;

    public class JobManager
    {
        public static void State()
        {
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
            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);
            var json = File.ReadAllText("JobWorks/Settings/AutoTradingSetting_Local.json");
            JobSettings.AutoTradingConfig = JsonConvert.DeserializeObject<Config>(json);
        }
    }
}