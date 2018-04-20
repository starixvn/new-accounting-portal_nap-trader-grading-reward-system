namespace Fanex.NAP.TGRS.DataReportService.Model
{
    using RemotingRef;
    using System;

#pragma warning disable CS0660 // Type defines operator == or operator != but does not override Object.Equals(object o)
#pragma warning disable CS0661 // Type defines operator == or operator != but does not override Object.GetHashCode()
    public class ChangedMatch : ChangedDataWithHeader, IEquatable<ChangedMatch>
#pragma warning restore CS0661 // Type defines operator == or operator != but does not override Object.GetHashCode()
#pragma warning restore CS0660 // Type defines operator == or operator != but does not override Object.Equals(object o)
    {
        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string MatchName
        {
            get
            {
                return string.Format("{0} - vs - {1}", RefData.GetTeamName(HomeId.ToString(), "en"), RefData.GetTeamName(AwayId.ToString(), "en"));
            }
        }

        public override string Header => string.Format("+ {0} ({1}):", MatchName, JoinedBettypes);

        public bool Equals(ChangedMatch other)
        {
            return MatchId == other.MatchId && Equal(other);
        }

        public static bool operator ==(ChangedMatch data1, ChangedMatch data2) => data1.Equals(data2);

        public static bool operator !=(ChangedMatch data1, ChangedMatch data2) => !data1.Equals(data2);
    }
}