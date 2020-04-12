namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    using Quartz;
    using Quartz.Impl;
    using System.Collections.Specialized;
    using System.Threading;

    public class JobBase
    {
        public static IScheduler Scheduler
        {
            get
            {
                var properties = new NameValueCollection();

                // Setting up thread pool
                properties["quartz.threadPool.type"] = "Quartz.Simpl.SimpleThreadPool, Quartz";
                //Set the maximum number of threads in the thread pool
                properties["quartz.threadPool.threadCount"] = "5";
                //Setting the priority of each thread in the job
                properties["quartz.threadPool.threadPriority"] = ThreadPriority.Normal.ToString();

                // Remote Output Configuration
                properties["quartz.scheduler.exporter.type"] = "Quartz.Simpl.RemotingSchedulerExporter, Quartz";
                properties["quartz.scheduler.exporter.port"] = "1996";  //Configure port number
                properties["quartz.scheduler.exporter.bindName"] = "QuartzScheduler";
                properties["quartz.scheduler.exporter.channelType"] = "tcp"; //Protocol type

                var schedulerFactory = new StdSchedulerFactory(properties);

                //start-up
                var scheduler = schedulerFactory.GetScheduler();

                return scheduler.Result;
            }
        }

        public static void AddSchedule<T>(JobServer<T> jobServer, ITrigger trigger, string jobName, string jobGroup) where T : IJob
        {
            jobServer.JobName = jobName;
            jobServer.JobGroup = jobGroup;

            Scheduler.ScheduleJob(jobServer.CreateJob(), trigger);
        }
    }
}