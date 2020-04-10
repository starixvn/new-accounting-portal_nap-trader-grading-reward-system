namespace Fanex.NAP.TGRS.Reports.JobWorks
{
    using System.Threading.Tasks;
    using Quartz;

    [PersistJobDataAfterExecution]
    [DisallowConcurrentExecution]
    public class ExecutionJobAutomationTrading : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {

            return Task.CompletedTask;
        }
    }
}