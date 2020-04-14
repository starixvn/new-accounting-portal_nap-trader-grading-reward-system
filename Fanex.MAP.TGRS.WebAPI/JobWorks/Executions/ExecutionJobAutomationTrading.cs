namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{   
    using System.Threading.Tasks;
    using Fanex.MAP.TGRS.WebAPI.Service;
    using Quartz;    

    [PersistJobDataAfterExecution]
    [DisallowConcurrentExecution]
    public class ExecutionJobAutomationTrading : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            var service = new AutoTradingPerformanceService();
            service.GetAutoTradingPerformance();

            return Task.CompletedTask;
        }
        
    }
}