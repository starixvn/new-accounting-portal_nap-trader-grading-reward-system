namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    /// <summary>
    /// Bet type view model.
    /// </summary>
    [Serializable]
    public class BetTypeItem
    {
        public BetTypeItem(BetTypeInfo betType)
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