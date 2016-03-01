namespace Fanex.NAP.TGRS.Configuration.ViewModel.TargetedMargin
{
    using System;
    using System.Linq;
    using Models.TargetedMargin;

    public class TargetedMarginWithAllShift
    {
        private readonly string _betType;
        private readonly TargetedMarginWithShift _afternoonMargin;
        private readonly TargetedMarginWithShift _nightMargin;
        private readonly TargetedMarginWithShift _midnightMargin;

        public TargetedMarginWithAllShift(IGrouping<string, TargetedMarginWithShift> marginsGrouping)
        {
            _betType = marginsGrouping.Key;

            foreach (var marginWithShift in marginsGrouping)
            {
                switch (marginWithShift.Shift)
                {
                    case 1:
                        _afternoonMargin = marginWithShift;
                        break;

                    case 2:
                        _nightMargin = marginWithShift;
                        break;

                    case 3:
                        _midnightMargin = marginWithShift;
                        break;

                    default:
                        throw new NotImplementedException(string.Format("shift {0} is not supported", marginWithShift.Shift));
                }
            }
        }

        public string BetType
        {
            get { return _betType; }
        }

        public TargetedMarginWithShift AfternoonMargin
        {
            get { return _afternoonMargin; }
        }

        public TargetedMarginWithShift NightMargin
        {
            get { return _nightMargin; }
        }

        public TargetedMarginWithShift MidnightMargin
        {
            get { return _midnightMargin; }
        }
    }
}