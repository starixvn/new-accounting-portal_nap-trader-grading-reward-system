namespace Fanex.NAP.TGRS.OSReports.Models.Dashboard
{
    public class TopSport
    {
        public string SportName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public decimal Margin
        {
            get
            {
                return decimal.Round(Turnover > 0 ? Winloss / Turnover * 100 : 0, 4);
            }
        }
    }
}
