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

                var table = new HashSet<Bettype>(value.Split(',').Where(str => !string.IsNullOrWhiteSpace(str)).Select(id => (Bettype)int.Parse(id)));

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