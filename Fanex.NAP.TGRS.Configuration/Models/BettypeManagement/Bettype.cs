namespace Fanex.NAP.TGRS.Configuration.Models.BettypeManagement
{
    using Newtonsoft.Json;

    [JsonObject]
    public class Bettype
    {
        [JsonProperty("Bet Type Name")]
        public string BettypeName { get; set; }

        [JsonProperty("Bet Type ID")]
        public int BettypeId { get; set; }

        public string Group { get; set; }

        [JsonProperty("Operator Type")]
        public int OperatorType { get; set; }

        [JsonProperty("Assignment Bet Type")]
        public int AssignmentType { get; set; }

        [JsonIgnore]
        public bool IsDisabled { get; set; }

        [JsonProperty("Used For Juice")]
        public bool IsUsedForJuice { get; set; }

        [JsonProperty("Active")]
        public bool IsActive { get { return !IsDisabled; } }
    }
}