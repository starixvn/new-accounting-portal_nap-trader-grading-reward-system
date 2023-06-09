namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderPerformanceByCCService : TGRSBaseService, ITraderPerformanceByCCService
    {
        public IEnumerable<TraderPerformanceByCCModel> GetTraderPerformancesByCC(GetTraderPerformanceByCCCriteria criteria)
        {
            return GetData<TraderPerformanceByCCModel>(criteria);
        }

        public IEnumerable<SportModel> GetSportFilter()
        {
            var result = this.GetData<SportModel>(new GetAllSportsCriteria());

            if (result != null && result.Any())
            {
                result = result.Where(c => c.SportId == 2 || c.SportId == 43);
            }

            return result ?? new List<SportModel>();
        }

        public IEnumerable<CustomerClassViewModel> GetCTSCustomerClassFilter()
        {
            var data = GetData<CustomerClassModel>(new GetCTSCustomerClassCriteria());
            var result = new List<CustomerClassViewModel>();

            if (data != null && data.Any())
            {
                result = data.GroupBy(c => new { c.CustomerClassGroupID, c.CustomerClassGroupName })
                             .Select(x => new { Group = x.Key, ClassList = x.ToList() })
                             .Select(x => new CustomerClassViewModel
                             {
                                CustomerClassGroupID = x.Group.CustomerClassGroupID,
                                CustomerClassGroupName = x.Group.CustomerClassGroupName,
                                ClassList = x.ClassList.Select(z => z.CustomerClass)
                             }).ToList();
            }

            return result;
        }
    }
}