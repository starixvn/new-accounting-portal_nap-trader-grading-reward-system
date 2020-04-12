namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Quartz;

    public class AutomationTradingTrigger
    {
        public ITrigger GenerateTrigger()
        {
            var trigger = TriggerBuilder.Create()
                .WithIdentity("Add messages to logs", "Job Trigger")
                .WithSimpleSchedule(x => x
                    .WithIntervalInMinutes(1) //Execute every 1 minutes
                    .RepeatForever())
                .Build();

            return trigger;
        }

    }
}