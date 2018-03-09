namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.Linq;

    [JsonObject]
    public class Trader
    {
        public static JObject Columns { get; }

        private string _products;

        [JsonIgnore]
        public int TraderId { get; set; }

        public string Grade { get; set; }

        [JsonProperty("Team")]
        public string TeamName { get; set; }

        [JsonProperty("Shift")]
        public string ShiftName { get; set; }

        [JsonIgnore]
        public int ShiftOrder
        {
            get
            {
                switch (ShiftName)
                {
                    case "Morning S.1": return 1;
                    case "Afternoon S.1": return 2;
                    case "Afternoon S.2": return 3;
                    case "Night S.1": return 4;
                    case "Special S.1": return 5;
                    case "Special S.2": return 6;
                    case "Special Team": return 7;
                    case "Support Team": return 8;
                    case "SMS 1x2": return 9;
                    case "CTI 1x2": return 10;
                    default: return 99;
                }
            }
        }

        public string Product
        {
            get { return _products; }

            set
            {
                if (string.IsNullOrEmpty(value))
                {
                    _products = null;
                    return;
                }

                var table = new HashSet<Bettype>(value.Split(',').Where(str => !string.IsNullOrWhiteSpace(str) && str != "*").Select(id => (Bettype)int.Parse(id)));

                var tmp = "";

                if (table.Contains(Bettype.OP)) tmp = table.Count > 1 ? "/OP" : "OP";

                table.Remove(Bettype.OP);

                var s = table.OrderBy(bt => (int)bt).Select(bt => bt.GetString());

                _products = string.Join("/", s) + tmp;
            }
        }

        [JsonProperty("Trader")]
        public string TraderName { get; set; }

        public string Remark { get; set; }

        static Trader()
        {
            Columns = ViewModelHelper.GetJColumns<Trader>();
        }
    }
}