namespace Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement
{
    using System;

    public class Error
    {
        public DateTime Date { get; set; }

        public int Value { get; set; }

        public string Reason { get; set; }

        public string Creator { get; set; }
    }
}