namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using System;

    [Serializable]
    public class WeekRange
    {
        public WeekRange() { }

        public bool IsView {
            get { return !string.IsNullOrEmpty(this.WeekRangeFrom) || !string.IsNullOrEmpty(this.WeekRangeTo); }
        }

        public string WeekRangeFrom { get; set; }

        public string WeekRangeTo { get; set; }

        public DateTime GetFromDate()
        {
            var dateTime = new DateTime();

            if (!string.IsNullOrEmpty(this.WeekRangeFrom))
            {
                var arrDate = this.WeekRangeFrom.Split('-');

                DateTime.TryParse(arrDate[0], out dateTime);
            }

            return dateTime;
        }

        public DateTime GetToDate()
        {
            var dateTime = new DateTime();

            if (!string.IsNullOrEmpty(this.WeekRangeTo))
            {
                var arrDate = this.WeekRangeTo.Split('-');

                DateTime.TryParse(arrDate[1], out dateTime);
            }

            return dateTime;
        }
    }
}