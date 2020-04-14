namespace Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading
{
    public class AutoTradingRangeHeader
    {
        public AutoTradingRangeHeader(string text, int rowSpan, int columnSpan, int width)
        {
            this.Text = text;
            this.RowSpan = rowSpan;
            this.ColumnSpan = columnSpan;
            this.Width = width;
        }

        public string Text { get; set; }

        public int RowSpan { get; set; }

        public int ColumnSpan { get; set; }

        public int Width { get; set; }
    }
}