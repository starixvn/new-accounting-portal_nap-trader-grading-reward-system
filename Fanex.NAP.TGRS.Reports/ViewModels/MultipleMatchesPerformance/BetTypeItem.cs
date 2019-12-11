namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;    
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    /// <summary>
    /// Bet type detail view model.
    /// </summary>
    [Serializable]
    public class BetTypeItem
    {
        public BetTypeItem(){ }

        public BetTypeItem(BetTypeInfo betType, List<BetTypeDefaultItem> betTypeDefaultItems)
        {
            if (betType != null)
            {
                this.BetType = Converter.To<short>(betType.BetType);
                var typeNames = betTypeDefaultItems.Where(c => c.BetTypeId == this.BetType).Select(c => c.BetTypeName).ToList();
                this.TypeName = typeNames.Any() ? typeNames[0] : string.Empty;
                this.Turnover = Converter.ToDecimal(betType.Turnover);
                this.WinLoss = Converter.ToDecimal(betType.WinLoss);
                this.BetCount = Converter.ToInt(betType.BetCount);
                this.Margin = Converter.ToDecimal(betType.Margin);
            }
        }

        public short BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }       
    }
}