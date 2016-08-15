using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement
{
    public class Setting
    {
        public int SpecialTargetId { get; set; }

        public int? SportId { get; set; }

        public string SportName { get; set; }

        public int? LeagueId { get; set; }

        public string LeagueName { get; set; }

        public short? BettypeId { get; set; }

        public string BettypeName { get; set; }

        public double Target { get; set; }
    }
}
