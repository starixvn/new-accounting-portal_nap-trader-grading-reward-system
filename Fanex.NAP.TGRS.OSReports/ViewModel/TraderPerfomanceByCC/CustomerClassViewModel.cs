namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC
{
    using System.Collections.Generic;

    public class CustomerClassViewModel
    {
        public string CustomerClassGroupName { get; set; }

        public int CustomerClassGroupID { get; set; }

        public IEnumerable<int> ClassList { get; set; }
    }
}