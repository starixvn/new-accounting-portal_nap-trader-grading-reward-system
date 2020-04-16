namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Quartz;

    public class AutomationTradingTrigger
    {
        public ITrigger GenerateTrigger()
        {
            //var cron = JobSettings.AutoTradingConfig.JobCronEveryDay;

            var trigger = TriggerBuilder.Create()
                .WithIdentity("TGR-Auto-Trading", "TGR-Auto-Trading")
            //.WithDailyTimeIntervalSchedule(s => s
            //  .OnEveryDay()
            //  .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(15, 11))
            //  .EndingDailyAfterCount(3))
            //  .Build();
            .WithSimpleSchedule(x => x
                .WithIntervalInMinutes(2) //Execute every 1 minutes
                .RepeatForever())
            .Build();

            return trigger;
        }

    }
}