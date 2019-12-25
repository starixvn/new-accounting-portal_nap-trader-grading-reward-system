namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;
    using System.Collections.Generic;

    public class RT3PerformanceDetailService : TGRSBaseService, IRT3PerformanceDetailService
    {
        public BetTypePerformanceList GetBetTypePerformance(ICriteria criteria)
        {
            return GenerateSampleBetTypePerformance();

        }
       
        public BetTypePerformanceList GenerateSampleBetTypePerformance()
        {
            var betTypeList = new BetTypePerformanceList();
            betTypeList.ItemList = new List<BetTypePerformanceItem>();
            betTypeList.GrandTotal = new BetTypePerformanceItem();

            for (int i = 0; i < 5; i++)
            {
                betTypeList.ItemList.Add(new BetTypePerformanceItem
                {
                    BetTypeId = 1,
                    BetTypeName = "1H HDP",
                    BetCount = 5156,
                    VirtualTotalTurnover = 3227325,
                    VirtualTotalWinLoss = 11553824,
                    VirtualTotalMargin = (3227325/ 11553824) * 100
                });
            }

            return betTypeList;
        }

    }
}