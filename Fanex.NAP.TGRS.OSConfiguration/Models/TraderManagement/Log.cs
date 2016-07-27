namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    using System;

    public class Log
    {
        public DateTime UpdatedTime { get; set; }

        public string Updator { get; set; }

        public string Old { get; set; }

        public string New { get; set; }
    }
}