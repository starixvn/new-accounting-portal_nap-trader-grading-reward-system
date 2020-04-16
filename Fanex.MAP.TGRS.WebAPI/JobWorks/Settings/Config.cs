using System;

namespace Fanex.MAP.TGRS.WebAPI.JobWorks
{
    public class Config
    {
        public int JobEveryDayRunningHour { get; set; }

        public int JobEveryDayRunningMinute { get; set; }

        public DayOfWeek JobExecuteDayOfWeek { get; set; }

        public string TargetName { get; set; }

        public string Group { get; set; }

        public string FolderImagePath { get; set; }
    }
}