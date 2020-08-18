namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System.Collections.Generic;

    public class AutoTradingSimilarLeagueName
    {
        public List<int> LeagueIdList { get; set; }

        public string LeagueName { get; set; }

        public string LeagueNameOther { get; set; }

        public bool IsMerged { get; set; }
    }
}
