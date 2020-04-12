namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Quartz;

    public class JobServer<T> where T : IJob
    {
        public string JobName { get; set; }

        public string JobGroup { get; set; }

        public IJobDetail CreateJob()
        {
            var job = JobBuilder.Create<T>()
                .WithIdentity(JobName, JobGroup)
                .Build();

            return job;
        }
    }
}