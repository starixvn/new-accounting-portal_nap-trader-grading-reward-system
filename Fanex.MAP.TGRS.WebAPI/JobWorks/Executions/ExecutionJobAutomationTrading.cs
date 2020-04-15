namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Fanex.MAP.TGRS.WebAPI.Service;
    using Quartz;    

    [PersistJobDataAfterExecution]
    [DisallowConcurrentExecution]
    public class ExecutionJobAutomationTrading : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            IAutoTradingPerformanceService service = new AutoTradingPerformanceService();
            var tasks = new List<Task>();

            tasks.Add(Task.Run(() => service.WriteAutoTradingTAMonthly()));
            tasks.Add(Task.Run(() => service.WriteAutoTradingPTAndAfterVRAdjustment()));
            tasks.Add(Task.Run(() => service.WriteAutoTradingRT3AndTAComparition()));

            Task.WhenAll(tasks.ToArray()).Wait();

            //var letstalkService = new LetstalkService();
            //letstalkService.Info("Auto Trading test");

            return Task.CompletedTask;
        }
    }
}