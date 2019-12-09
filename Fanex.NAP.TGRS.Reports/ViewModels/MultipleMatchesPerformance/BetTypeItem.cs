namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    /// <summary>
    /// Bet type detail view model.
    /// </summary>
    [Serializable]
    public class BetTypeItem
    {
        public BetTypeItem(){ }

        public BetTypeItem(BetTypeInfo betType)
        {
            if (betType != null)
            {
                this.BetType = Converter.To<short>(betType.BetType);
                this.TypeName = betType.TypeName;
                this.Turnover = Converter.ToDecimal(betType.Turnover);
                this.WinLoss = Converter.ToDecimal(betType.WinLoss);
                this.BetCount = Converter.ToInt(betType.BetCount);
                this.Margin = betType.Margin;               
            }
        }

        public short BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }       
    }
}