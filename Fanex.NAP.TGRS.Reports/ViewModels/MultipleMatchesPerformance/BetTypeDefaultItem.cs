namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;

    [Serializable]
    public class BetTypeDefaultItem
    {
        public BetTypeDefaultItem(BetTypeDefaultInfo betType)
        {
            if (betType != null)
            {
                this.BetTypeId = betType.BetType;
                this.BetTypeName = betType.TypeName;
                this.IsDefaultCheck = betType.IsDefault;
            }
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsDefaultCheck { get; set; }
    }
}