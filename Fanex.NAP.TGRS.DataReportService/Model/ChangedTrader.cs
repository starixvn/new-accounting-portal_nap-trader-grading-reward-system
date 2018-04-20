#pragma warning disable CS0660 // Type defines operator == or operator != but does not override Object.Equals(object o)
#pragma warning disable CS0661 // Type defines operator == or operator != but does not override Object.GetHashCode()

namespace Fanex.NAP.TGRS.DataReportService.Model
{
    using System;

    public class ChangedTrader : ChangedDataWithHeader, IEquatable<ChangedTrader>

    {
        public string TraderName { get; set; }

        public override string Header => string.Format("+ {0} ({1}):", TraderName, JoinedBettypes);

        public bool Equals(ChangedTrader other)
        {
            return TraderName == other.TraderName && Equal(other);
        }

        public static bool operator ==(ChangedTrader data1, ChangedTrader data2) => data1.Equals(data2);

        public static bool operator !=(ChangedTrader data1, ChangedTrader data2) => !data1.Equals(data2);
    }
}

#pragma warning restore CS0661 // Type defines operator == or operator != but does not override Object.GetHashCode()
#pragma warning restore CS0660 // Type defines operator == or operator != but does not override Object.Equals(object o)