namespace Fanex.NAP.TGRS.DataReportService.Model
{
    using System.Collections.Generic;

    public class LetsTalkMessage
    {
        public string TargetName { get; set; }

        public IDictionary<string, string> Message { get; set; }
    }
}