namespace Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading
{
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;
    using System.Collections.Generic;
    
    public interface IAutoTradingHtmlWriter
    {
        IAutoTradingHtmlWriter GenerateBeginTagHtmlBody();

        IAutoTradingHtmlWriter GenerateEndTagHtmlBody();

        IAutoTradingHtmlWriter GenerateTable(string title, string autoTradingName, bool isGenerateTableHeaderTh = true);

        IAutoTradingHtmlWriter GenerateTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryInfo summaryInfo, string autoTradingName);

        IAutoTradingHtmlWriter GenerateGrandTotalTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryInfo summaryInfo, string autoTradingName);        

        IAutoTradingHtmlWriter GenerateHeaderEmptyTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryInfo summaryInfo, string autoTradingName);

        IAutoTradingHtmlWriter GenerateHeaderEmptyGrandTotalTableTr(IEnumerable<AutoTradingModelPerformanceInfo> autoTradingInfos, AutoTradingSummaryInfo summaryInfo, string autoTradingName);

        IAutoTradingHtmlWriter RenderControlTable();

        IAutoTradingHtmlWriter GenerateEmptyRows();

        IAutoTradingHtmlWriter RenderHtmlToImage(string savePath);

    }
}