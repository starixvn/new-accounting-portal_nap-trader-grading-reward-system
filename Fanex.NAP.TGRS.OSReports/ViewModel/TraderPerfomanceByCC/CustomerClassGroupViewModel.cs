namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC
{
    using System.Collections.Generic;

    public class CustomerClassGroupViewModel
    {
        public IEnumerable<CustomerClassViewModel> CustomerClassGroup { get; set; }

        public string ClassList { get; set; }
    }
}