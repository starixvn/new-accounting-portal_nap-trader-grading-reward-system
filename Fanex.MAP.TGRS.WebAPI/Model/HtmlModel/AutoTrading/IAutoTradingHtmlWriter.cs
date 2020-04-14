namespace Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading
{
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;
    using System.Collections.Generic;

    public interface IAutoTradingHtmlWriter
    {
        IAutoTradingHtmlWriter GenerateBeginTagHtmlBody();

        IAutoTradingHtmlWriter GenerateEndTagHtmlBody();

        IAutoTradingHtmlWriter GenerateTable(string title);

        IAutoTradingHtmlWriter GenerateTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryMonthlyInfo summaryInfo, string autoTradingName);

        IAutoTradingHtmlWriter GenerateGrandTotalTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryMonthlyInfo summaryInfo, string autoTradingName);

        IAutoTradingHtmlWriter RenderControlTable();

        IAutoTradingHtmlWriter RenderHtmlToImage(string savePath);        


    }
}
