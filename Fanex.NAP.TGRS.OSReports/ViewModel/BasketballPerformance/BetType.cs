namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using System;

    [Serializable]
    public class BetType
    {
        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsDefaultCheck { get; set; }
    }
}
