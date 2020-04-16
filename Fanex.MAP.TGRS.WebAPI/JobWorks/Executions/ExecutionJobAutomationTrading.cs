namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Threading.Tasks;
    using Fanex.LetstalkService.Core.Models;
    using Fanex.MAP.TGRS.WebAPI.Service;
    using Quartz;
    using Fanex.LetstalkService.Core.Services;

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

            var attachmentList = GetAttachmentList();
            var letstalkService = new LetstalkService(attachmentList);           
            var success = letstalkService.Info("Auto Trading Test");           

            return Task.CompletedTask;
        }

        private List<LetstalkAttachment> GetAttachmentList()
        {
            var attatchment = new List<LetstalkAttachment>();
            var path = AppDomain.CurrentDomain.BaseDirectory + JobSettings.AutoTradingConfig.FolderImagePath;

            var filePaths = Directory.GetFiles(path).ToList();

            filePaths.ForEach(fileName =>
            {
                attatchment.Add(new LetstalkAttachment
                {
                    FileName = fileName,
                    Bytes = FileBinaryService.ConvertFileToBinary(fileName)
                });
            });

            return attatchment;
        }
    }
}